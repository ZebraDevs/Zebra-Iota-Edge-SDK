<script lang="ts">
    import { onMount } from "svelte";
    import bwipjs from "bwip-js";
    import DevInfo from "./DevInfo.svelte";
    import { loadingScreen, modalStatus } from "../lib/store";
    import { Plugins } from "@capacitor/core";
    import { showAlert, multiClick } from "../lib/ui/helpers";
    import CredentialHeader from "../components/CredentialHeader.svelte";

    const { App } = Plugins;
    let showTutorial = false;

    const vp = window.history.state.vp;

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

    const addDaysToDate = (date: string, days: number) => {
        let res = new Date(date);
        res.setDate(res.getDate() + days);
        return res.toLocaleDateString([...window.navigator.languages], {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    onMount(() => App.addListener("backButton", goBack).remove);
    onMount(async () => {
        loadingScreen.set("Generating DataMatrix...");
        try {
            createMatrix();
        } catch (e) {
            console.error(e);
            await showAlert("Error", "Error creating DataMatrix. Please try again.");
        }
        loadingScreen.set();
    });

    function goBack() {
        if ($modalStatus.active) {
            modalStatus.set({ active: false, type: null });
            return;
        }
        
        if (showTutorial) {
            showTutorial = false;
            return;
        }

        window.history.back();
    }

    function onClickDev() {
        showTutorial = true;
    }

    function showJSON() {
        modalStatus.set({
            active: true,
            type: "json",
            props: { json: JSON.stringify(vp, null, 2) }
        });
    }
</script>

<main>
    {#if showTutorial}
        <DevInfo page="Presentation" bind:showTutorial />
    {/if}

    <header>
        <div class="options-wrapper">
            <i on:click={goBack} class="icon-chevron" />
            <i on:click={onClickDev} class="icon-code" />
        </div>
        <CredentialHeader credential={vp.verifiableCredential} hideDetails={true} color="white" />
    </header>

    <div class="presentation-wrapper">
        <canvas id="presentation" use:multiClick on:multiClick={showJSON} />
    </div>

    <footer class="footerContainer">
        <p>Valid until {addDaysToDate(vp.verifiableCredential.issuanceDate, 30)}</p>
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
        margin: 0;
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

    .options-wrapper > i {
        color: white;
    }
</style>
