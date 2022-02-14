<script lang="ts">
    import Scanner from "../components/Scanner.svelte";
    import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType } from "@zxing/library";
    import type { Result } from "@zxing/library";
    import { handleScannerData } from "../lib/scan";
    import { navigate } from "svelte-routing";
    import { Page } from "@zebra-iota-edge-sdk/common";

    const formats = new Map().set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX, BarcodeFormat.QR_CODE]);
    const reader = new BrowserMultiFormatReader(formats);

    // handles input button
    const imageSelected = e => {
        const image = e.currentTarget.files[0];
        const fr = new FileReader();
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
        fr.addEventListener("load", async (e: ProgressEvent<FileReader>) => {
            let result: Result;
            try {
                result = await reader.decodeFromImageUrl(e.target.result as string);
            } catch (e) {
                console.error(e);
                navigate("/invalid", { state: { message: "Failed to decode image", detail: e.message } });
                return;
            }

            await handleScannerData(result.getText(), "File");
        });
        fr.readAsDataURL(image);
    };

    function goBack() {
        window.history.back();
    }
</script>

<Page>
    <div slot="header" class="options-wrapper">
        <i on:click={goBack} class="icon-chevron" />
        <h2>Scanner</h2>
        <label class="image-select">
            <input type="file" accept="image/*" on:change={e => imageSelected(e)} />
            Browse
        </label>
    </div>

    <svelte:fragment slot="content">
        <Scanner on:message={async ev => handleScannerData(ev.detail, "Camera")} />
    </svelte:fragment>
</Page>

<style>
    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 1.5rem;
    }

    h2 {
        margin: 0 0.5rem;
        align-self: center;
    }

    input[type="file"] {
        display: none;
    }

    .image-select {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
        border: 1px solid var(--black-40);
        background-color: var(--primary);
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
    }
</style>
