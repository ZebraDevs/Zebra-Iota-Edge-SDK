<script lang="ts">
    import { navigate } from "svelte-routing";
    import Scanner from "../components/Scanner.svelte";
    import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType } from "@zxing/library";
    import { handleScannerData } from "../lib/scan";
    import { playAudio } from "../lib/ui/helpers";
    import PageTransition from "../components/PageTransition.svelte";
    import { onMount } from "svelte";
    import { Plugins } from "@capacitor/core";

    const formats = new Map().set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX, BarcodeFormat.QR_CODE]);
    const reader = new BrowserMultiFormatReader(formats);
    let backwards = false;
    const { App } = Plugins;

    onMount(() => App.addListener("backButton", goBack).remove);

    // handles input button
    const imageSelected = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
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

            await handleScannerData(result.getText());
        };
        fr.readAsDataURL(image);
    };

    // handles Scanner message
    async function message(ev: CustomEvent) {
        await playAudio("scanned");
        await handleScannerData(ev.detail);
    }

    function goBack() {
        backwards = true;
        window.history.back();
    }
</script>

<PageTransition {backwards}>
    <main>
        <header>
            <div class="options-wrapper">
                <i on:click={goBack} class="icon-chevron" />
                <p>Scanner</p>
                <label class="image-select">
                    <input type="file" accept="image/*" on:change={imageSelected} />
                    Browse
                </label>
            </div>
        </header>
        <Scanner on:message={message} />
    </main>
</PageTransition>

<style>
    main {
        height: 100%;
        overflow: hidden;
    }

    header {
        display: flex;
        flex-direction: column;
        height: 72px;
        background-color: #6165e3;
    }

    .options-wrapper > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
        color: #f8f8f8;
        margin: 0;
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
        background-color: #1e22aa;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
    }
</style>
