<script>
    import { navigate } from "svelte-routing";
    import { beforeUpdate } from 'svelte';
    import { Plugins } from '@capacitor/core';

    import { updateStorage, error } from '../lib/store';
    import { SchemaNames } from '../schemas';
    import { ServiceFactory } from '../factories/serviceFactory';
    import { generateRandomId } from '../lib/helpers';

    import FullScreenLoader from '../components/FullScreenLoader.svelte';
    import Button from '../components/Button.svelte';
    import ObjectList from '../components/ObjectList.svelte';
    import DevInfo from './DevInfo.svelte';

    const { App } = Plugins;

    let showTutorial = false;
    let loading = false;

    const claims = window.history.state.claims;

    async function createCredential() {
        loading = true;
		const identityService = ServiceFactory.get('identity');
		error.set(null);
		try {
			const storedIdentity = await identityService.retrieveIdentity();
            const payload = {
                DeviceData: {
                    'Device ID': claims.id,
                    'Device Name': claims.deviceName,
                    Manufacturer: claims.manufacturer,
                    'Serial Number': claims.uuid,
                    'Operating System': claims.operatingSystem,
                    Model: claims.model,
                    'OS Version': claims.osVersion,
                }
            };
			const newCredential = await identityService.createSelfSignedCredential(storedIdentity, SchemaNames.Organisation_ID, payload);
			const credentialId = generateRandomId();
            const enrichment = identityService.enrichCredential({ ...newCredential });
			const credential = {
				credentialDocument: { ...newCredential },
				metaInformation: { issuer: 'Zebra Technologies' },
				id: credentialId,
				enrichment
			};
			console.log('new credential', credential);
			await updateStorage('credentials', { ['organization']: credential });
            loading = false;
            navigate('createPresentation', { state: { credential }});
		} catch (err) {
			error.set('Error creating credential. Please try again.');
			loading = false;
		}
    }

    function goBack() {
        navigate('home');
    }

    function onClickDev() {
        showTutorial = true;
    }

	beforeUpdate(() => {
        !showTutorial && App.removeAllListeners();
	});
</script>

<style>
    main {
        display: flex;
		flex-direction: column;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		position: relative;
		height: 100%;
    }

    header {
        margin-bottom: 5vh;
    }

    .wrapper {
        text-align: center;
        padding-bottom: 15vh;
        max-height: 36vh;
        background: linear-gradient(90deg, #00FFFF 0%, #0099FF 100%);
    }

    header {
        margin-left: auto;
        margin-right: auto;
        z-index: 1;
        height: fit-content;
        margin-bottom: 0;
    }

    header > p {
        font-family: 'Proxima Nova', sans-serif;
        font-weight: 700;
        font-size: 3.4vh;
        line-height: 3.4vh;
        color: #fff;
    }

    header > p:nth-child(2) {
        font-weight: 600;
        text-transform: uppercase;
        font-size: 1.7vh;
        line-height: 2.3vh;
    }

    header > p:nth-child(3) {
        margin: 1.6vh 0 0 0;
    }

    header > p:nth-child(4) {
        margin-bottom: 0;
        font-size: 1.7vh;
    }

    section {
        margin: 0 7vw;
        z-index: 2;
    }

    footer {
        position: fixed;
        width: 100%;
        bottom: 0;
        z-index: 6;
    }

    .options-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 3.5vh 3.5vh 0 3.5vh;
        z-index: 3;
    }
</style>

<main>
    {#if loading}
		<FullScreenLoader label="Loading Credential..." />
	{/if}

    {#if showTutorial}
		<DevInfo page="Credential" bind:showTutorial={showTutorial} />
	{/if}

    {#if !showTutorial}
    <div class="wrapper">
        <div class="options-wrapper">
			<img src="../assets/chevron-left.svg" on:click="{goBack}" alt="chevron-left" />
            <img src="../assets/code.svg" on:click="{onClickDev}" alt="code" />
		</div>
        <header>
            <p>Device {claims.deviceName} claims</p>
        </header>
        <section>
            <ObjectList object="{claims}" />
        </section>
    </div>
    <footer>
        <Button style="background: #0099FF; color: white;" label="Issue Device ID credential" onClick="{createCredential}" />
    </footer>
    {/if}
</main>