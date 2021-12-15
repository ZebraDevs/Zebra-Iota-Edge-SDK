<script lang="ts">
    import { navigate } from 'svelte-routing';
    import { fly } from 'svelte/transition';
    import { parse } from '../lib/helpers';
    import { __ANDROID__ } from '../lib/platforms';
    import Scanner from '../components/Scanner.svelte';
    import FullScreenLoader from '../components/FullScreenLoader.svelte';
    import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType } from '@zxing/library';
import { playAudio } from '../lib/ui/helpers';

    const formats = new Map().set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX, BarcodeFormat.QR_CODE]);
    const reader = new BrowserMultiFormatReader(formats);
    let claims = '';
    let invalid = false;
    let loading = false;

    // We delay playing the valid or invalid sound in order not to overlap
	// with the scanning sound
    const PLAY_DELAY = 400;

    async function handleScannerData(event) {
        try {
            await playAudio('scanned');

            loading = true;
            let parsedData = parse(event.detail);
            claims = parsedData;
    
            if (claims) {
                setTimeout(async () => await playAudio('valid'), PLAY_DELAY);
                navigate('devicecredential', { state: { claims: claims }});
            } else {
                setTimeout(async () => await playAudio('invalid'), PLAY_DELAY);
                return showAlert();
            }
        } catch (err) {
            setTimeout(async () => await playAudio('invalid'), PLAY_DELAY);
            console.error(err);
        };
    }

    // handles input button
    const imageSelected = (e) => {
        const image = e.currentTarget.files[0];
        
        const fr = new FileReader();
        fr.onload = (e: ProgressEvent<FileReader>) => {
            reader.decodeFromImageUrl(e.target.result as string)
                .then((result) => {
                    handleScannerData({ detail: result.getText() });
                })
                .catch(e => {
                    console.error(e);
                });
        };
        fr.readAsDataURL(image);
    };

    function showAlert() {
        invalid = true;
        loading = false;
    }

    function goBack() {
        navigate('/home');
    }
</script>

<style>
    main {
        height: 100%;
        overflow: hidden;
    }

    header {
        display: flex;
        flex-direction: column;
        height: 72px;
        background: linear-gradient(90deg, #00FFFF 0%, #0099FF 100%);
    }

    .options-wrapper > p {
        font-family: 'Proxima Nova', sans-serif;
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
        color: #F8F8F8;
        margin: 0;
        z-index: 1;
    }

    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 3.5vh;
    }

    input[type="file"] {
        display: none;
    }

    .image-select {
        font-family: 'Proxima Nova', sans-serif;
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
        color: #F8F8F8;
        border: 1px solid #ccc;
        background-color: #00A7FF;;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
    }
</style>

<main transition:fly="{{ y: 200, duration: 500 }}">
    {#if loading}
        <FullScreenLoader label="Verifying Credential..." />
    {/if}

    {#if !invalid && !loading}
        <header>
            <div class="options-wrapper">
                <img on:click="{goBack}" src="../assets/chevron-left.svg" alt="back" />
                <p>Scanner</p>
                <label class="image-select">
                    <input type="file" accept="image/*" on:change={(e) => imageSelected(e)} />
                    Browse
                </label>
            </div>
        </header>
        <Scanner on:message="{handleScannerData}" />
    {/if}
</main>