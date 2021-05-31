<script>
  import { onMount } from 'svelte';
	import { Router, Route } from 'svelte-routing';
	import { getRandomUserData, goto, delay, generateRandomId } from './lib/helpers';
	import { ServiceFactory } from './factories/serviceFactory';
	import { IdentityService } from './services/identityService';
  import { SchemaNames } from './schemas';
	import { error, hasSetupAccount, storedCredentials, account } from './lib/store';

	let identityJSON = 'none';
	let isCreatingCredentials = false;


	onMount(() => {
		setTimeout(async () => {
			const identityService = ServiceFactory.get('identity');

			error.set(null);
			// account.set({ name: 'empty' });

			try {
				isCreatingCredentials = true;
				const identity = await identityService.createIdentity();
				identityJSON = JSON.stringify(identity, null, 2);

				console.log(333, identity)

				await identityService.storeIdentity('did', identity);

				const storedIdentity = await identityService.retrieveIdentity();

				const credential = await identityService.createSelfSignedCredential(storedIdentity, SchemaNames.CONTACT_DETAILS, {
					UserContacts: {
						Email: 'email@company.com',
						Phone: '111-222-3333',
					},
				});
				console.log(444, credential)

				console.log(555, storedIdentity)

				const credentialId = generateRandomId();
				storedCredentials.update((prev) =>
					[...prev, credential].map((cred) => ({
						credentialDocument: { ...cred },
						metaInformation: { issuer: 'iota' },
						id: credentialId
					}))
				);

				const storedCredential = await identityService.retrieveCredential(credentialId);

				console.log(777, credentialId, storedCredential)

				const verifiablePresentation = await identityService.createVerifiablePresentation(storedIdentity, credential);
				console.log(888, verifiablePresentation)
				const verificationResult = await identityService.verifyVerifiablePresentation(verifiablePresentation);
				console.log(999, verificationResult)
				
				isCreatingCredentials = false;
			} catch (err) {
				error.set('Error creating identity. Please try again.');
				isCreatingCredentials = false;
			}

		}, 500);
  	});

	let url = window.location.pathname;
</script>

<main>
	<!-- <Router url="{url}">
		<Route path="/" component="{HomePage}" />
		<Route path="/home" component="{HomePage}" />
		<Route path="/index.html" component="{HomePage}" />
	</Router> -->
	<h1>Welcome!</h1>
	<h3>2: {identityJSON}</h3>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
