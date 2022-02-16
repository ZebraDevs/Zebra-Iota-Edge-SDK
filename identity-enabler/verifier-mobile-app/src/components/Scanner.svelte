<script lang="ts">
    import { createEventDispatcher, onMount, onDestroy } from "svelte";
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
    const reader = new BrowserMultiFormatReader(
        new Map().set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX, BarcodeFormat.QR_CODE])
    );
    let videoEl: HTMLVideoElement;
    let viewFinderEle: HTMLElement;
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

        videoEl.addEventListener("loadedmetadata", e => {
            videoEl.dataset.state = "visible";
            viewFinderEle.dataset.state = "visible";
        });

        videoEl.srcObject = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: { ideal: "environment" }
            }
        });
        svgVisibility = "visible";
    };

    onMount(async () => {
        try {
            await initialise();
            await capture();
        } catch (e) {
            console.error(e);
            await showAlert("Error", e.message);
        }
    });

    onDestroy(() => {
        if (videoEl?.srcObject) {
            videoEl.pause();
            const stream = videoEl.srcObject as MediaStream;
            for (const track of stream.getTracks()) {
                track.stop();
                stream.removeTrack(track);
            }
            videoEl.srcObject = null;
        }
    });
</script>

<div
    class="video-container"
    class:video-container-web={__WEB__}
    class:video-container-android={__ANDROID__}
    style="--svg-visibility: {svgVisibility}"
>
    <!-- svelte-ignore a11y-media-has-caption -->
    <video id="video" bind:this={videoEl} playsinline data-state="hidden" />
    <i class="icon-scan viewfinder" bind:this={viewFinderEle} data-state="hidden" />
</div>

<style>
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

    video[data-state="hidden"] {
        display: none;
    }

    .viewfinder[data-state="hidden"] {
        display: none;
    }
</style>
