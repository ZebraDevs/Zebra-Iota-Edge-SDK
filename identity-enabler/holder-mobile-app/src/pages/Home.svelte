<script lang="ts">
    import { Plugins } from "@capacitor/core";
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import { navigate } from "svelte-routing";
    import Button from "../components/Button.svelte";
    import ListItem from "../components/ListItem.svelte";
    import {
        generateBloodCredential,
        generateHealthCredential,
        generatePersonalCredential
    } from "../lib/credentialPayload";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { account, resetAllStores, loadingScreen, credentials } from "../lib/store";
    import { wait } from "../lib/helpers";
    import type { IdentityService } from "../services/identityService";
    import { shortenDID, showAlert } from "../lib/ui/helpers";
    import { BACK_BUTTON_EXIT_GRACE_PERIOD } from "../config";
    import { get } from "svelte/store";
    import { CredentialType } from "../models/types/CredentialType";
    import { credentialDisplayMap } from "../lib/ui/credentialDisplayMap";
    import { Page } from "@zebra-iota-edge-sdk/common";

    const { App, Toast, Modals } = Plugins;

    let localCredentials = [];
    let exitOnBack = false;

    onMount(() => App.addListener("backButton", onBack).remove);
    onMount(async () => {
        try {
            const creds = get(credentials);
            localCredentials = Object.values(creds).filter(data => Boolean(data));
        } catch (err) {
            console.error(err);
        }
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

    async function generateCredential() {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity to generate a new Credential");
            return;
        }

        loadingScreen.set("Generating Credential...");

        try {
            const identityService = ServiceFactory.get<IdentityService>("identity");
            const storedIdentity = await identityService.retrieveIdentity();
            const creds = get(credentials);
            const credentialToGenerate = Object.entries(creds).find(([_, val]) => !val)[0];
            let schema;
            let payload = {};
            switch (credentialToGenerate) {
                case CredentialType.HealthTest:
                    schema = CredentialType.HealthTest;
                    payload = generateHealthCredential();
                    break;
                case CredentialType.BloodTest:
                    schema = CredentialType.BloodTest;
                    payload = generateBloodCredential();
                    break;
                case CredentialType.PersonalInfo:
                    schema = CredentialType.PersonalInfo;
                    payload = await generatePersonalCredential();
                    break;
                default:
                    throw new Error(`Unrecognized credential type "${credentialToGenerate}"`);
            }

            const generatedCredential = await identityService.createSignedCredential(
                JSON.parse(storedIdentity.didDoc).id,
                storedIdentity,
                schema,
                payload
            );
            credentials.update(current => {
                current[credentialToGenerate] = generatedCredential.toJSON();
                return current;
            });
            localCredentials = localCredentials.concat(generatedCredential.toJSON());
            loadingScreen.set("");
        } catch (err) {
            console.error(err);
            loadingScreen.set("");
            await showAlert("Error", err.name);
        }
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
                console.error(e);
                await showAlert("Could not reset", e.message);
                return;
            }
            navigate("/landing");
        }
    }

    function scan() {
        navigate("/scan");
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
                <img src="/img/person.png" class="avatar" alt="Avatar" />
            </div>
            <h1>{$account?.name ?? "No name"}</h1>
        </div>
    </div>

    <section slot="content">
        {#each localCredentials as credential}
            <div transition:slide|local class="list">
                <ListItem
                    icon="credential"
                    onClick={() => navigate("/credential", { state: { credential } })}
                    heading={credentialDisplayMap[credential.type[1]]}
                    subheading="Issued by {credential.issuer.name ??
                        shortenDID(credential.issuer.id ?? credential.issuer)}"
                />
            </div>
        {/each}
        {#if localCredentials.length < 3}
            <div transition:slide|local class="list">
                <ListItem
                    icon="add"
                    iconColor="#00a7ff"
                    arrow={false}
                    onClick={generateCredential}
                    heading="Add new credential"
                />
            </div>
        {/if}
    </section>

    <div slot="footer">
        <Button style="height: 55px; width: 55px; border-radius: 50%;" onClick={scan}>
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

    .overlay {
        color: black;
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

    .list {
        margin-bottom: 0.75rem;
    }

    .logo > .avatar {
        height: 85px;
    }

    h1 {
        margin: 1rem 0 0 0;
        text-align: center;
    }

    section {
        padding: 1.5rem;
        margin-top: 90px;
    }

    div[slot="footer"] {
        display: flex;
        justify-content: center;
        padding: 1.5rem;
    }
</style>
