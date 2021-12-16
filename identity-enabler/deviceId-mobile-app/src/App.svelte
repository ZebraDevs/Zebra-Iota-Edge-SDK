<script lang="ts">
    import { Router, Route, navigate } from "svelte-routing";
    import { onMount } from "svelte";
    import Home from "./pages/Home.svelte";
    import { ServiceFactory } from "./factories/serviceFactory";
    import CreateQR from "./pages/CreateQR.svelte";
    import CreatePresentation from "./pages/CreatePresentation.svelte";
    import Landing from "./pages/Landing.svelte";
    import Name from "./pages/Name.svelte";
    import PresentationJSON from "./pages/PresentationJSON.svelte";
    import Credential from "./pages/Credential.svelte";
    import DevInfo from "./pages/DevInfo.svelte";
    import Content from "./components/modal/Content.svelte";
    import Modal from "./components/modal/Index.svelte";
    import Scan from "./pages/Scan.svelte";
    import RequestCredential from "./pages/RequestCredential.svelte";
    import { hasSetupAccount } from "./lib/store";
    import Keychain from "./lib/keychain";
    import { playAudio, showAlert } from "./lib/ui/helpers";
    import { parse } from "./lib/helpers";
    import type { IdentityService } from "./services/identityService";
    import { Toast } from "@capacitor/core";

    let url = window.location.pathname;
    let displayHome = false;

    async function handleScannerData(text: string) {
        let credential = parse(text);

        if (!credential) {
            await playAudio("invalid");

            await showAlert("Error", "Invalid Credential Received");
            return;
        }

        let verificationResult;
        const identityService = ServiceFactory.get<IdentityService>("identity");
        try {
            verificationResult = await identityService.verifyVerifiablePresentation(credential);
        } catch (error) {
            await playAudio("invalid");
            console.error(error);
            return;
        }

        if (verificationResult) {
            await playAudio("valid");

            await Toast.show({
                text: "Credential verified!",
                position: "center"
            });
            navigate("credential", { state: { credential, save: true } });
        } else {
            await playAudio("invalid");
            await showAlert("Error", "Invalid Credential Received");
        }
    }

    /**
     * Function executed when a Zebra DataWedge scanning event happens
     *
     * @param decodedText The content supplied by DataWedge (Zebra Scanner)
     */
    async function onScan(decodedText: string) {
        // If we are not expecting a credential we just ignore the event
        if (!window.location.href.includes("requestcredential")) {
            // We give feedback to the user telling scanning happing on the wrong page
            await playAudio("invalid");
            return;
        }

        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity to verify your credential");
            return;
        }
        await handleScannerData(decodedText);
    }

    onMount(async () => {
        (window as any).onScan = onScan;

        if (!$hasSetupAccount) {
            return Keychain.clear();
        }

        const identityService = ServiceFactory.get<IdentityService>("identity");
        const storedIdentity = await identityService.retrieveIdentity();

        if (storedIdentity) {
            console.log("Found identity", storedIdentity);
            displayHome = true;
        }
    });
</script>

<main>
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
            <Route path="/devinfo" component={DevInfo} />
            <Route path="/presentationjson" component={PresentationJSON} />
            <Route path="/requestcredential" component={RequestCredential} />
            <Route path="/createQR" component={CreateQR} />
            <Route path="/scan" component={Scan} />
            <Route path="/createPresentation" component={CreatePresentation} />
        </div>
    </Router>
    <Modal>
        <Content />
    </Modal>
</main>

<style>
    main,
    div {
        height: 100%;
    }
</style>
