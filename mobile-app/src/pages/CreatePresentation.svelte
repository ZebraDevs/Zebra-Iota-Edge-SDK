<script>
	import { Link } from "svelte-routing";
  import { onMount } from 'svelte';
	import { ServiceFactory } from '../factories/serviceFactory';
	import { IdentityService } from '../services/identityService';
	import { error, account } from '../lib/store';

	let presentationJSON = '';
	let loading = false;


	onMount(() => {
		setTimeout(async () => {
			const identityService = ServiceFactory.get('identity');

			error.set(null);
			// account.set({ name: 'empty' });

			try {
				loading = true;

				const storedIdentity = await identityService.retrieveIdentity();
				const storedCredential = await identityService.retrieveCredential('credentialId');

				console.log(777, storedIdentity, storedCredential)

				const verifiablePresentation = await identityService.createVerifiablePresentation(storedIdentity, storedCredential);
				console.log(888, verifiablePresentation)

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
	<h1>Create Presentation</h1>
	<h3>{presentationJSON}</h3>
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
