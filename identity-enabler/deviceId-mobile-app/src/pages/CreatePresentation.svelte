<script lang="ts">
    import { onMount } from "svelte";
    import bwipjs from "bwip-js";
    import { codeImageCache, loadingScreen } from "../lib/store";
    import { showAlert, multiClick, getDateString, getTimeString } from "../lib/ui/helpers";
    import CredentialHeader from "../components/CredentialHeader.svelte";
    import { navigate } from "svelte-routing";
    import { wait } from "../lib/helpers";
    import { get } from "svelte/store";

    const vp = window.history.state.vp;
    const expiry = vp.verifiableCredential.expirationDate
        ? new Date(vp.verifiableCredential.expirationDate)
        : undefined;

    async function createMatrix() {
        if (get(codeImageCache)[vp.verifiableCredential.type[1]]) {
            // Previously created.
            return;
        }

        const canvas = document.createElement("canvas");

        // Frees up the browser to serve the loading screen display
        // before the heavy toCanvas call.
        await wait(0);

        bwipjs.toCanvas(canvas, {
            bcid: "datamatrix",
            text: JSON.stringify(vp),
            scale: 3,
            padding: 20,
            backgroundcolor: "ffffff"
        });

        codeImageCache.update(cache => {
            cache[vp.verifiableCredential.type[1]] = canvas.toDataURL("image/png");
            return cache;
        });
    }

    onMount(async () => {
        loadingScreen.set("Generating DataMatrix...");

        try {
            await createMatrix();
        } catch (e) {
            console.error(e);
            await showAlert("Error", "Error creating DataMatrix. Please try again.");
        }

        loadingScreen.set();
    });

    function onClickDev() {
        navigate("/tutorial");
    }

    function showJSON() {
        navigate("/code", { state: { code: JSON.stringify(vp, null, 2) } });
    }
</script>

<main>
    <header>
        <div class="options-wrapper">
            <i on:click|once={() => window.history.back()} class="icon-chevron" />
            <i on:click={onClickDev} class="icon-code" />
        </div>
        <CredentialHeader credential={vp.verifiableCredential} hideDetails={true} color="white" />
    </header>

    <div class="presentation-wrapper">
        {#if $codeImageCache[vp.verifiableCredential.type[1]]}
            <img
                alt="Verifiable presentation"
                use:multiClick
                on:multiClick={showJSON}
                src={$codeImageCache[vp.verifiableCredential.type[1]]}
            />
        {/if}
    </div>

    <footer class="footerContainer">
        {#if expiry}
            <p>Valid until {getDateString(expiry)} at {getTimeString(expiry)}</p>
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

    .presentation-wrapper img {
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
