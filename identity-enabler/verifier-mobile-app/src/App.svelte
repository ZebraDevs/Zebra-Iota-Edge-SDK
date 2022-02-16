<script lang="ts">
    import { Router, Route } from "svelte-routing";
    import Home from "./pages/Home.svelte";
    import Scan from "./pages/Scan.svelte";
    import InvalidCredential from "./pages/InvalidCredential.svelte";
    import { onMount } from "svelte";
    import FullScreenLoader from "./components/FullScreenLoader.svelte";
    import { firstLaunch, loadingScreen } from "./lib/store";
    import { handleScannerData } from "./lib/scan";
    import { showAlert } from "./lib/ui/helpers";
    import Credential from "./pages/Credential.svelte";
    import Landing from "./pages/Landing.svelte";
    import Tutorial from "./pages/Tutorial.svelte";

    const url = window.location.pathname;

    /**
     * Function executed when a Zebra DataWedge scanning event happens
     *
     * @param decodedText The content supplied by DataWedge (Zebra Scanner)
     */
    async function onScan(decodedText: string) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity to verify a credential");
            return;
        }

        if (window.location.pathname === "/invalid" || window.location.pathname === "/credential") {
            await showAlert("Error", "You are already handling a credential");
            return;
        }

        await handleScannerData(decodedText);
    }

    onMount(() => {
        window.onScan = onScan;
    });
</script>

{#if $loadingScreen}
    <FullScreenLoader label={$loadingScreen} />
{/if}
<Router {url}>
    {#if $firstLaunch}
        <Route path="/" component={Landing} />
    {:else}
        <Route path="/" component={Home} />
    {/if}
    <Route path="/landing" component={Landing} />
    <Route path="/home" component={Home} />
    <Route path="/invalid" component={InvalidCredential} />
    <Route path="/scan" component={Scan} />
    <Route path="/credential" component={Credential} />
    <Route path="/tutorial" component={Tutorial} />
</Router>
