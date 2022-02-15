<script lang="ts">
    import { onMount } from "svelte";
    import bwipjs from "bwip-js";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { loadingScreen } from "../lib/store";
    import { showAlert, multiClick, getTimeString, getDateString } from "../lib/ui/helpers";
    import type { IdentityService } from "../services/identityService";
    import CredentialHeader from "../components/CredentialHeader.svelte";
    import { navigate } from "svelte-routing";
    import { CredentialType } from "../models/types/CredentialType";
    import { Page } from "@zebra-iota-edge-sdk/common";

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

    onMount(async () => {
        loadingScreen.set("Generating DataMatrix...");

        try {
            const storedIdentity = await identityService.retrieveIdentity();
            const verifiablePresentation = await identityService.createVerifiablePresentation(
                storedIdentity,
                credential
            );
            presentationJSON = JSON.stringify(verifiablePresentation.toJSON(), null, 2);
            createMatrix(JSON.stringify(verifiablePresentation.toJSON()));
        } catch (err) {
            console.error(err);
            await showAlert("Error", "Error creating DataMatrix. Please try again.");
        }

        loadingScreen.set("");
    });

    function onClickDev() {
        navigate("/tutorial");
    }

    function showJSON() {
        navigate("/code", { state: { code: presentationJSON } });
    }
</script>

<Page theme="dark">
    <div slot="header" class="options-wrapper">
        <i on:click|once={() => window.history.back()} class="icon-chevron" />
        <CredentialHeader {credential} hideDetails={true} />
        <i on:click={onClickDev} class="icon-code" />
    </div>

    <canvas slot="content" id="presentation" use:multiClick on:multiClick={showJSON} />

    <div slot="footer">
        {#if expiry}
            <p>Valid until {getDateString(expiry)} at {getTimeString(expiry)}</p>
        {/if}
        {#if credential.type[1] === CredentialType.DeviceID}
            <p style="font-size: smaller;">Scan this DataMatrix with the Device ID app</p>
        {/if}
    </div>
</Page>

<style>
    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 1.5rem;
    }

    canvas {
        position: relative;
        width: 100%;
    }

    div[slot="footer"] {
        padding: 1.5rem;
        text-align: center;
    }

    div[slot="footer"] > p {
        margin: 0;
        font-weight: 500;
        font-size: 1.2em;
    }
</style>
