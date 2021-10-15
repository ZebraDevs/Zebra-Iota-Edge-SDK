<script>
	import { Plugins } from '@capacitor/core';
	import { onMount } from 'svelte';
	import { navigate } from "svelte-routing";

	import Button from '../components/Button.svelte';
	import ListItem from '../components/ListItem.svelte';
	import FullScreenLoader from '../components/FullScreenLoader.svelte';
	import DevInfo from './DevInfo.svelte';

	import { credentialPayload } from '../assets/credentialPayload';

	import { ServiceFactory } from '../factories/serviceFactory';
	import { SchemaNames } from '../schemas';
	import { updateStorage, getFromStorage, storedCredentials, error, account } from '../lib/store';
	import { getRandomUserData, generateRandomId } from '../lib/helpers';

    let showTutorial = false;

	const { App, Modals } = Plugins;

	let loading = false;
	let localCredentials = {};

	onMount(async () => {
		App.addListener("backButton", function(){}, false);
		setTimeout(async () => {
			try {
				localCredentials = await getFromStorage('credentials');
				localCredentials = Object.values(localCredentials)?.filter(data => data);
				console.log('onMount', localCredentials);
			} catch (err) {
				console.log(err)
			}
		}, 0);
    });

	async function generateCredential() {
        if (loading) {
            return;
        }
        loading = true;
		try {
			const identityService = ServiceFactory.get('identity');
			const storedIdentity = await identityService.retrieveIdentity();
			const credentials = await getFromStorage('credentials');
			const nonEmpty = Object.values(credentials)?.filter(data => data);
			const credentialKey = Object.keys(credentials)?.[nonEmpty.length];
			let schema;
			let payload = {};
			switch (credentialKey) {
				case "health":
					schema = SchemaNames.HEALTH_TEST;
					payload = credentialPayload.health;
					break;
				case "blood":
					schema = SchemaNames.BLOOD_TEST;
					payload = credentialPayload.blood;
					break;
				
				case "personal":
				default:
					const userData = await getRandomUserData();
					schema = SchemaNames.PERSONAL_DATA;
					payload = {
						UserPersonalData: {
							UserName: {
								FirstName: $account.name,
								LastName: userData.name.last,
							},
							UserDOB: {
								"Date of Birth": new Date(userData.dob.date).toDateString(),
							},
							Birthplace: userData.location.city,
							Nationality: userData.location.country,
							"Identity Card Number": userData.id.value,
							"Passport Number": Math.random().toString(36).substring(7).toUpperCase(),
						}
					}
			}
			
			const newCredential = await identityService.createSelfSignedCredential(storedIdentity, schema, payload);
			const credentialId = generateRandomId();
			const enrichment = identityService.enrichCredential({ ...newCredential });
			const credential = {
				credentialDocument: { ...newCredential },
				metaInformation: { issuer: 'iota' },
				id: credentialId,
				enrichment
			};
			console.log('new credential', credential);
			await updateStorage('credentials', { [credentialKey]: credential });
			localCredentials.push(credential);
			
			loading = false;
			} catch (err) {
				loading = false;
				console.log(err);
				showAlert();
			}
    }

	function onClickDev() {
		showTutorial = true;
	}

	async function showAlert() {
		await Modals.alert({
			title: 'Unable to generate the credential',
			message: 'Please check your internet connection'
		});
	}

	async function onClickReset() {
		let confirmRet = await Modals.confirm({
			title: 'Reset the app',
			message: 'Are you sure you want to reset the app and delete all credentials?'
		});
		if (confirmRet.value) {
			localStorage.clear();
			navigate('landing');
		}
	}
</script>

<style>
	main {
			display: flex;
			flex-direction: column;
			height: 100%;
	}

	header {
			display: flex;
			flex-direction: column;
			height: 141px;
			background: linear-gradient(90deg, #00FFFF 0%, #0099FF 100%);
	}

	name-wrapper {
			padding-top: 5.6vh;
			background: #F8F8F8;
	}

	section {
			flex: 1;
			align-content: space-between;
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;
			background: #F8F8F8;
	}

	.logo {
			position: relative;
			bottom: 5%;
			border: 25px solid rgba(165, 165, 165, 0.10);
			border-radius: 50%;
			width: 100px;
			height: 100px;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 auto;
	}

	.logo > img {
			width: 15vh;
			height: 15vh;
	}

	.list {
		padding: 0 20px;
	}

	.list:not(:last-child) {
			margin-bottom: 3vh;
	}

	.list:last-child {
			margin-bottom: 9vh;
	}
	
	name-wrapper > p {
			font-family: 'Proxima Nova', sans-serif;
			font-weight: 700;
			font-size: 6vw;
			line-height: 8vw;
			text-align: center;
			color: #131f37;
	}

	.options-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 3.5vh 3.5vh 0 3.5vh;
    }

	.add {
		width: 40px;
		height: 40px;
	}

	.code {
		margin-left: auto;
	}

	.btn-wrapper {
		height: 72px;
		padding: 0 20px;
    }
</style>

<main>
	{#if showTutorial}
		<DevInfo page="Identity" bind:showTutorial={showTutorial} />
	{/if}

	{#if loading}
		<FullScreenLoader label="Loading Credential..." />
	{/if}

	{#if !loading}
	<header>
		<div class="options-wrapper">
			<img src="../assets/reset.svg" on:click="{onClickReset}" alt="reset" /> 
			<img class="code" src="../assets/code.svg" on:click="{onClickDev}" alt="code" />
		</div>
		<div class="logo"><img src="../assets/person.png" alt="logo" /></div>
	</header>
	<name-wrapper>
		<p>{$account.name}</p>
	</name-wrapper>
	<section>
			{#each Object.values(localCredentials) as credential}
			<div class="list">
					<ListItem
							onClick="{() => navigate('credential', { state: { credential }})}"
							heading="{credential.enrichment ? credential.enrichment.issuerLabel : ''}"
							subheading="{credential.enrichment ? credential.enrichment.credentialLabel : ''}"
					/>
			</div>
			{/each}
			{#if Object.values(localCredentials).length < 3}
				<div class="btn-wrapper">
					<Button style="background: white; color: #051923; display: flex; justify-content: flex-start; padding-left: 20px;" 
							label="Add new credential" 
							onClick="{generateCredential}"
					>
						<img class="add" src="../assets/add.png" alt="add" />
					</Button>
				</div>
			{/if}
	</section>
	{/if}
</main>