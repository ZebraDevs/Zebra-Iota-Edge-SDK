<script lang="ts">
    import { Router, Route } from "svelte-routing";
    import { onMount } from "svelte";
    import { showAlert } from "./lib/ui/helpers";
    import Home from "./pages/Home.svelte";
    import { ServiceFactory } from "./factories/serviceFactory";
    import CreatePresentation from "./pages/CreatePresentation.svelte";
    import Landing from "./pages/Landing.svelte";
    import Name from "./pages/Name.svelte";
    import Credential from "./pages/Credential.svelte";
    import DeviceCredential from "./pages/DeviceCredential.svelte";
    import DevInfo from "./pages/DevInfo.svelte";
    import Scan from "./pages/Scan.svelte";
    import Content from "./components/modal/Content.svelte";
    import Modal from "./components/modal/Index.svelte";
    import { hasSetupAccount, loadingScreen } from "./lib/store";
    import Keychain from "./lib/keychain";
    import type { IdentityService } from "./services/identityService";
    import InvalidCredential from "./pages/InvalidCredential.svelte";
    import { handleScannerData } from "./lib/scan";
    import FullScreenLoader from "./components/FullScreenLoader.svelte";

    let url = window.location.pathname;
    let displayHome = false;

    /**
     * Function executed when a Zebra DataWedge scanning event happens
     *
     * @param decodedText The content supplied by DataWedge (Zebra Scanner)
     */
    async function onScan(decodedText: string) {
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity to issue a credential");
            return;
        }

        if (!$hasSetupAccount) {
            await showAlert("Error", "You need to create an IOTA Identity prior to issuing a credential");
            return;
        }

        if (window.location.pathname === "/invalid") {
            await showAlert("Error", "You are already handling new claims");
            return;
        }

        await handleScannerData(decodedText, "DataWedge");
    }

    onMount(async () => {
        (window as any).onScan = onScan;

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

<main>
    {#if $loadingScreen}
        <FullScreenLoader label={$loadingScreen} />
    {/if}
    <Router {url}>
        <div>
            {#if !$hasSetupAccount}
                <Route path="/" component={Landing} />
            {:else if displayHome}
                <Route path="/" component={Home} />
            {/if}
            <Route path="/home" component={Home} />
            <Route path="/landing" component={Landing} />
            <Route path="/name" component={Name} />
            <Route path="/credential" component={Credential} />
            <Route path="/devicecredential" component={DeviceCredential} />
            <Route path="/scan" component={Scan} />
            <Route path="/devinfo" component={DevInfo} />
            <Route path="/createPresentation" component={CreatePresentation} />
            <Route path="/invalid" component={InvalidCredential} />
        </div>
    </Router>
    <Modal>
        <Content />
    </Modal>
</main>

<style>
    main {
        background-color: white;
    }

    main,
    div {
        height: 100%;
    }
</style>
