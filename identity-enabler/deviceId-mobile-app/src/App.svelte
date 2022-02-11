<script lang="ts">
    import { Router, Route } from "svelte-routing";
    import { onMount } from "svelte";
    import Home from "./pages/Home.svelte";
    import { ServiceFactory } from "./factories/serviceFactory";
    import CreateQR from "./pages/CreateQR.svelte";
    import CreatePresentation from "./pages/CreatePresentation.svelte";
    import Landing from "./pages/Landing.svelte";
    import Name from "./pages/Name.svelte";
    import Credential from "./pages/Credential.svelte";
    import Content from "./components/modal/Content.svelte";
    import Modal from "./components/modal/Index.svelte";
    import Scan from "./pages/Scan.svelte";
    import RequestCredential from "./pages/RequestCredential.svelte";
    import { credentials, hasSetupAccount, loadingScreen } from "./lib/store";
    import Keychain from "./lib/keychain";
    import { showAlert } from "./lib/ui/helpers";
    import type { IdentityService } from "./services/identityService";
    import InvalidCredential from "./pages/InvalidCredential.svelte";
    import FullScreenLoader from "./components/FullScreenLoader.svelte";
    import { handleScannerData } from "./lib/scan";
    import Tutorial from "./pages/Tutorial.svelte";
    import CodeBlock from "./pages/CodeBlock.svelte";
    import { CredentialType } from "./models/types/CredentialType";

    const url = window.location.pathname;
    let displayHome = false;

    /**
     * Function executed when a Zebra DataWedge scanning event happens
     *
     * @param decodedText The content supplied by DataWedge (Zebra Scanner)
     */
    async function onScan(decodedText: string) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity to verify your credential");
            return;
        }

        if (!$hasSetupAccount) {
            await showAlert("Error", "You need to create an IOTA Identity prior to requesting a credential");
            return;
        }

        if ($credentials[CredentialType.DeviceID]) {
            await showAlert("Error", "You already have a credential");
            return;
        }

        if (window.location.pathname === "/invalid" || window.location.pathname === "/credential") {
            await showAlert("Error", "You are already handling a credential");
            return;
        }

        await handleScannerData(decodedText, "DataWedge");
    }

    onMount(async () => {
        window.onScan = onScan;

        if (!$hasSetupAccount) {
            return Keychain.clear();
        }

        const identityService = ServiceFactory.get<IdentityService>("identity");
        const storedIdentity = await identityService.retrieveIdentity();

        if (storedIdentity) {
            displayHome = true;
        }
    });
</script>

{#if $loadingScreen}
    <FullScreenLoader label={$loadingScreen} />
{/if}
<Router {url}>
    {#if !$hasSetupAccount}
        <Route path="/" component={Landing} />
    {:else if displayHome}
        <Route path="/" component={Home} />
    {/if}
    <Route path="/home" component={Home} />
    <Route path="/landing" component={Landing} />
    <Route path="/name" component={Name} />
    <Route path="/credential" component={Credential} />
    <Route path="/requestcredential" component={RequestCredential} />
    <Route path="/createQR" component={CreateQR} />
    <Route path="/scan" component={Scan} />
    <Route path="/createPresentation" component={CreatePresentation} />
    <Route path="/invalid" component={InvalidCredential} />
    <Route path="/tutorial" component={Tutorial} />
    <Route path="/code" component={CodeBlock} />
</Router>
<Modal>
    <Content />
</Modal>

<style>
</style>
