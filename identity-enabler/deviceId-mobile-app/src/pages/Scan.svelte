<script lang="ts">
    import { navigate } from "svelte-routing";
    import { fly } from "svelte/transition";
    import { Plugins } from "@capacitor/core";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { __ANDROID__ } from "../lib/platforms";
    import Scanner from "../components/Scanner.svelte";
    import InvalidCredential from "../components/InvalidCredential.svelte";
    import FullScreenLoader from "../components/FullScreenLoader.svelte";
    import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType } from "@zxing/library";
    import type { IdentityService } from "../services/identityService";
    import { playAudio } from "../lib/ui/helpers";
    import { onMount } from "svelte";

    // We delay playing the valid or invalid sound in order not to overlap
    // with the scanning sound
    const PLAY_DELAY = 400;
    const { Toast, App } = Plugins;
    const formats = new Map().set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX, BarcodeFormat.QR_CODE]);
    const reader = new BrowserMultiFormatReader(formats);

    let VP;
    let showInvalid = false;
    let invalidMessage: string;
    let loading = false;

    onMount(() => App.addListener("backButton", goBack).remove);

    async function handleScannerData(event) {
        await playAudio("scanned");
        loading = true;
        try {
            VP = JSON.parse(event.detail);
        } catch (e) {
            console.error(e);
            setTimeout(async () => await playAudio("invalid"), PLAY_DELAY);
            return showAlert("Invalid JSON");
        }

        if (!VP) {
            setTimeout(async () => await playAudio("invalid"), PLAY_DELAY);
            return showAlert();
        }

        const identityService = ServiceFactory.get<IdentityService>("identity");
        const identity = await identityService.retrieveIdentity();

        const credentialSubjectId = VP.verifiableCredential?.credentialSubject?.id;
        if (credentialSubjectId === undefined) {
            await playAudio("invalid");
            showAlert();
            return;
        }

        const id = JSON.parse(identity.didDoc).id;
        if (id !== credentialSubjectId) {
            // check that this VP/VC is for the current device
            await playAudio("invalid");
            showAlert("Incorrect credential subject");
            return;
        }

        const verificationResult = await identityService.verifyVerifiablePresentation(VP);

        if (!verificationResult) {
            await playAudio("invalid");
            loading = false;
            return showAlert();
        }

        await playAudio("valid");
        showToast();
        loading = false;
        navigate("credential", { state: { credential: VP, save: true } });
    }

    // handles input button
    const imageSelected = e => {
        const image = e.currentTarget.files[0];
        const fr = new FileReader();
        fr.onload = (e: ProgressEvent<FileReader>) => {
            reader
                .decodeFromImageUrl(e.target.result as string)
                .then(result => handleScannerData({ detail: result.getText() }))
                .catch(async e => {
                    console.error(e);
                    await playAudio("invalid");
                    showAlert("Failed to decode image");
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

    function showAlert(message = "Invalid credential") {
        showInvalid = true;
        invalidMessage = message;
        loading = false;
    }

    function goBack() {
        if (showInvalid) {
            showInvalid = false;
            return;
        }

        window.history.back();
    }
</script>

<main transition:fly={{ y: 200, duration: 500 }}>
    {#if loading}
        <FullScreenLoader label="Verifying Credential..." />
    {/if}

    {#if showInvalid && !loading}
        <InvalidCredential bind:showInvalid message={invalidMessage} />
    {/if}

    {#if !showInvalid && !loading}
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
