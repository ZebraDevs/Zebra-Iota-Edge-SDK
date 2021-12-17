<script lang="ts">
    import { Plugins } from "@capacitor/core";
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import { navigate } from "svelte-routing";
    import Button from "../components/Button.svelte";
    import ListItem from "../components/ListItem.svelte";
    import FullScreenLoader from "../components/FullScreenLoader.svelte";
    import DevInfo from "./DevInfo.svelte";
    import { credentialPayload } from "../lib/credentialPayload";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { SchemaNames } from "../schemas";
    import { updateStorage, getFromStorage, account, resetAllStores } from "../lib/store";
    import { getRandomUserData, generateRandomId, wait } from "../lib/helpers";
    import type { IdentityService } from "../services/identityService";
    import { credentialIcon, showAlert } from "../lib/ui/helpers";
    import { BACK_BUTTON_EXIT_GRACE_PERIOD } from "../config";

    let showTutorial = false;

    const { App, Toast, Modals } = Plugins;

    let loading = false;
    let localCredentials = [];
    let exitOnBack = false;

    onMount(() => App.addListener("backButton", onBack).remove);
    onMount(async () => {
        try {
            const creds = await getFromStorage("credentials");
            localCredentials = Object.values(creds)?.filter(data => data) ?? [];
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

    async function generateCredential() {
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity to generate a new Credential");
            return;
        }

        if (loading) {
            return;
        }
        loading = true;
        try {
            const identityService = ServiceFactory.get<IdentityService>("identity");
            const storedIdentity = await identityService.retrieveIdentity();
            const credentials = await getFromStorage("credentials");
            const nonEmpty = Object.values(credentials)?.filter(data => data);
            const credentialKey = Object.keys(credentials)?.[nonEmpty.length];
            let schema;
            let payload = {};
            switch (credentialKey) {
                case "health":
                    schema = SchemaNames.HEALTH_TEST;
                    payload = credentialPayload.health;
                    break;
                case "blood":
                    schema = SchemaNames.BLOOD_TEST;
                    payload = credentialPayload.blood;
                    break;
                case "personal":
                default:
                    const userData = await getRandomUserData();
                    schema = SchemaNames.PERSONAL_DATA;
                    payload = {
                        UserPersonalData: {
                            UserName: {
                                FirstName: $account.name,
                                LastName: userData.name.last
                            },
                            UserDOB: {
                                "Date of Birth": new Date(userData.dob.date).toDateString()
                            },
                            Birthplace: userData.location.city,
                            Nationality: userData.location.country,
                            "Identity Card Number": userData.id.value,
                            "Passport Number": Math.random().toString(36).substring(7).toUpperCase()
                        }
                    };
            }

            const newCredential = await identityService.createSelfSignedCredential(storedIdentity, schema, payload);
            const credentialId = generateRandomId();
            const enrichment = identityService.enrichCredential({ ...newCredential });
            const credential = {
                credentialDocument: { ...newCredential },
                metaInformation: { issuer: "iota" },
                id: credentialId,
                enrichment
            };
            console.log("new credential", credential);
            await updateStorage("credentials", { [credentialKey]: credential });
            localCredentials.push(credential);

            loading = false;
        } catch (err) {
            loading = false;
            console.log(err);
            await showAlert("Error", err.name);
        }
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

    function scan() {
        navigate("/scan");
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
                        icon={credential.enrichment
                            ? credentialIcon[credential.enrichment.credentialLabel]
                            : "credential"}
                        onClick={() => navigate("credential", { state: { credential } })}
                        heading={credential.enrichment ? credential.enrichment.issuerLabel : ""}
                        subheading={credential.enrichment ? credential.enrichment.credentialLabel : ""}
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
                        subheading="Add new credential"
                    />
                </div>
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
    }

    header {
        height: 155px;
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
        width: 120px;
        height: 120px;
        background-size: cover;
        background-position: top center;
        background-repeat: no-repeat;
        border-radius: 50%;
        margin: 0 auto;
        border: 15px solid rgba(165, 165, 165, 0.2);
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
