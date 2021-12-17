<script>
    import { fly } from "svelte/transition";
    import Button from "../components/Button.svelte";
    import ObjectList from "../components/ObjectList.svelte";
    import DevInfo from "./DevInfo.svelte";
    import { modalStatus } from "../lib/store";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { showAlert } from "../lib/ui/helpers";
    import { onMount } from "svelte";
    import { Plugins } from "@capacitor/core";

    const { App } = Plugins;
    let showTutorial = false;
    const credential = window.history.state.credential;
    const identityService = ServiceFactory.get("identity");
    const preparedCredentialDocument = identityService.prepareCredentialForDisplay(credential.credentialDocument);

    async function share() {
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity to share a Credential");
            return;
        }

        modalStatus.set({
            active: true,
            type: "share",
            props: { credential }
        });
    }

    function goBack() {
        if ($modalStatus.active) {
            modalStatus.set({ active: false });
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

    onMount(() => App.addListener("backButton", goBack).remove);
</script>

<main transition:fly={{ x: 500, duration: 500 }}>
    {#if showTutorial}
        <DevInfo page="Credential" bind:showTutorial />
    {/if}

    {#if !showTutorial}
        <div class="header-wrapper">
            <div class="options-wrapper">
                <img src="../assets/chevron-left.svg" on:click={goBack} alt="chevron-left" />
                <img src="../assets/code.svg" on:click={onClickDev} alt="code" />
            </div>
            <header>
                {#if credential.enrichment.credentialLabel === "Organisation ID"}
                    <img class="credential-logo" src="../assets/zebra.svg" alt="credential-logo" />
                    <p>{credential.metaInformation.issuer.toUpperCase()}</p>
                {:else}
                    <img class="credential-logo" src="../assets/credentialLarge.svg" alt="credential-logo" />
                    <p>{credential.enrichment.issuerLabel}</p>
                {/if}
                <p>{credential.enrichment.credentialLabel}</p>
                <p>{new Date(preparedCredentialDocument.issuanceDate).toLocaleString()}</p>
            </header>
        </div>
        <section>
            <ObjectList object={preparedCredentialDocument.credentialSubject} />
        </section>
        <footer>
            <Button style="background: #0099FF; color: white;" label="Share" onClick={share}>
                <img src="../assets/share.png" alt="share" />
            </Button>
        </footer>
    {/if}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        position: relative;
        height: 100%;
    }

    header {
        margin-bottom: 5vh;
    }

    .header-wrapper {
        text-align: center;
        padding-bottom: 3vh;
        background: linear-gradient(90deg, #00ffff 0%, #0099ff 100%);
    }

    header {
        margin-left: auto;
        margin-right: auto;
        z-index: 1;
        height: fit-content;
        margin-bottom: 0;
    }

    header > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 700;
        font-size: 3.4vh;
        line-height: 3.4vh;
        color: #fff;
    }

    header > p:nth-child(2) {
        font-weight: 600;
        text-transform: uppercase;
        font-size: 1.7vh;
        line-height: 2.3vh;
    }

    header > p:nth-child(3) {
        margin: 1.6vh 0 0 0;
    }

    header > p:nth-child(4) {
        margin-bottom: 0;
        font-size: 1.7vh;
    }

    section {
        margin: 0 7vw;
        z-index: 0;
    }

    footer {
        position: fixed;
        width: 100%;
        bottom: 0;
        z-index: 1;
    }

    .credential-logo {
        width: 10%;
    }

    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 3.5vh 3.5vh 0 3.5vh;
    }
</style>
