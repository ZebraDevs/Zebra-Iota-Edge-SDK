<script lang="ts">
    import { Router, Route, navigate } from "svelte-routing";
    import { onMount } from "svelte";
    import { playAudio, showAlert } from "./lib/ui/helpers";
    import Home from "./pages/Home.svelte";
    import { ServiceFactory } from "./factories/serviceFactory";
    import CreateCredential from "./pages/CreateCredential.svelte";
    import CreatePresentation from "./pages/CreatePresentation.svelte";
    import Landing from "./pages/Landing.svelte";
    import Name from "./pages/Name.svelte";
    import PresentationJSON from "./pages/PresentationJSON.svelte";
    import DataMatrix from "./pages/DataMatrix.svelte";
    import Credential from "./pages/Credential.svelte";
    import DeviceCredential from "./pages/DeviceCredential.svelte";
    import DevInfo from "./pages/DevInfo.svelte";
    import Scan from "./pages/Scan.svelte";
    import Content from "./components/modal/Content.svelte";
    import Modal from "./components/modal/Index.svelte";
    import { hasSetupAccount } from "./lib/store";
    import Keychain from "./lib/keychain";
    import { parse } from "./lib/helpers";

    let url = window.location.pathname;
    let displayHome = false;

    // We delay playing the valid or invalid sound in order not to overlap
    // with the scanning sound
    const PLAY_DELAY = 400;

    async function handleScannerData(text: string) {
        try {
            const parsedData = parse(text);
            const claims = parsedData;

            if (claims) {
                setTimeout(async () => await playAudio("valid"), PLAY_DELAY);
                navigate("/devicecredential", { state: { claims: claims } });
            } else {
                setTimeout(async () => await playAudio("invalid"), PLAY_DELAY);
                await showAlert("Error", "Invalid Claims");
            }
        } catch (err) {
            setTimeout(async () => await playAudio("invalid"), PLAY_DELAY);
            console.error(err);
        }
    }

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
        await handleScannerData(decodedText);
    }

    onMount(async () => {
        (window as any).onScan = onScan;

        if (!$hasSetupAccount) {
            return Keychain.clear();
        }

        const identityService = ServiceFactory.get("identity");
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
            <Route path="/devicecredential" component={DeviceCredential} />
            <Route path="/datamatrix" component={DataMatrix} />

            <Route path="/scan" component={Scan} />

            <Route path="/devinfo" component={DevInfo} />
            <Route path="/presentationjson" component={PresentationJSON} />

            <Route path="/createCredential" component={CreateCredential} />
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
