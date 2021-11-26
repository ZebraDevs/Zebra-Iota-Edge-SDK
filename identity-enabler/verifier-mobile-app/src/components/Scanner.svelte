<script lang="ts">
    import { Plugins } from '@capacitor/core';
    import '@capacitor-community/camera-preview'
    import { createEventDispatcher, onMount } from 'svelte';
    import { BrowserMultiFormatReader as BMFR, BarcodeFormat, ChecksumException, DecodeHintType, Exception, FormatException, NotFoundException, Result } from '@zxing/library';
    import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
    import { __ANDROID__, __WEB__ } from '../lib/platforms';
    import { wait } from '../lib/helpers';

    const dispatch = createEventDispatcher();
    const formats = new Map<DecodeHintType, any>().set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX]);
    const webReader = new BrowserMultiFormatReader(formats);
    const droidReader = new BMFR(formats);
    let scanCtrls: IScannerControls;
    let error: Error | undefined;
    let videoEl: HTMLVideoElement;
    let camera;

	async function showAlert(title: string, message: string) {
        const { Modals } = Plugins;
		await Modals.alert({ title, message });
	}

    const _capture = async (): Promise<void> => {
        const camCapture = await camera.capture();
        const img = new Image();
        img.src = `data:image/jpeg;base64,${camCapture.value}`;
        let result: Result;
        try {
            result = await droidReader.decodeFromImage(img);
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
            await wait(500);
            return _capture();
        }

        camera?.stop();
        camera = null;
        console.log("result", result.getText());
        dispatch('message', result.getText());
    };

    const initialise = async () => {
        if (!__WEB__) {
            const { CameraPreview} = Plugins;
            camera = CameraPreview;
            await camera.start({ position: 'rear', toBack: true, quality: 100 });
            await wait(500);
            return;
        }

        // web
        if (!navigator.mediaDevices.getUserMedia) {
            throw new Error("Browser camera access not supported.");
        }

        videoEl.srcObject = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { min: 1024, ideal: 1280, max: 1920 },
                height: { min: 576, ideal: 720, max: 1080 },
            }
        });

        webReader.decodeFromVideoElement(videoEl, (result: Result, error: Exception, ctrls: IScannerControls) => {
            scanCtrls = ctrls;
            if (error) {
                if (error instanceof NotFoundException) {
                    console.log('No code found.')
                }

                if (error instanceof ChecksumException) {
                    alert('A code was found, but it\'s read value was not valid.');
                }

                if (error instanceof FormatException) {
                    alert('A code was found, but it was in a invalid format.');
                }

                return;
            }

            scanCtrls.stop();
            console.log(result.getText(), result);
            dispatch('message', result.getText());
        });
    }

    // handles input button on web
    const imageSelected = (e: Event & { currentTarget: EventTarget & HTMLInputElement; }) => {
        const image = e.currentTarget.files[0];
        
        const fr = new FileReader();
        fr.onload = e => {
            const img = new Image();
            img.src = e.target.result as string;
            webReader.decodeFromImageElement(img)
                .then((result) => {
                    console.log("result", result.getText());
                    dispatch('message', result.getText());
                })
                .catch(e => {
                    console.error(e);
                    error = e
                });
        };
        fr.readAsDataURL(image);
    };

    onMount(() => {
        initialise()
            .then(() => {
                if (!__WEB__) {
                    return _capture();
                }
            })
            .catch((e:Error) => {
                console.error(e);
                error = e;
            });

        return () => {
            if (camera) {
                camera.stop();
                camera = null;
            }

            if (scanCtrls) {
                scanCtrls.stop();
                scanCtrls = null;
            }
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
        position: relative;
    }
    
    .video-container-android {
        height: 100%;
        width: 100%;
    }

    p {
        text-align: center;
        vertical-align: middle;
        line-height: 85vh;
        font-family: 'Proxima Nova', sans-serif;
        font-size: 6vw;
        color: #131f37;
    }

    input[type="file"] {
        display: none;
    }

    .image-select {
        border: 1px solid #ccc;
        background-color: #00A7FF;;
        display: inline-block;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        color: white;
    }
</style>

<main class:error="{Boolean(error)}">
    {#if error}
        <p>{ error.message || error }</p>
    {/if}

    <div class="video-container" class:video-container-web="{__WEB__}" class:video-container-android="{__ANDROID__}">
        {#if __WEB__}
            <!-- svelte-ignore a11y-media-has-caption -->
            <video id="video" bind:this={videoEl} playsinline></video>
        {/if}
        <svg width="204" height="204" xmlns="http://www.w3.org/2000/svg">
            <path 
                d="M167 10V0h26.976c5.523 0 10 4.477 10 10v27h-10V10H167zM36.976 10H10v27H0V10C0 4.477 4.477 0 10
                0h26.976v10zM167 194h26.976v-27h10v27c0 5.523-4.477 10-10 10H167v-10zm-130.024 0v10H10c-5.523
                0-10-4.477-10-10v-27h10v27h26.976z">
            </path>
        </svg>
    </div>

    {#if __WEB__}
        <label class="image-select">
            <input type="file" accept=".jpg, .jpeg, .png" on:change={(e) => imageSelected(e)} />
            Select Image
        </label>
    {/if}
</main>
