<script lang="ts">
    import { Plugins } from "@capacitor/core";
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import ListItem from "../components/ListItem.svelte";
    import { account, resetAllStores, credentials } from "../lib/store";
    import { ServiceFactory } from "../factories/serviceFactory";
    import type { IdentityService } from "../services/identityService";
    import { wait } from "../lib/helpers";
    import { BACK_BUTTON_EXIT_GRACE_PERIOD } from "../config";
    import { shortenDID } from "../lib/ui/helpers";
    import { credentialDisplayMap } from "../lib/ui/credentialDisplayMap";

    const { App, Toast, Modals } = Plugins;

    let localCredentials = [];
    let exitOnBack = false;

    onMount(() => App.addListener("backButton", onBack).remove);
    onMount(() => {
        localCredentials = Object.values($credentials)?.filter(data => data);
    });

    async function onBack() {
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
        navigate("/tutorial");
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

    function viewCredential(vp: unknown) {
        navigate("/credential", { state: { vp } });
    }
</script>

<main>
    {#if $account}
        <header>
            <div class="options-wrapper">
                <i on:click={onClickReset} class="icon-reset" />
                <i on:click={onClickDev} class="icon-code" />
            </div>
            <div class="logo"><img src="/img/device.png" alt="logo" /></div>
        </header>
        <name-wrapper>
            <p>Device {$account.name}</p>
        </name-wrapper>
        <section>
            {#each localCredentials as vp}
                <div class="list">
                    <ListItem
                        icon="chip"
                        heading={credentialDisplayMap[vp.verifiableCredential.type[1]]}
                        on:click={() => viewCredential(vp)}
                        subheading="Issued by {vp.verifiableCredential.issuer.name ??
                            shortenDID(vp.verifiableCredential.issuer.id ?? vp.verifiableCredential.issuer)}"
                    />
                </div>
            {/each}
            {#if localCredentials.length < 1}
                <div class="list">
                    <ListItem
                        icon="add"
                        iconColor="#78d64b"
                        on:click={createQR}
                        arrow={false}
                        heading="Request Device ID credential"
                    />
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
        background-color: #aee693;
    }

    name-wrapper {
        padding-top: 5.6vh;
    }

    section {
        flex: 1;
        align-content: space-between;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
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
        margin-bottom: 2vh;
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
</style>
