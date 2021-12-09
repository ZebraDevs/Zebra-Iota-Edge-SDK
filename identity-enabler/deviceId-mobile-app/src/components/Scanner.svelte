<script lang="ts">
    import { Plugins } from '@capacitor/core';
    import { createEventDispatcher, onMount } from 'svelte';
    import { BrowserMultiFormatReader, BarcodeFormat, ChecksumException, DecodeHintType, FormatException, NotFoundException, Result } from '@zxing/library';
    import { __ANDROID__, __WEB__ } from '../lib/platforms';
    import { wait } from '../lib/helpers';

    const dispatch = createEventDispatcher();
    const SAMPLING_FREQUENCY = 350;
    const formats = new Map<DecodeHintType, any>().set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX, BarcodeFormat.QR_CODE]);
    const reader = new BrowserMultiFormatReader(formats);
    let error: Error | undefined;
    let videoEl: HTMLVideoElement;

    async function showAlert(title: string, message: string) {
        const { Modals } = Plugins;
        await Modals.alert({ title, message });
    }

    const capture = async (): Promise<void> => {
        let result: Result;
        try {
            result = await reader.decodeFromVideoElement(videoEl);
        } catch (e) {
            if (e instanceof NotFoundException) {
                console.log('No code found.')
            }

            if (e instanceof ChecksumException) {
                await showAlert('Error', 'A code was found, but it\'s read value was not valid.');
            }

            if (e instanceof FormatException) {
                await showAlert('Error', 'A code was found, but it was in a invalid format.');
            }
        }

        if (!result) {
            await wait(SAMPLING_FREQUENCY);
            return capture();
        }

        dispatch('message', result.getText());
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
    }

    onMount(() => {
        initialise()
            .then(capture)
            .catch((e:Error) => {
                console.error(e);
                error = e;
            });

        return () => {
            (videoEl.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        };
    });
</script>

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

    svg {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
    }

    svg path {
        fill: white;
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
        font-family: 'Proxima Nova', sans-serif;
        font-size: 6vw;
        color: #131f37;
    }
</style>

<main class:error="{Boolean(error)}">
    {#if error}
        <p>{ error.message || error }</p>
    {:else}
        <div class="video-container" class:video-container-web="{__WEB__}" class:video-container-android="{__ANDROID__}">
            <!-- svelte-ignore a11y-media-has-caption -->
            <video id="video" bind:this={videoEl} playsinline></video>
            <svg width="204" height="204" xmlns="http://www.w3.org/2000/svg">
                <path 
                    d="M167 10V0h26.976c5.523 0 10 4.477 10 10v27h-10V10H167zM36.976 10H10v27H0V10C0 4.477 4.477 0 10
                    0h26.976v10zM167 194h26.976v-27h10v27c0 5.523-4.477 10-10 10H167v-10zm-130.024 0v10H10c-5.523
                    0-10-4.477-10-10v-27h10v27h26.976z">
                </path>
            </svg>
        </div>
    {/if}
</main>
