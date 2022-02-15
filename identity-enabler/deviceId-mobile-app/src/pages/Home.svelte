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
    import { Page } from "@zebra-iota-edge-sdk/common";

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
        const confirmRet = await Modals.confirm({
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

<Page>
    <div slot="header">
        <div class="options-wrapper">
            <i on:click={onClickReset} class="icon-reset" />
            <i on:click={onClickDev} class="icon-code" />
        </div>
        <div class="overlay">
            <div class="logo">
                <i class="icon-chip" />
            </div>
            <h1>Device {$account.name}</h1>
        </div>
    </div>

    <section slot="content">
        {#if $account}
            {#each localCredentials as vp}
                <div class="list">
                    <ListItem
                        icon="chip"
                        onClick={() => navigate("/credential", { state: { vp } })}
                        heading={credentialDisplayMap[vp.verifiableCredential.type[1]]}
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
                        onClick={createQR}
                        arrow={false}
                        heading="Request Device ID credential"
                    />
                </div>
            {/if}
        {/if}
    </section>
</Page>

<style>
    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 1.5rem;
    }

    .overlay {
        position: absolute;
        width: 100%;
    }

    .logo {
        margin: -60px auto 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 90px;
        height: 90px;
        background-color: white;
        background-clip: padding-box;
        border-radius: 50%;
        border: 10px solid rgba(0, 0, 0, 0.055);
    }

    .logo > .icon-chip {
        font-size: 55px;
    }

    h1 {
        margin: 1rem 0 0 0;
        text-align: center;
    }

    section {
        padding: 1.5rem;
        margin-top: 90px;
    }
</style>
