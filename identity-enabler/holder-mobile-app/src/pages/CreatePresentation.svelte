<script lang="ts">
    import { onMount } from "svelte";
    import bwipjs from "bwip-js";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { loadingScreen } from "../lib/store";
    import { wait } from "../lib/helpers";
    import DevInfo from "./DevInfo.svelte";
    import PresentationJson from "./PresentationJSON.svelte";
    import { Plugins } from "@capacitor/core";
    import { showAlert } from "../lib/ui/helpers";
    import type { IdentityService } from "../services/identityService";
    import CredentialHeader from "../components/CredentialHeader.svelte";

    const { App } = Plugins;
    let presentationJSON = "";
    let showJSON = false;
    let showTutorial = false;
    let singleTapped = false;
    const MAX_DOUBLE_TAP_DELAY = 500;

    const credential = window.history.state.credential;
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

    const addDaysToDate = (date: string, days: number) => {
        let res = new Date(date);
        res.setDate(res.getDate() + days);
        return res.toLocaleDateString([...window.navigator.languages], { year: "numeric", month: "long", day: "numeric" });
    };

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
        if (showTutorial) {
            showTutorial = false;
            return;
        }

        if (showJSON) {
            showJSON = false;
            return;
        }

        window.history.back();
    }

    function onClickDev() {
        showTutorial = true;
    }

    async function onClickDataMatrix() {
        if (singleTapped) {
            singleTapped = false;
            showJSON = true;
            return;
        }

        singleTapped = true;
        await wait(MAX_DOUBLE_TAP_DELAY);
        singleTapped = false;
    }
</script>

<main>
    {#if showTutorial}
        <DevInfo page="Presentation" bind:showTutorial />
    {:else if showJSON}
        <PresentationJson code={presentationJSON} bind:showJSON />
    {/if}

    <header>
        <div class="options-wrapper">
            <i on:click={goBack} class="icon-chevron" />
            <i on:click={onClickDev} class="icon-code" />
        </div>
        <CredentialHeader {credential} hideDetails={true} />
    </header>

    <div class="presentation-wrapper">
        <canvas id="presentation" on:click={onClickDataMatrix} />
    </div>

    <footer class="footerContainer">
        <p>Valid until {addDaysToDate(credential.issuanceDate, 30)}</p>
        {#if credential.type[1] === "Device ID"}
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
