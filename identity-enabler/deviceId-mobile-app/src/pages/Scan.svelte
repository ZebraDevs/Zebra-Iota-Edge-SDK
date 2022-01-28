<script lang="ts">
    import { __ANDROID__ } from "../lib/platforms";
    import Scanner from "../components/Scanner.svelte";
    import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType } from "@zxing/library";
    import { handleScannerData } from "../lib/scan";
    import { navigate } from "svelte-routing";
    import PageTransition from "../components/PageTransition.svelte";
    import { onMount } from "svelte";
    import { Plugins } from "@capacitor/core";

    const formats = new Map().set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX, BarcodeFormat.QR_CODE]);
    const reader = new BrowserMultiFormatReader(formats);
    const { App } = Plugins;
    let backwards = false;

    onMount(() => App.addListener("backButton", goBack).remove);

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

    function goBack() {
        backwards = true;
        window.history.back();
    }
</script>

<PageTransition {backwards}>
    <main>
        <header>
            <i on:click={goBack} class="icon-chevron" />
            <p>Scanner</p>
            <label class="image-select">
                <input type="file" accept="image/*" on:change={e => imageSelected(e)} />
                Browse
            </label>
        </header>
        <Scanner on:message={async ev => await handleScannerData(ev.detail, "Camera")} />
    </main>
</PageTransition>

<style>
    main {
        height: 100%;
        overflow: hidden;
    }

    header {
        background-color: #aee693;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 72px;
        padding: 0 2.6vh;
    }

    header > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 1.2em;
        margin: 0;
    }

    input[type="file"] {
        display: none;
    }

    .image-select {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
        border: 1px solid #9d9d9d;
        background-color: #78d64b;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
    }
</style>
