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
    import { IOTA_IDENTITY_RESOLVER } from "../config";
    import type { IdentityService } from "../services/identityService";

    const { App } = Plugins;
    let presentationJSON = "";
    let showJSON = false;
    let showTutorial = false;
    let singleTapped = false;
    const MAX_DOUBLE_TAP_DELAY = 500;

    const credential = window.history.state.credential.credentialDocument;
    const identityService = ServiceFactory.get<IdentityService>("identity");
    const preparedCredentialDocument = identityService.prepareCredentialForDisplay(credential);

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
        return res.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
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

    function shortenDID(did: string): string {
        return `${did.substring(0, 15)}...${did.substring(did.length - 6)}`;
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
        <i class="icon-credential credential-logo" />
        <p>{credential.type[1]}</p>
        <div class="details">
            <p>
                <span
                    >Subject: <a href="{IOTA_IDENTITY_RESOLVER}/{credential.credentialSubject.id}" target="_blank"
                        >{shortenDID(credential.credentialSubject.id)}</a
                    ></span
                >
            </p>
            <p>
                <span
                    >Issuer: <a href="{IOTA_IDENTITY_RESOLVER}/{credential.issuer.id}" target="_blank"
                        >{credential.issuer.name}</a
                    ></span
                >
            </p>
        </div>
    </header>

    <div class="presentation-wrapper">
        <canvas id="presentation" on:click={onClickDataMatrix} />
    </div>

    <footer class="footerContainer">
        {#if credential.type[1] === "Device ID"}
            <span>Scan this DataMatrix with the Device ID app</span>
        {/if}
        <p>Valid until {addDaysToDate(preparedCredentialDocument.issuanceDate, 30)}</p>
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
        margin-bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        text-align: center;
    }

    header > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 700;
        font-size: 1.25em;
        color: #fff;
        margin: 0;
        padding: 0 2rem;
    }

    .details {
        padding: 1rem 2rem;
    }

    .details > p {
        font-family: "Proxima Nova", sans-serif;
        color: #fff;
        margin: 0.3rem 0;
    }

    .details a {
        color: white;
        font-weight: bold;
    }

    .details a:visited {
        color: unset;
    }

    .credential-logo {
        font-size: 64px;
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

    footer > span {
        color: #fff;
        font-family: "Proxima Nova", sans-serif;
        font-weight: 500;
        font-size: 1em;
    }

    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 3.5vh 3.5vh 0 3.5vh;
        position: relative;
    }
</style>
