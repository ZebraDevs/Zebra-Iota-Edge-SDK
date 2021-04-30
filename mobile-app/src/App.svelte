<script>
  import { onMount } from 'svelte';
	import { getRandomUserData, goto, delay, generateRandomId } from './lib/helpers';
	import { createIdentity, storeIdentity, retrieveIdentity, createSelfSignedCredential } from './lib/identity';
  import { SchemaNames } from './lib/identity/schemas';
	import { error, hasSetupAccount, storedCredentials, account } from './lib/store';

	export let name = '';
	let identityJSON = 'no';
	let isCreatingCredentials = false;

	onMount(() => {
        name = "Identity";
				setTimeout(() => {
						error.set(null);

						account.set({ name: 'empty' });

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
								.then((identity) => {
								    identityJSON = JSON.stringify(identity);
										delay(2000);
										return getRandomUserData().then((data) =>
												Promise.all([
														createSelfSignedCredential(identity, SchemaNames.ADDRESS, {
																UserAddress: {
																		City: data.location.city,
																		State: data.location.state,
																		Country: data.location.country,
																		Postcode: data.location.postcode.toString(),
																		Street: data.location.street.number.toString(),
																		House: data.location.street.name,
																},
														}),
														createSelfSignedCredential(identity, SchemaNames.PERSONAL_DATA, {
																UserPersonalData: {
																		UserName: {
																				FirstName: firstName,
																				LastName: data.name.last,
																		},
																		UserDOB: {
																				Date: new Date(data.dob.date).toDateString(),
																		},
																		Birthplace: data.location.city,
																		Nationality: data.location.country,
																		IdentityCardNumber: data.id.value,
																		PassportNumber: Math.random().toString(36).substring(7).toUpperCase(),
																},
														}),
														createSelfSignedCredential(identity, SchemaNames.CONTACT_DETAILS, {
																UserContacts: {
																		Email: data.email,
																		Phone: data.phone,
																},
														}),
												])
										);
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
										hasSetupAccount.set(true);
										// goto('onboarding/home');
								})
								.catch((err) => {
										error.set('Error creating identity. Please try again.');
										isCreatingCredentials = false;
								});
						}, 500);
  });
</script>

<main>
	<h1>Welcome into mobile {name}!</h1>
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
