<script>
    import { navigate } from 'svelte-routing';
    import { fly } from 'svelte/transition';

    import { parse } from '../lib/helpers';
    import { __ANDROID__ } from '../lib/platforms';

    import Scanner from '../components/Scanner.svelte';
    import FullScreenLoader from '../components/FullScreenLoader.svelte';

    let claims = '';
    let invalid = false;
    let loading = false;

    async function handleScannerData(event) {
        try {
            loading = true;
            let parsedData = parse(event.detail);
            claims = parsedData;
            console.log("claims", claims);
    
            if (claims) {
                navigate('devicecredential', { state: { claims: claims }});
            } else {
                return showAlert();
            }
        } catch (err) {
            console.error(err);
        };
    }

    function showAlert() {
        invalid = true;
        loading = false;
	}

    function goBack() {
        navigate('home');
    }
</script>

<style>
    main {
        height: 100%;
        overflow: hidden;
    }

    header {
        background: linear-gradient(90deg, #00FFFF 0%, #0099FF 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        height: 7.4vh;
    }

    header.ios {
        padding: calc(env(safe-area-inset-top) + 1vh) 0 2vw 0;
        padding: calc(constant(safe-area-inset-top) + 1vh) 0 2vw 0;
    }

    img {
        position: absolute;
        left: 5vw;
    }

    header > p {
        flex-grow: 1;
        overflow: hidden;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: 'Proxima Nova', sans-serif;
        font-weight: 600;
        font-size: 5vw;
        line-height: 5vw;
        letter-spacing: 0.04em;
        color: #ffffff;
        margin: 0;
    }
</style>

<main transition:fly="{{ y: 200, duration: 500 }}">
    {#if loading}
		<FullScreenLoader label="loading QR code..." />
	{/if}

    {#if !invalid && !loading}
        <header class:ios="{__ANDROID__}">
            <img on:click="{goBack}" src="../assets/chevron-left.svg" alt="back" />
            <p>Scanner</p>
        </header>
        <Scanner on:message="{handleScannerData}" />
    {/if}
</main>