<script>
    import { Plugins } from "@capacitor/core";
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { slide } from "svelte/transition";
    import { firstLaunch, getFromStorage } from "../lib/store";
    import { isExpired } from "../lib/helpers";
    import FullScreenLoader from "../components/FullScreenLoader.svelte";
    import Button from "../components/Button.svelte";
    import ListItem from "../components/ListItem.svelte";
    import DevInfo from "./DevInfo.svelte";
    import { showAlert } from "../lib/ui/helpers";
    import { BACK_BUTTON_EXIT_GRACE_PERIOD } from "../config";

    const { App, Toast, Modals } = Plugins;

    let isEmpty = false;
    let showTutorial = false;
    let localCredentials = {};
    let loading = false;
    let exitOnBack = false;

    onMount(() => App.addListener("backButton", onBack).remove);
    onMount(async () => {
        try {
            loading = true;
            localCredentials = await getFromStorage("credentials");
            localCredentials = Object.values(localCredentials)?.filter(data => data);
            isEmpty = Object.values(localCredentials).every(x => x === null || x === "");
            loading = false;
        } catch (err) {
            console.log(err);
            loading = false;
        }
    });

    async function scan() {
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity for verifying credentials");
            return;
        }
        navigate("/scan");
    }

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

    function onClickDev() {
        showTutorial = true;
    }

    function onClickCredential(credential) {
        navigate("/credential", { state: { credential } });
    }

    async function onClickReset() {
        let confirmRet = await Modals.confirm({
            title: "Reset the app",
            message: "Are you sure you want to reset the app and delete all credentials?"
        });
        if (confirmRet.value) {
            localStorage.setItem(
                "credentials",
                JSON.stringify({
                    personal: "",
                    health: "",
                    blood: ""
                })
            );
            localCredentials = {
                personal: "",
                health: "",
                blood: ""
            };
            isEmpty = Object.values(localCredentials).every(x => x === null || x === "");
            firstLaunch.set(true);
            navigate("/landing");
        }
    }
</script>

<main>
    {#if loading}
        <FullScreenLoader label="loading Credentials..." />
    {/if}

    {#if showTutorial}
        <DevInfo page="Presentation" bind:showTutorial />
    {/if}

    {#if !showTutorial && !loading}
        <header>
            <div class="options-wrapper">
                <i on:click={onClickReset} class="icon-reset" />
                <p>SCANNED CREDENTIALS</p>
                <i on:click={onClickDev} class="icon-code" />
            </div>
        </header>
        <section>
            {#if isEmpty}
                <div class="empty-wrapper">
                    <p>No credentials scanned</p>
                </div>
            {:else}
                {#each Object.values(localCredentials) as credential}
                    <div transition:slide class="list">
                        <ListItem
                            icon={isExpired(credential.issuanceDate) ? "cross" : "check"}
                            iconColor="#1e22aa"
                            onClick={() => onClickCredential(credential)}
                            heading={"IOTA"}
                            subheading={credential.type[1]}
                            expired={isExpired(credential.issuanceDate)}
                        />
                    </div>
                {/each}
            {/if}
        </section>
        <footer>
            <Button style="height: 64px; width: 64px; border-radius: 50%;" onClick={scan}>
                <i class="icon-scan" />
            </Button>
        </footer>
    {/if}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        z-index: 1;
    }

    header {
        display: flex;
        flex-direction: column;
        height: 72px;
        background-color: #6165e3;
    }

    section {
        flex: 1;
        align-content: space-between;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        margin: 2rem 1.5rem;
    }

    .list {
        margin-bottom: 2vh;
    }

    .options-wrapper > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
        color: #f8f8f8;
        margin: 0;
        z-index: 1;
    }

    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 3.5vh;
    }

    .empty-wrapper {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .empty-wrapper > p {
        font-family: "Proxima Nova", sans-serif;
        font-size: 14px;
        color: #767676;
    }

    footer {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        bottom: 0;
        padding-bottom: 4.1vh;
        z-index: 1;
    }
</style>
