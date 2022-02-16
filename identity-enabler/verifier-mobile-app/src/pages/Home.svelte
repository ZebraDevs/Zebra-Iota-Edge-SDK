<script lang="ts">
    import { Plugins } from "@capacitor/core";
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { slide } from "svelte/transition";
    import { credentials, resetAllStores } from "../lib/store";
    import { isExpired, wait } from "../lib/helpers";
    import Button from "../components/Button.svelte";
    import ListItem from "../components/ListItem.svelte";
    import { showAlert, shortenDID } from "../lib/ui/helpers";
    import { BACK_BUTTON_EXIT_GRACE_PERIOD } from "../config";
    import { get } from "svelte/store";
    import { credentialDisplayMap } from "../lib/ui/credentialDisplayMap";
    import { Page } from "@zebra-iota-edge-sdk/common";

    const { App, Toast, Modals } = Plugins;

    let localCredentials = [];
    let exitOnBack = false;

    onMount(() => App.addListener("backButton", onBack).remove);
    onMount(() => {
        localCredentials = Object.values(get(credentials)).filter(data => Boolean(data));
    });

    async function scan() {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity for verifying credentials");
            return;
        }
        navigate("/scan");
    }

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

    function onClickDev() {
        navigate("/tutorial");
    }

    function onClickCredential(credential) {
        navigate("/credential", { state: { credential } });
    }

    async function onClickReset() {
        const confirmRet = await Modals.confirm({
            title: "Reset the app",
            message: "Are you sure you want to reset the app and delete all credentials?"
        });
        if (confirmRet.value) {
            resetAllStores();
            navigate("/landing");
        }
    }
</script>

<Page>
    <div slot="header" class="options-wrapper">
        <i on:click={onClickReset} class="icon-reset" />
        <h3>SCANNED CREDENTIALS</h3>
        <i on:click={onClickDev} class="icon-code" />
    </div>

    <section slot="content">
        {#if localCredentials.length === 0}
            <p>No credentials scanned</p>
        {:else}
            {#each localCredentials as credential}
                <div transition:slide|local class="list">
                    <ListItem
                        icon={isExpired(credential.issuanceDate) ? "cross" : "check"}
                        iconColor="#1e22aa"
                        onClick={() => onClickCredential(credential)}
                        heading={credentialDisplayMap[credential.type[1]]}
                        subheading="Issued by {credential.issuer.name ??
                            shortenDID(credential.issuer.id ?? credential.issuer)}"
                    />
                </div>
            {/each}
        {/if}
    </section>

    <div slot="footer">
        <Button style="height: 64px; width: 64px; border-radius: 50%;" onClick={scan}>
            <i class="icon-scan" />
        </Button>
    </div>
</Page>

<style>
    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 1.5rem;
    }

    h3 {
        margin: 0;
        align-self: center;
    }

    p {
        text-align: center;
    }

    section {
        padding: 1.5rem;
    }

    .list {
        margin-bottom: 0.75rem;
    }

    div[slot="footer"] {
        display: flex;
        justify-content: center;
        padding: 1.5rem;
    }
</style>
