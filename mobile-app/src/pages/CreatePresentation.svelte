<script>
	import { Link } from "svelte-routing";
  import { onMount } from 'svelte';
	import bwipjs from 'bwip-js';
	import { ServiceFactory } from '../factories/serviceFactory';
	import { IdentityService } from '../services/identityService';
	import { error } from '../lib/store';
	import Spinner from '../components/Spinner.svelte';

	let presentationJSON = '';
	let loading = true;

	async function createMatrix(content) {
		try {
			// The return value is the canvas element
			bwipjs.toCanvas('presentation', {
					bcid: 'datamatrix',
					text: content,
					scale: 3
			});
		} catch (e) {
				console.error(e)
		}
	}

	onMount(() => {
		setTimeout(async () => {
			const identityService = ServiceFactory.get('identity');

			error.set(null);

			try {
				const storedIdentity = await identityService.retrieveIdentity();
				const storedCredential = await identityService.retrieveCredential('credentialId');

				console.log(777, storedIdentity, storedCredential)

				const verifiablePresentation = await identityService.createVerifiablePresentation(storedIdentity, storedCredential.credentialDocument);
				console.log(888, verifiablePresentation)

				presentationJSON = JSON.stringify(verifiablePresentation, null, 2);

				await createMatrix(presentationJSON);

				loading = false;
			} catch (err) {
				error.set('Error creating identity. Please try again.');
				loading = false;
			}

		}, 500);
  });
</script>

<main>
	<Link to="/">Back</Link>
	<h1>Presentation</h1>
	{#if loading}
		<Spinner />
	<!-- {:else}
		<h3>{presentationJSON}</h3> -->
	{/if}
	<canvas id="presentation"></canvas>

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
		font-size: 2.5em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
