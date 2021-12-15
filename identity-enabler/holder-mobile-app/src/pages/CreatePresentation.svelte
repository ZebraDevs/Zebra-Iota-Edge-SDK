<script>
    import { navigate } from "svelte-routing";
    import { onMount, beforeUpdate } from "svelte";
    import { Plugins } from "@capacitor/core";
    import bwipjs from "bwip-js";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { error } from "../lib/store";
    import FullScreenLoader from "../components/FullScreenLoader.svelte";
    import Button from "../components/Button.svelte";
    import DevInfo from "./DevInfo.svelte";
    import PresentationJson from "./PresentationJSON.svelte";

    const { App } = Plugins;

    let presentationJSON = "";
    let loading = true;
    let showJSON = false;
    let showTutorial = false;

    const credential = window.history.state.credential;
    const identityService = ServiceFactory.get("identity");
    const preparedCredentialDocument = identityService.prepareCredentialForDisplay(credential.credentialDocument);

    function createMatrix(content) {
        try {
            // The return value is the canvas element
            bwipjs.toCanvas("presentation", {
                bcid: "datamatrix",
                text: content,
                scale: 3,
                padding: 20
            });
        } catch (e) {
            console.error(e);
        }
    }

    const addDaysToDate = (date, days) => {
        let dateOptions = { year: "numeric", month: "long", day: "numeric" };
        let res = new Date(date);
        res.setDate(res.getDate() + days);
        return res.toLocaleDateString("en-US", dateOptions);
    };

    onMount(() => {
        setTimeout(async () => {
            error.set(null);
            try {
                const storedIdentity = await identityService.retrieveIdentity();
                console.log(storedIdentity, credential);
                const verifiablePresentation = await identityService.createVerifiablePresentation(
                    storedIdentity,
                    credential?.credentialDocument
                );
                console.log("verifiablePresentation", verifiablePresentation);
                presentationJSON = JSON.stringify(verifiablePresentation, null, 2);
                createMatrix(JSON.stringify(verifiablePresentation));
                loading = false;
            } catch (err) {
                error.set("Error creating identity. Please try again.");
                loading = false;
            }
        }, 500);
    });

    beforeUpdate(() => {
        !showTutorial && App.removeAllListeners();
    });

    function goBack() {
        navigate("credential", { state: { credential: credential } });
    }

    function onClickDev() {
        showTutorial = true;
    }

    function onClickJSON() {
        showJSON = true;
    }
</script>

<main>
    {#if showTutorial}
        <DevInfo page="Presentation" bind:showTutorial />
    {:else if showJSON}
        <PresentationJson code={presentationJSON} bind:showJSON />
    {/if}

    {#if loading}
        <FullScreenLoader label="Creating Data Matrix..." />
    {/if}
    <div class={loading ? "wrapper mini" : "wrapper"}>
        {#if !loading}
            <div class="options-wrapper">
                <img src="../assets/chevron-left.svg" on:click={goBack} alt="chevron-left" />
                <img src="../assets/code.svg" on:click={onClickDev} alt="code" />
            </div>
            <header>
                {#if credential.enrichment.credentialLabel === "Organisation ID"}
                    <img class="credential-logo" src="../assets/zebra.svg" alt="credential-logo" />
                    <span>{credential.metaInformation.issuer.toUpperCase()}</span>
                {:else}
                    <img class="credential-logo" src="../assets/credentialLarge.svg" alt="credential-logo" />
                    <span>{credential.enrichment.issuerLabel.toUpperCase()}</span>
                {/if}
                <p>{credential.enrichment.credentialLabel}</p>
            </header>
        {/if}
        <div class="presentation-wrapper">
            <canvas id="presentation" />
        </div>
        {#if !loading}
            <footer class="footerContainer">
                {#if credential.enrichment.credentialLabel === "Organisation ID"}
                    <span>Scan this Barcode with the Device ID app</span>
                    <p>Valid until {addDaysToDate(preparedCredentialDocument.issuanceDate, 30)}</p>
                {:else}
                    <p>Valid until {addDaysToDate(preparedCredentialDocument.issuanceDate, 30)}</p>
                {/if}
                <Button
                    style="background: transparent; color: white; font-weight: 500; font-size: 1.7vh; line-height: 2.3vh; border: none; height:fit-content;"
                    label="VIEW IN JSON FORMAT"
                    onClick={onClickJSON}
                />
            </footer>
        {/if}
    </div>
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
        z-index: 5;
    }

    .mini {
        width: 0px;
        height: 0px;
    }

    header {
        z-index: 1;
        height: fit-content;
        margin-bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    header > p {
        margin: 1.5vh 0 6.2vh 0;
        font-family: "Proxima Nova", sans-serif;
        font-weight: 700;
        font-size: 2.4vh;
        line-height: 2.4vh;
        color: #fff;
        padding: 0;
    }

    header > span {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 1.4vh;
        line-height: 1.8vh;
        color: #fff;
    }

    .wrapper {
        text-align: center;
    }

    .credential-logo {
        width: 10%;
        margin-bottom: 1.5vh;
    }

    .presentation-wrapper {
        height: fit-content;
        position: relative;
        background: white;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        bottom: 1.5vh;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }

    footer > p {
        color: #fff;
        padding: 4.6vh 0 1vh 0;
        margin: 0;
        font-family: "Proxima Nova", sans-serif;
        font-weight: 500;
        font-size: 2.9vh;
        line-height: 3.5vh;
    }

    footer > span {
        color: #fff;
        margin-top: 5.4vh;
        font-family: "Proxima Nova", sans-serif;
        font-weight: 500;
        font-size: 1.7vh;
    }

    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 3.5vh 3.5vh 0 3.5vh;
        position: relative;
        z-index: 2;
    }

    .footerContainer {
        position: fixed;
        text-align: center;
        width: 100%;
    }
</style>
