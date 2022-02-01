<script lang="ts">
    import { navigate } from "svelte-routing";
    import { fly } from "svelte/transition";
    import { __ANDROID__ } from "../lib/platforms";
    import Scanner from "../components/Scanner.svelte";
    import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType } from "@zxing/library";
    import { handleScannerData } from "../lib/scan";

    const formats = new Map().set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX, BarcodeFormat.QR_CODE]);
    const reader = new BrowserMultiFormatReader(formats);

    // handles input button
    const imageSelected = e => {
        const image = e.currentTarget.files[0];

        const fr = new FileReader();
        fr.onload = async (e: ProgressEvent<FileReader>) => {
            let result;
            try {
                result = await reader.decodeFromImageUrl(e.target.result as string);
            } catch (e) {
                console.error(e);
                navigate("/invalid", { state: { message: "Failed to decode image", detail: e.message } });
                return;
            }

            await handleScannerData(result.getText(), "File");
        };
        fr.readAsDataURL(image);
    };
</script>

<main transition:fly={{ y: 200, duration: 500 }}>
    <header>
        <div class="options-wrapper">
            <i on:click|once={() => window.history.back()} class="icon-chevron" />
            <p>Scanner</p>
            <label class="image-select">
                <input type="file" accept="image/*" on:change={e => imageSelected(e)} />
                Browse
            </label>
        </div>
    </header>
    <Scanner on:message={ev => handleScannerData(ev.detail, "Camera")} />
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
