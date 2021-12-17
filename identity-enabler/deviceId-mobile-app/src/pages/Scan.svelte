<script lang="ts">
    import { navigate } from "svelte-routing";
    import { fly } from "svelte/transition";
    import { Plugins } from "@capacitor/core";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { error } from "../lib/store";
    import { parse } from "../lib/helpers";
    import { __ANDROID__ } from "../lib/platforms";
    import Scanner from "../components/Scanner.svelte";
    import InvalidCredential from "../components/InvalidCredential.svelte";
    import FullScreenLoader from "../components/FullScreenLoader.svelte";
    import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType } from "@zxing/library";
    import type { IdentityService } from "../services/identityService";
    import { playAudio } from "../lib/ui/helpers";

    const { Toast } = Plugins;
    const formats = new Map().set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX, BarcodeFormat.QR_CODE]);
    const reader = new BrowserMultiFormatReader(formats);

    let VP;
    let invalid = false;
    let loading = false;

    async function handleScannerData(event) {
        try {
            await playAudio("scanned");

            loading = true;
            let parsedData = parse(event.detail);
            VP = parsedData;

            if (!VP) {
                await playAudio("invalid");
                return showAlert();
            }

            const identityService = ServiceFactory.get<IdentityService>("identity");
            const verificationResult = await identityService.verifyVerifiablePresentation(VP);

            if (verificationResult) {
                await playAudio("valid");

                showToast();
                loading = false;
                navigate("credential", { state: { credential: VP, save: true } });
            } else {
                await playAudio("invalid");

                loading = false;
                showAlert();
                error.set("Invalid Data Matrix");
            }
        } catch (err) {
            await playAudio("invalid");
            console.error(err);
        }
    }

    // handles input button
    const imageSelected = e => {
        const image = e.currentTarget.files[0];

        const fr = new FileReader();
        fr.onload = (e: ProgressEvent<FileReader>) => {
            reader
                .decodeFromImageUrl(e.target.result as string)
                .then(result => {
                    handleScannerData({ detail: result.getText() });
                })
                .catch(e => {
                    console.error(e);
                });
        };
        fr.readAsDataURL(image);
    };

    async function showToast() {
        await Toast.show({
            text: "Credential verified!",
            position: "center"
        });
    }

    function showAlert() {
        invalid = true;
        loading = false;
    }

    function goBack() {
        window.history.back();
    }
</script>

<main transition:fly={{ y: 200, duration: 500 }}>
    {#if loading}
        <FullScreenLoader label="Verifying Credential..." />
    {/if}

    {#if invalid && !loading}
        <InvalidCredential />
    {/if}

    {#if !invalid && !loading}
        <header>
            <i on:click={goBack} class="icon-chevron" />
            <p>Scanner</p>
            <label class="image-select">
                <input type="file" accept="image/*" on:change={e => imageSelected(e)} />
                Browse
            </label>
        </header>
        <Scanner on:message={handleScannerData} />
    {/if}
</main>

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
