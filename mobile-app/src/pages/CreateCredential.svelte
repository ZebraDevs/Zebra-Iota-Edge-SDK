<script>
	import { Link } from "svelte-routing";
  import { onMount } from 'svelte';
	import { ServiceFactory } from '../factories/serviceFactory';
	import { IdentityService } from '../services/identityService';
	import { error, account, storedCredentials } from '../lib/store';

	let credentialJSON = '';
	let loading = false;


	onMount(() => {
		setTimeout(async () => {
			const identityService = ServiceFactory.get('identity');

			error.set(null);
			// account.set({ name: 'empty' });

			try {
				loading = true;
				const storedIdentity = await identityService.retrieveIdentity();

				const credential = await identityService.createSelfSignedCredential(storedIdentity, SchemaNames.CONTACT_DETAILS, {
					UserContacts: {
						Email: 'email@company.com',
						Phone: '111-222-3333',
					},
				});
				console.log(444, credential)

				console.log(555, storedIdentity)

				// const credentialId = generateRandomId();
				
				storedCredentials.update((prev) =>
					[...prev, credential].map((cred) => ({
						credentialDocument: { ...cred },
						metaInformation: { issuer: 'iota' },
						id: 'credentialId'
					}))
				);

				loading = false;
			} catch (err) {
				error.set('Error creating identity. Please try again.');
				loading = false;
			}

		}, 500);
  	});

	let url = window.location.pathname;
</script>

<main>
	<Link to="/">Back</Link>
	<p>{url}</p>
	<h1>Create Credential</h1>
	<h3>{credentialJSON}</h3>
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
