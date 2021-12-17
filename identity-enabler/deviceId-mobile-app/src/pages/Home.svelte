<script lang="ts">
    import { Plugins } from "@capacitor/core";
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import Button from "../components/Button.svelte";
    import ListItem from "../components/ListItem.svelte";
    import FullScreenLoader from "../components/FullScreenLoader.svelte";
    import DevInfo from "./DevInfo.svelte";
    import { getFromStorage, account, resetAllStores } from "../lib/store";
    import { ServiceFactory } from "../factories/serviceFactory";
    import type { IdentityService } from "../services/identityService";
    import { wait } from "../lib/helpers";
    import { BACK_BUTTON_EXIT_GRACE_PERIOD } from "../config";

    let showTutorial = false;

    const { App, Toast, Modals } = Plugins;

    let loading = false;
    let localCredentials = [];
    let exitOnBack = false;

    onMount(() => App.addListener("backButton", onBack).remove);
    onMount(async () => {
        try {
            localCredentials = await getFromStorage("credentials");
            localCredentials = Object.values(localCredentials)?.filter(data => data);
        } catch (err) {
            console.log(err);
        }
    });

    async function onBack() {
        if (showTutorial) {
            showTutorial = false;
            return;
        }

        if (exitOnBack) {
            // From the home screen, navigating back twice should exit the app
            App.exitApp();
            return;
        }

        exitOnBack = true;
        await Toast.show({
            position: "bottom",
            duration: "short",
            text: "Tap back again to exit"
        });
        await wait(BACK_BUTTON_EXIT_GRACE_PERIOD);
        exitOnBack = false;
    }

    async function createQR() {
        navigate("/createQR", { state: { name: $account.name } });
    }

    function onClickDev() {
        showTutorial = true;
    }

    async function onClickReset() {
        let confirmRet = await Modals.confirm({
            title: "Reset the app",
            message: "Are you sure you want to reset the app and delete all credentials?"
        });
        if (confirmRet.value) {
            const identityService = ServiceFactory.get<IdentityService>("identity");
            try {
                await identityService.clearIdentityAndCredentials();
                // Also need to reset persisted Svelte stores
                resetAllStores();
            } catch (e) {
                await Modals.alert({
                    title: "Could not reset",
                    message: e.message
                });
                return;
            }
            navigate("/landing");
        }
    }
</script>

<main>
    {#if showTutorial}
        <DevInfo page="Identity" bind:showTutorial />
    {/if}

    {#if loading}
        <FullScreenLoader label="Loading Credential..." />
    {/if}

    {#if !loading && $account}
        <header>
            <div class="options-wrapper">
                <img src="../assets/reset.svg" on:click={onClickReset} alt="reset" />
                <img class="code" src="../assets/code.svg" on:click={onClickDev} alt="code" />
            </div>
            <div class="logo"><img src="../assets/device.png" alt="logo" /></div>
        </header>
        <name-wrapper>
            <p>Device {$account.name}</p>
        </name-wrapper>
        <section>
            {#each localCredentials as credential}
                <div class="list">
                    <ListItem
                        onClick={() => navigate("credential", { state: { credential: credential } })}
                        heading={"IOTA"}
                        subheading={credential.verifiableCredential.type[1]}
                        icon="device.svg"
                    />
                </div>
            {/each}
            {#if localCredentials.length < 1}
                <div class="btn-wrapper">
                    <Button
                        style="background: white; color: #051923; display: flex; justify-content: flex-start; padding-left: 20px;"
                        label="Request Device ID credential"
                        onClick={createQR}
                    >
                        <img class="add" src="../assets/add.png" alt="add" />
                    </Button>
                </div>
            {/if}
        </section>
    {/if}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    header {
        display: flex;
        flex-direction: column;
        height: 141px;
        background: linear-gradient(90deg, #00ffff 0%, #0099ff 100%);
    }

    name-wrapper {
        padding-top: 5.6vh;
        background: #f8f8f8;
    }

    section {
        flex: 1;
        align-content: space-between;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        background: #f8f8f8;
    }

    .logo {
        position: relative;
        top: 3%;
        border: 20px solid rgba(165, 165, 165, 0.1);
        border-radius: 50%;
        width: 100px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
    }

    .logo > img {
        width: 18vh;
        height: 18vh;
    }

    .list {
        padding: 0 20px;
    }

    .list:not(:last-child) {
        margin-bottom: 3vh;
    }

    .list:last-child {
        margin-bottom: 9vh;
    }

    name-wrapper > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 700;
        font-size: 6vw;
        line-height: 8vw;
        text-align: center;
        color: #131f37;
    }

    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 3.5vh 3.5vh 0 3.5vh;
    }

    .add {
        width: 40px;
        height: 40px;
    }

    .code {
        margin-left: auto;
    }

    .btn-wrapper {
        height: 72px;
        padding: 0 20px;
    }
</style>
