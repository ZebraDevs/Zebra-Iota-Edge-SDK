<script lang="ts">
    import { navigate } from "svelte-routing";
    import { loadingScreen } from "../lib/store";
    import { CredentialType } from "../models/types/CredentialType";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { flattenClaim, showAlert } from "../lib/ui/helpers";
    import Button from "../components/Button.svelte";
    import ObjectList from "../components/ObjectList.svelte";
    import type { IdentityService } from "../services/identityService";
    import { Page } from "@zebra-iota-edge-sdk/common";

    const credentialSubject = window.history.state.credentialSubject;

    async function createCredential() {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity to create a Device Credential");
            return;
        }

        loadingScreen.set("Generating Credential...");
        const identityService = ServiceFactory.get<IdentityService>("identity");

        try {
            const storedIdentity = await identityService.retrieveIdentity();
            const subjectId = credentialSubject.id;
            const claims = { ...credentialSubject };
            delete claims.id;
            const credential = await identityService.createSignedCredential(
                subjectId,
                storedIdentity,
                CredentialType.DeviceID,
                claims
            );
            loadingScreen.set("");
            navigate("/createPresentation", { state: { credential: credential.toJSON() } });
        } catch (err) {
            console.error(err);
            loadingScreen.set("");
            await showAlert("Error", "Error creating credential. Please try again.");
        }
    }

    function goBack() {
        window.history.back();
    }

    function onClickDev() {
        navigate("/tutorial");
    }
</script>

<Page>
    <div slot="header" class="options-wrapper">
        <i on:click={goBack} class="icon-chevron" />
        <h2>Device Claims</h2>
        <i on:click={onClickDev} class="icon-code" />
    </div>

    <section slot="content">
        <ObjectList entries={flattenClaim(credentialSubject)} />
    </section>

    <svelte:fragment slot="footer">
        <Button label="Issue Device ID credential" onClick={createCredential} />
    </svelte:fragment>
</Page>

<style>
    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .options-wrapper,
    section {
        padding: 1.5rem;
    }

    h2 {
        margin: 0 0.5rem;
        align-self: center;
    }
</style>
