<script>
	import { onDestroy, onMount } from 'svelte';
	import { navigate } from "svelte-routing";

	import Button from '../components/Button.svelte';
	import ListItem from '../components/ListItem.svelte';
	import FullScreenLoader from '../components/FullScreenLoader.svelte';

	import { ServiceFactory } from '../factories/serviceFactory';
	import { IdentityService } from '../services/identityService';
	import { SchemaNames } from '../schemas';
	import { updateStorage, getFromStorage, storedCredentials, error, account } from '../lib/store';
	import { getRandomUserData, generateRandomId } from '../lib/helpers';

	let loading = false;
	let localCredentials = {};

	onMount(async () => {
		setTimeout(async () => {
			const identityService = ServiceFactory.get('identity');
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
						payload = {
							"Test ID": "01745562",
							"Test By": "Lab services Ltd",
							"Test Timestamp": new Date(1583407920000).toDateString(),
							"Test Kit": "PowerChek MERS-CoV",
							"Test Result": "Negative",
							"Covid-19 Antibodies": 0,
							"% supressor cell (T8)": "20 %",
							"% B-cell": "12 %",
							"NK cell activity": 45,
							"Concanavalin A": "93 %",
						}
						break;

					case "blood":
						schema = SchemaNames.BLOOD_TEST;
						payload = {
							"Test ID": "91736458",
							"Test By": "Labor 28 GmbH",
							"Test Timestamp": new Date(1621507920000).toDateString(),
							"TSH (sensitive)": "3.36 mU/l",
							"LDL Cholesterol": "168 mg/dl",
							"Non-HDL Cholesterol": "175.8 mg/dl",
							"Triglyceride": "120 mg/dl",
							"HbA 1c": "5.1 %",
							"MCH (HbE)": "31.5 pg",
							"Gamma-GT (G-GT)": "11 U/l",
						}
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

				console.log('new credential', credential)

				await updateStorage('credentials', { [credentialKey]: credential })
				localCredentials.push(credential);
				
				loading = false;
    }
</script>

<style>
	main {
			display: flex;
			flex-direction: column;
			height: 100%;
	}

	header-wrapper {
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
		margin: 2.87vh 2.87vh 0 2.87vh;
    }

	.add {
		width: 40px;
		height: 40px;
	}

	.btn-wrapper {
		height: 72px;
		padding: 0 20px;
    }
</style>

<main>
	{#if loading}
		<FullScreenLoader label="Loading Credential..." />
	{:else}

	<header-wrapper>
		<div class="options-wrapper">
			<img src="../assets/settings.svg" alt="settings" />
			<img src="../assets/code.svg" alt="code" />
		</div>
		<div class="logo"><img src="../assets/person.png" alt="logo" /></div>
	</header-wrapper>

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