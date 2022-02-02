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
        if (!navigator.onLine) {
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
            loadingScreen.set(undefined);
        } catch (err) {
            console.error(err);
            loadingScreen.set(undefined);
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
                await Modals.alert({
                    title: "Could not reset",
                    message: e.message
                });
                return;
            }
            navigate("/landing");
        }
    }

    function scan() {
        navigate("/scan");
    }
</script>

<main>
    {#if $account}
        <header>
            <div class="options-wrapper">
                <i on:click={onClickReset} class="icon-reset" />
                <i on:click={onClickDev} class="icon-code" />
            </div>
            <div class="avatar" />
        </header>
        <name-wrapper>
            <p>{$account.name}</p>
        </name-wrapper>
        <section>
            {#each localCredentials as credential}
                <div transition:slide class="list">
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
                <div transition:slide class="list">
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
        <footer>
            <Button style="height: 55px; width: 55px; border-radius: 50%;" onClick={scan}>
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
    }

    header {
        height: 115px;
        background-color: #00a7ff;
    }

    name-wrapper {
        padding-top: 1.8rem;
    }

    section {
        flex: 1;
        align-content: space-between;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        z-index: 2;
    }

    .avatar {
        background-image: url("/img/person.png");
        width: 100px;
        height: 100px;
        background-size: cover;
        background-position: top center;
        background-repeat: no-repeat;
        border-radius: 50%;
        margin: -25px auto 0 auto;
        border: 15px solid rgba(165, 165, 165, 0.2);
    }

    .list {
        padding: 0 20px;
        margin-bottom: 2vh;
    }

    name-wrapper > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 700;
        font-size: 1.55em;
        text-align: center;
        color: #131f37;
        margin: 1em 0 0.5em 0;
    }

    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 1.5rem 3.5vh 0 3.5vh;
    }

    footer {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        bottom: 0;
        padding: 2.1vh 0 4.1vh 0;
        z-index: 3;
    }
</style>
