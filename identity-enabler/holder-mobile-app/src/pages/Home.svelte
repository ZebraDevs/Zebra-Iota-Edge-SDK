<script>
	import { onDestroy, onMount } from 'svelte';
	import { navigate } from "svelte-routing";

	import Button from '../components/Button.svelte';
	import ListItem from '../components/ListItem.svelte';

	import { ServiceFactory } from '../factories/serviceFactory';
	import { IdentityService } from '../services/identityService';
  import { SchemaNames } from '../schemas';
	import { updateStorage, getFromStorage, storedCredentials, error, account, credentialIDs } from '../lib/store';
	import { getRandomUserData, generateRandomId } from '../lib/helpers';

	let loading = false;
	const credentials = [];

	onMount(async () => {
		setTimeout(async () => {
			console.log('credentialIDs 1', $credentialIDs, $storedCredentials);
			const identityService = ServiceFactory.get('identity');
			try {
				if ($credentialIDs?.total > 0) {
					console.log('credentialIDs 2', Object.values($credentialIDs?.credentials));
					for await (const id of Object.values($credentialIDs?.credentials)) {
						if (id) {
							const stored = await identityService.retrieveCredential(id);
							console.log('Stored', id, stored)
							credentials.push(stored);
							// stored && storedCredentials.update((prev) => [...prev, stored]);

							// storedCredentials.update((prev) => {
							// 	console.log('Home mount storedCredentials 1', prev)
							// 	console.log('Home mount storedCredentials 2', stored);

							// 	const result = [...prev, stored];
							// 	console.log('Home mount storedCredentials 4', result)
							// 	return result;
							// });
						}
					};
				}
				console.log('credentialIDs 3', credentials);
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

				const credentialKey = Object.keys($credentialIDs?.credentials)[$credentialIDs?.total];
				console.log('credentialKey', credentialKey);

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
									Date: new Date(userData.dob.date).toDateString(),
								},
								Birthplace: userData.location.city,
								Nationality: userData.location.country,
								IdentityCardNumber: userData.id.value,
								PassportNumber: Math.random().toString(36).substring(7).toUpperCase(),
							}
						}
				}
				
				console.log('Prepare schema 0', schema, payload);

				const newCredential = await identityService.createSelfSignedCredential(storedIdentity, schema, payload);
				const credentialId = generateRandomId();
				console.log('newCredential', newCredential, credentialId)

				console.log('Prepare schema 1', $credentialIDs?.total)
				console.log('Prepare schema 2', $credentialIDs?.credentials)
				console.log('Prepare schema 3', Object.keys($credentialIDs?.credentials))
				console.log('Prepare schema 4', Object.keys($credentialIDs?.credentials)[$credentialIDs?.total])

				const enrichment = identityService.enrichCredential({ ...newCredential });

				const credential = {
					credentialDocument: { ...newCredential },
					metaInformation: { issuer: 'iota' },
					id: credentialId,
					enrichment
				};


				storedCredentials.update((prev) => {
					console.log('Home storedCredentials 1', prev)
					console.log('Home storedCredentials 2', obj);

					const result = [...prev, obj];
					console.log('Home storedCredentials 4', result)
					return result;
				});

				credentialIDs.set({ 
					total: $credentialIDs.total + 1,
					credentials: {
						...$credentialIDs?.credentials,
						[credentialKey]: credentialId 
					}
				});
				
				loading = false;
    }

</script>

<style>
	main {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 100%;
			background: linear-gradient(90deg, #00FFFF 0%, #0099FF 100%);
	}

	header {
			margin-top: 4vh;
			margin-bottom: 5vh;
	}

	section {
			flex: 1;
			align-content: space-between;
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;
			background: #F8F8F8;
	}

	.logo {
			margin-top: 2vh;
			margin-bottom: 1vh;
			text-align: center;
	}

	.logo > img {
			width: 15vh;
			height: 15vh;
	}

	.list:not(:last-child) {
			margin-bottom: 3vh;
	}

	.list:last-child {
			margin-bottom: 9vh;
	}

	header > p {
			font-family: 'Metropolis', sans-serif;
			font-weight: bold;
			font-size: 6vw;
			line-height: 8vw;
			text-align: center;
			color: #131f37;
	}

</style>

<main>
	<div class="logo"><img src="../assets/person.png" alt="" /></div>

	<header>
			<p>Hi {$account.name}!</p>
	</header>
	<section>
		 ZZ {credentials.length}
			{#each credentials as credential}
			<div class="list">
					<ListItem
							onClick="{() => navigate('credential', { state: { credential }})}"
							heading="{credential.enrichment ? credential.enrichment.issuerLabel : ''}"
							subheading="{credential.enrichment ? credential.enrichment.credentialLabel : ''}"
					/>
			</div>
			{/each}
			<Button
				disabled="{$storedCredentials.length > 2}"
				label="Add new credential"
				onClick="{generateCredential}"
			/>
	</section>
</main>
