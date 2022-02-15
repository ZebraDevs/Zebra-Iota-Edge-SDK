<script lang="ts">
    import { onMount } from "svelte";
    import bwipjs from "bwip-js";
    import { loadingScreen } from "../lib/store";
    import { showAlert, multiClick, getDateString, getTimeString } from "../lib/ui/helpers";
    import CredentialHeader from "../components/CredentialHeader.svelte";
    import { navigate } from "svelte-routing";
    import { Page } from "@zebra-iota-edge-sdk/common";

    const vp = window.history.state.vp;
    const expiry = vp.verifiableCredential.expirationDate
        ? new Date(vp.verifiableCredential.expirationDate)
        : undefined;

    function createMatrix() {
        // The return value is the canvas element
        bwipjs.toCanvas("presentation", {
            bcid: "datamatrix",
            text: JSON.stringify(vp),
            scale: 3,
            padding: 20,
            backgroundcolor: "ffffff"
        });
    }

    onMount(async () => {
        loadingScreen.set("Generating DataMatrix...");
        try {
            createMatrix();
        } catch (e) {
            console.error(e);
            await showAlert("Error", "Error creating DataMatrix. Please try again.");
        }
        loadingScreen.set("");
    });

    function onClickDev() {
        navigate("/tutorial");
    }

    function showJSON() {
        navigate("/code", { state: { code: JSON.stringify(vp, null, 2) } });
    }
</script>

<Page theme="dark">
    <div slot="header" class="options-wrapper">
        <i on:click|once={() => window.history.back()} class="icon-chevron" />
        <CredentialHeader credential={vp.verifiableCredential} hideDetails={true} color="white" />
        <i on:click={onClickDev} class="icon-code" />
    </div>

    <canvas slot="content" id="presentation" use:multiClick on:multiClick={showJSON} />

    <div slot="footer">
        {#if expiry}
            <p>Valid until {getDateString(expiry)} at {getTimeString(expiry)}</p>
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
