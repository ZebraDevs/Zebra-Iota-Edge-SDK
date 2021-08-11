<script>
    import { navigate } from 'svelte-routing';
    import { fly } from 'svelte/transition';
    import { Plugins } from '@capacitor/core';

    import { ServiceFactory } from '../factories/serviceFactory';
    import { error, updateStorage } from '../lib/store';
    import { parse } from '../lib/helpers';
    import { __ANDROID__ } from '../lib/platforms';

    import Scanner from '../components/Scanner.svelte';

    const { Modals, Toast } = Plugins;

    let VP = '';
    let loading = false;

    async function handleScannerData(event) {
        try {
            let parsedData = parse(event.detail);
            VP = parsedData;
            console.log("VP", VP);

            if (!VP) return goBack();

            const identityService = ServiceFactory.get('identity');
            const verificationResult = await identityService.verifyVerifiablePresentation(VP);
    
            if (verificationResult) {
                await updateStorage('credentials', { [VP.verifiableCredential.type[1].split(/\b/)[0].toLowerCase()]: VP.verifiableCredential });
                loading = true;
                showToast();
                goBack();
            } else {
                loading = false;
                await showAlert();
                error.set('Invalid Data Matrix');
                goBack();
            }
        } catch (err) {
            console.error(err);
        };
    }

    async function showToast() {
        await Toast.show({
            text: 'Credential verified!',
            options: 'center'
        });
    }

    async function showAlert() {
		await Modals.alert({
			title: 'Unable to fetch the credential',
			message: 'Invalid Data Matrix'
		});
	}

    function goBack() {
        navigate('home', { state: { loading: loading }});
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
    <header class:ios="{__ANDROID__}">
        <img on:click="{goBack}" src="../assets/chevron-left.svg" alt="back" />
        <p>Scanner</p>
    </header>
    <Scanner on:message="{handleScannerData}" />
</main>