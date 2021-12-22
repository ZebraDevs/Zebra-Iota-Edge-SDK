<script lang="ts">
    import { navigate } from "svelte-routing";
    import { fly } from "svelte/transition";
    import { __ANDROID__ } from "../lib/platforms";
    import Scanner from "../components/Scanner.svelte";
    import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType } from "@zxing/library";
    import { playAudio } from "../lib/ui/helpers";

    const formats = new Map().set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX, BarcodeFormat.QR_CODE]);
    const reader = new BrowserMultiFormatReader(formats);

    // We delay playing the valid or invalid sound in order not to overlap
    // with the scanning sound
    const PLAY_DELAY = 400;

    async function handleScannerData(event) {
        await playAudio("scanned");
        let credentialSubject;

        try {
            credentialSubject = JSON.parse(event.detail);
        } catch (err) {
            console.error(err);
            navigate("/invalid", { state: { message: "Invalid JSON" } });
            return;
        }

        if (typeof credentialSubject?.id !== "string" || !credentialSubject.id.startsWith("did:iota:")) {
            navigate("/invalid", { state: { message: "Missing subject ID" } });
            return;
        }

        setTimeout(async () => await playAudio("valid"), PLAY_DELAY);
        navigate("/devicecredential", { state: { credentialSubject } });
    }

    // handles input button
    const imageSelected = e => {
        const image = e.currentTarget.files[0];

        const fr = new FileReader();
        fr.onload = (e: ProgressEvent<FileReader>) => {
            reader
                .decodeFromImageUrl(e.target.result as string)
                .then(result => handleScannerData({ detail: result.getText() }))
                .catch(e => {
                    console.error(e);
                    navigate("/invalid", { state: { message: "Failed to decode image" } });
                });
        };
        fr.readAsDataURL(image);
    };

    function goBack() {
        window.history.back();
    }
</script>

<main transition:fly={{ y: 200, duration: 500 }}>
    <header>
        <div class="options-wrapper">
            <i on:click={goBack} class="icon-chevron" />
            <p>Scanner</p>
            <label class="image-select">
                <input type="file" accept="image/*" on:change={e => imageSelected(e)} />
                Browse
            </label>
        </div>
    </header>
    <Scanner on:message={handleScannerData} />
</main>

<style>
    main {
        height: 100%;
        overflow: hidden;
    }

    header {
        display: flex;
        flex-direction: column;
        background-color: #00a7ff;
    }

    .options-wrapper > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
        color: #f8f8f8;
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
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
        color: #f8f8f8;
        border: 1px solid #ccc;
        background-color: #00a7ff;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
    }
</style>
