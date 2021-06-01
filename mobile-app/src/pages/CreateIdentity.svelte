<script>
	import { Link } from "svelte-routing";
  import { onMount } from 'svelte';
	import { ServiceFactory } from '../factories/serviceFactory';
	import { IdentityService } from '../services/identityService';
	import { error } from '../lib/store';
	import Spinner from '../components/Spinner.svelte';

	let identityJSON = '';
	let loading = true;

	onMount(() => {
		setTimeout(async () => {
			const identityService = ServiceFactory.get('identity');

			error.set(null);

			try {
				const identity = await identityService.createIdentity();
				identityJSON = JSON.stringify(identity, null, 2);

				console.log(333, identity)

				await identityService.storeIdentity('did', identity);

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
	<h1>Identity</h1>
	{#if loading}
		<Spinner />
	{:else}
		<h3>{identityJSON}</h3>
	{/if}
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
