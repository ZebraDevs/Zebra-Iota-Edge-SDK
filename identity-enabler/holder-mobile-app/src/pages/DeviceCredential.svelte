<script>
    import { navigate } from "svelte-routing";
    import { loadingScreen } from "../lib/store";
    import { CredentialType } from "../schemas";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { showAlert } from "../lib/ui/helpers";
    import Button from "../components/Button.svelte";
    import ObjectList from "../components/ObjectList.svelte";
    import DevInfo from "./DevInfo.svelte";
    import { onMount } from "svelte";
    import { Plugins } from "@capacitor/core";

    const { App } = Plugins;
    let showTutorial = false;

    const credentialSubject = window.history.state.credentialSubject;

    async function createCredential() {
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity to create a Device Credential");
            return;
        }

        loadingScreen.set("Generating Credential...");
        const identityService = ServiceFactory.get("identity");

        try {
            const storedIdentity = await identityService.retrieveIdentity();
            const subjectId = credentialSubject.id;
            const claims = { ...credentialSubject };
            delete claims.id;
            const credential = await identityService.createSignedCredential(
                subjectId,
                storedIdentity,
                CredentialType.DEVICE_ID,
                claims
            );
            loadingScreen.set();
            navigate("/createPresentation", { state: { credential } });
        } catch (err) {
            loadingScreen.set();
            await showAlert("Error", "Error creating credential. Please try again.");
        }
    }

    function goBack() {
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

<main>
    {#if showTutorial}
        <DevInfo page="Credential" bind:showTutorial />
    {/if}

    {#if !showTutorial}
        <div class="header-wrapper">
            <div class="options-wrapper">
                <i on:click={goBack} class="icon-chevron" />
                <i on:click={onClickDev} class="icon-code" />
            </div>
            <header>
                <p>Device Claims</p>
            </header>
        </div>
        <section>
            <ObjectList object={credentialSubject} />
        </section>
        <footer>
            <Button label="Issue Device ID credential" onClick={createCredential} />
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

    .header-wrapper {
        text-align: center;
        background-color: #00a7ff;
    }

    header {
        margin-left: auto;
        margin-right: auto;
        height: fit-content;
        margin-bottom: 0;
    }

    header > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 700;
        font-size: 3.4vh;
        line-height: 3.4vh;
        color: #fff;
        margin: 0.5rem 0 1.5rem 0;
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

    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 3.5vh 3.5vh 0 3.5vh;
    }
</style>
