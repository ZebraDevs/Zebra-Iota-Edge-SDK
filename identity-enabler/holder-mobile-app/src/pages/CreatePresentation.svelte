<script lang="ts">
    import { onMount } from "svelte";
    import bwipjs from "bwip-js";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { loadingScreen, modalStatus } from "../lib/store";
    import { Plugins } from "@capacitor/core";
    import { showAlert, multiClick, getTimeString, getDateString } from "../lib/ui/helpers";
    import type { IdentityService } from "../services/identityService";
    import CredentialHeader from "../components/CredentialHeader.svelte";
    import { navigate } from "svelte-routing";
    import { CredentialType } from "../lib/helpers";

    const { App } = Plugins;
    let presentationJSON = "";

    const credential = window.history.state.credential;
    const expiry = credential.expirationDate ? new Date(credential.expirationDate) : undefined;
    const identityService = ServiceFactory.get<IdentityService>("identity");

    function createMatrix(content) {
        // The return value is the canvas element
        bwipjs.toCanvas("presentation", {
            bcid: "datamatrix",
            text: content,
            scale: 3,
            padding: 20,
            backgroundcolor: "ffffff"
        });
    }

    onMount(() => App.addListener("backButton", goBack).remove);
    onMount(async () => {
        loadingScreen.set("Generating DataMatrix...");

        try {
            const storedIdentity = await identityService.retrieveIdentity();
            const verifiablePresentation = await identityService.createVerifiablePresentation(
                storedIdentity,
                credential
            );
            presentationJSON = JSON.stringify(verifiablePresentation, null, 2);
            createMatrix(JSON.stringify(verifiablePresentation));
        } catch (err) {
            console.error(err);
            await showAlert("Error", "Error creating DataMatrix. Please try again.");
        }

        loadingScreen.set();
    });

    function goBack() {
        if ($modalStatus.active) {
            modalStatus.set({ active: false, type: null });
            return;
        }

        window.history.back();
    }

    function onClickDev() {
        navigate("/tutorial");
    }

    function showJSON() {
        modalStatus.set({
            active: true,
            type: "code",
            props: { code: presentationJSON }
        });
    }
</script>

<main>
    <header>
        <div class="options-wrapper">
            <i on:click={goBack} class="icon-chevron" />
            <i on:click={onClickDev} class="icon-code" />
        </div>
        <CredentialHeader {credential} hideDetails={true} />
    </header>

    <div class="presentation-wrapper">
        <canvas id="presentation" use:multiClick on:multiClick={showJSON} />
    </div>

    <footer class="footerContainer">
        {#if expiry}
            <p>Valid until {getDateString(expiry)} at {getTimeString(expiry)}</p>
        {/if}
        {#if credential.type[1] === CredentialType.DEVICE_ID}
            <p style="font-size: smaller;">Scan this DataMatrix with the Device ID app</p>
        {/if}
    </footer>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        position: relative;
        height: 100%;
        background: black;
    }

    canvas {
        position: relative;
        width: 100%;
    }

    header {
        margin-bottom: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        text-align: center;
    }

    .presentation-wrapper {
        background: white;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    footer {
        padding: 1.5rem;
        text-align: center;
    }

    footer > p {
        color: #fff;
        font-family: "Proxima Nova", sans-serif;
        font-weight: 500;
        font-size: 1.2em;
    }

    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 3.5vh 3.5vh 0 3.5vh;
        position: relative;
    }
</style>
