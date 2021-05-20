<script>
  	import { onMount } from 'svelte';
	import { Router, Route } from 'svelte-routing';
	import { getRandomUserData, goto, delay, generateRandomId } from './lib/helpers';
	import { createIdentity, storeIdentity, retrieveIdentity, createSelfSignedCredential } from './lib/identity';
  	import { SchemaNames } from './lib/identity/schemas';
	import { error, hasSetupAccount, storedCredentials, account } from './lib/store';

	let identityJSON = 'no';
	let isCreatingCredentials = false;

	onMount(() => {
		setTimeout(() => {
			error.set(null);
			// account.set({ name: 'empty' });

			retrieveIdentity()
				.then((identity) =>
					identity
						? Promise.resolve(identity)
						: Promise.race([
							createIdentity(),
							new Promise((resolve, reject) => {
								setTimeout(() => reject(new Error('Error creating identity')), 20000);
							}),
						]).then((newIdentity) => storeIdentity('did', newIdentity).then(() => newIdentity))
				)
				.then(async (identity) => {
					identityJSON = JSON.stringify(identity, null, 2);
					await createSelfSignedCredential(identity, SchemaNames.CONTACT_DETAILS, {
						UserContacts: {
							Email: 'email@company.com',
							Phone: '111-222-3333',
						},
					})
				})
				.then((result) => {
					const [addressCredential, personalDataCredential, contactDetailsCredential] = result;

					storedCredentials.update((prev) =>
						[...prev, ...[addressCredential, personalDataCredential, contactDetailsCredential]].map((credential) => ({
							credentialDocument: { ...credential },
							metaInformation: { issuer: 'selv' },
							id: generateRandomId()
						}))
					);

					isCreatingCredentials = false;
					// hasSetupAccount.set(true);
					// goto('onboarding/home');
				})
				.catch((err) => {
					error.set('Error creating identity. Please try again.');
					isCreatingCredentials = false;
				});
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
	<h1>Welcome into mobile app!</h1>
	<h3>{identityJSON}</h3>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
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
