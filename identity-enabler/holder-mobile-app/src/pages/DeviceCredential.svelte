<script>
    import { navigate } from "svelte-routing";
    import { updateStorage, error } from "../lib/store";
    import { SchemaNames } from "../schemas";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { generateRandomId } from "../lib/helpers";
    import { showAlert } from "../lib/ui/helpers";
    import FullScreenLoader from "../components/FullScreenLoader.svelte";
    import Button from "../components/Button.svelte";
    import ObjectList from "../components/ObjectList.svelte";
    import DevInfo from "./DevInfo.svelte";
    import { onMount } from "svelte";
    import { Plugins } from "@capacitor/core";

    const { App } = Plugins;
    let showTutorial = false;
    let loading = false;

    const claims = window.history.state.claims;

    async function createCredential() {
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity to create a Device Credential");
            return;
        }

        loading = true;
        const identityService = ServiceFactory.get("identity");
        error.set(null);
        try {
            const storedIdentity = await identityService.retrieveIdentity();
            const payload = {
                DeviceData: {
                    "Device ID": claims.id,
                    "Device Name": claims.deviceName,
                    Manufacturer: claims.manufacturer,
                    "Serial Number": claims.uuid,
                    "Operating System": claims.operatingSystem,
                    Model: claims.model,
                    "OS Version": claims.osVersion
                }
            };
            const newCredential = await identityService.createSelfSignedCredential(
                storedIdentity,
                SchemaNames.Organisation_ID,
                payload
            );
            const credentialId = generateRandomId();
            const enrichment = identityService.enrichCredential({ ...newCredential });
            const credential = {
                credentialDocument: { ...newCredential },
                metaInformation: { issuer: "Zebra Technologies" },
                id: credentialId,
                enrichment
            };
            console.log("new credential", credential);
            await updateStorage("credentials", { ["organization"]: credential });
            loading = false;
            navigate("/createPresentation", { state: { credential } });
        } catch (err) {
            error.set("Error creating credential. Please try again.");
            loading = false;
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
    {#if loading}
        <FullScreenLoader label="Loading Credential..." />
    {/if}

    {#if !loading && showTutorial}
        <DevInfo page="Credential" bind:showTutorial />
    {/if}

    {#if !loading && !showTutorial}
        <div class="header-wrapper">
            <div class="options-wrapper">
                <img src="../assets/chevron-left.svg" on:click={goBack} alt="chevron-left" />
                <img src="../assets/code.svg" on:click={onClickDev} alt="code" />
            </div>
            <header>
                <p>Device {claims.deviceName} claims</p>
            </header>
        </div>
        <section>
            <ObjectList object={claims} />
        </section>
        <footer>
            <Button
                style="background: #0099FF; color: white;"
                label="Issue Device ID credential"
                onClick={createCredential}
            />
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

    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 3.5vh 3.5vh 0 3.5vh;
    }
</style>
