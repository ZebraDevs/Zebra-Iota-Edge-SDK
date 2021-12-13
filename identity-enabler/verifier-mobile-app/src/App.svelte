<script lang="ts">
    import { Router, Route } from 'svelte-routing';
    import Home from './pages/Home.svelte';
    import DevInfo from './pages/DevInfo.svelte';
    import Scan from './pages/Scan.svelte';
    import InvalidCredential from './pages/InvalidCredential.svelte';
    import { onMount } from 'svelte';
    import FullScreenLoader from './components/FullScreenLoader.svelte';
    import { loadingScreen } from './lib/store';
    import { handleScannerData } from './lib/scan';
    import { showAlert } from './lib/ui/helpers';
    import Credential from './pages/Credential.svelte';

    let url = window.location.pathname;

    async function onScan(decodedText: string) {
        if (navigator.onLine === false) {
            await showAlert(
                'Error', 
                'You need Internet connectivity to verify a credential' 
            );
            return;
        }
        await handleScannerData(decodedText);
    }

    onMount(() => {
        (window as any).onScan = onScan;
    });
</script>

<main>
    {#if $loadingScreen}
        <FullScreenLoader label={$loadingScreen} />
    {/if}
    <Router url="{url}">
        <div>
            <Route path="/" component="{Home}" />
            <Route path="/home" component="{Home}" />
            <Route path="/devinfo" component="{DevInfo}" />
            <Route path="/invalid" component="{InvalidCredential}" />
            <Route path="/scan" component="{Scan}" />
            <Route path="/credential" component="{Credential}" />
        </div>
    </Router>
</main>

<style>
    main, div {
        height: 100%
    }
</style>
