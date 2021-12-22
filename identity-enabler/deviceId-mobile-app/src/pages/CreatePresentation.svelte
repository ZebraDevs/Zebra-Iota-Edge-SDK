<script>
    import { onMount } from "svelte";
    import bwipjs from "bwip-js";
    import { wait } from "../lib/helpers";
    import DevInfo from "./DevInfo.svelte";
    import PresentationJson from "./PresentationJSON.svelte";
    import { loadingScreen } from "../lib/store";

    let showJSON = false;
    let showTutorial = false;
    let singleTapped = false;
    const MAX_DOUBLE_TAP_DELAY = 500;

    const credential = window.history.state.credential;

    function createMatrix() {
        loadingScreen.set("Generating DataMatrix...");
        try {
            // The return value is the canvas element
            bwipjs.toCanvas("presentation", {
                bcid: "datamatrix",
                text: JSON.stringify(credential),
                scale: 3,
                padding: 20,
                backgroundcolor: "ffffff"
            });
        } catch (e) {
            console.error(e);
        }
        loadingScreen.set();
    }

    const addDaysToDate = (date, days) => {
        let dateOptions = { year: "numeric", month: "long", day: "numeric" };
        let res = new Date(date);
        res.setDate(res.getDate() + days);
        return res.toLocaleDateString("en-US", dateOptions);
    };

    onMount(() => {
        createMatrix();
    });

    function goBack() {
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
        <PresentationJson code={JSON.stringify(credential, null, 2)} bind:showJSON />
    {/if}

    <div class="wrapper">
        <div class="options-wrapper">
            <i on:click={goBack} class="icon-chevron" />
            <i on:click={onClickDev} class="icon-code" />
        </div>
        <div class="header">
            <i class="icon-credential credential-logo" />
            <header>
                <span>Device {credential?.verifiableCredential?.credentialSubject?.DeviceData["Device Name"]}</span>
                <p>{credential?.metaInformation?.issuer ?? "No issuer information"}</p>
            </header>
        </div>
        <div class="presentation-wrapper">
            <canvas id="presentation" on:click={onClickDataMatrix} />
        </div>
        <footer class="footerContainer">
            <p>Valid until {addDaysToDate(credential?.verifiableCredential?.issuanceDate, 30)}</p>
        </footer>
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

    header > p {
        margin: 2vh 0;
        font-family: "Proxima Nova", sans-serif;
        font-weight: 700;
        font-size: 5vw;
        line-height: 5vw;
        color: #fff;
        padding: 0;
    }

    header > span {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 1.7vh;
        line-height: 2.3vh;
        color: #fff;
    }

    .wrapper {
        text-align: center;
    }

    .options-wrapper > i {
        color: white;
    }

    .credential-logo {
        color: white;
        font-size: 64px;
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
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }

    footer > p {
        color: #fff;
        padding: 2vh 0 1vh 0;
        margin: 0;
        font-family: "Proxima Nova", sans-serif;
        font-weight: 500;
        font-size: 2.9vh;
        line-height: 3.5vh;
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
