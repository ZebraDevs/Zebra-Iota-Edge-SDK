<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import {
        BrowserMultiFormatReader,
        BarcodeFormat,
        ChecksumException,
        DecodeHintType,
        FormatException,
        NotFoundException,
        Result
    } from "@zxing/library";
    import { __ANDROID__, __WEB__ } from "../lib/platforms";
    import { wait } from "../lib/helpers";
    import { showAlert } from "../lib/ui/helpers";

    const dispatch = createEventDispatcher();
    const SAMPLING_FREQUENCY = 350;
    const formats = new Map<DecodeHintType, any>().set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.DATA_MATRIX,
        BarcodeFormat.QR_CODE
    ]);
    const reader = new BrowserMultiFormatReader(formats);
    let error: Error | undefined;
    let videoEl: HTMLVideoElement;
    let svgVisibility = "hidden";

    const capture = async (): Promise<void> => {
        let result: Result;
        try {
            result = await reader.decodeFromVideoElement(videoEl);
        } catch (e) {
            if (e instanceof NotFoundException) {
                console.log("No code found.");
            }

            if (e instanceof ChecksumException) {
                await showAlert("Error", "A code was found, but it's read value was not valid.");
            }

            if (e instanceof FormatException) {
                await showAlert("Error", "A code was found, but it was in a invalid format.");
            }
        }

        if (!result) {
            await wait(SAMPLING_FREQUENCY);
            return capture();
        }

        dispatch("message", result.getText());
    };

    const initialise = async () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            throw new Error("Browser camera access not supported.");
        }

        videoEl.srcObject = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: { ideal: "environment" }
            }
        });
        svgVisibility = "visible";
    };

    onMount(() => {
        initialise()
            .then(capture)
            .catch((e: Error) => {
                console.error(e);
                error = e;
            });

        // Unmount function
        return () => {
            if (videoEl.srcObject) {
                (videoEl.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
        };
    });
</script>

<main class:error={Boolean(error)}>
    {#if error}
        <p>{error.message || error}</p>
    {:else}
        <div
            class="video-container"
            class:video-container-web={__WEB__}
            class:video-container-android={__ANDROID__}
            style="--svg-visibility: {svgVisibility}"
        >
            <!-- svelte-ignore a11y-media-has-caption -->
            <video id="video" bind:this={videoEl} playsinline />
            <i class="icon-scan viewfinder" />
        </div>
    {/if}
</main>

<style>
    main {
        height: 92.4vh;
        flex-direction: column;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    main.error {
        background: var(--bg);
    }

    .viewfinder {
        color: rgba(255, 255, 255, 0.8);
        visibility: var(--svg-visibility);
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 204px;
    }

    .video-container {
        max-height: 85vh;
        position: relative;
    }

    video {
        width: 100%;
        height: auto;
    }

    p {
        text-align: center;
        vertical-align: middle;
        line-height: 85vh;
        font-family: "Proxima Nova", sans-serif;
        font-size: 6vw;
        color: #131f37;
    }
</style>
