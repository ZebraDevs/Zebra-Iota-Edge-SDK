<script>
	import { Link, Router, Route } from 'svelte-routing';
	import { onMount } from 'svelte';
	import Home from './pages/Home.svelte';
	import { ServiceFactory } from './factories/serviceFactory';
	import CreateIdentity from './pages/CreateIdentity.svelte';
	import CreateCredential from './pages/CreateCredential.svelte';
	import CreatePresentation from './pages/CreatePresentation.svelte';
	import VerifyPresentation from './pages/VerifyPresentation.svelte';
	import Splash from './pages/Splash.svelte';
	import Landing from './pages/Landing.svelte';
	import Name from './pages/Name.svelte';
	import Menu from './pages/Menu.svelte';
	import DataMatrix from './pages/DataMatrix.svelte';
	import Credential from './pages/Credential.svelte';


	import { SPLASH_SCREEN_TIMEOUT } from './config';
	import { hasSetupAccount } from './lib/store';
	import Keychain from './lib/keychain';
	import { IdentityService } from './services/identityService';

	let url = window.location.pathname;
	let displayHome = false;
	let splash = true;

	onMount(async () => {
			setTimeout(async () => {
				splash = false;
			}, SPLASH_SCREEN_TIMEOUT);

			if (!$hasSetupAccount) {
					return Keychain.clear();
			}

			const identityService = ServiceFactory.get('identity');
			const storedIdentity = await identityService.retrieveIdentity();

			if (storedIdentity) {
				console.log('Found identity', storedIdentity)
				displayHome = true;
			}

			// retrieveCredentials($listOfCredentials.values).then((credentials) => {
			// 		displayHome = true;
			// 		storedCredentials.set(credentials);
			// });
	});
</script>

<main>
	<Router url="{url}">
		<div>
			{#if splash}
				<Route path="/" component="{Splash}" />
			{:else}
				{#if !$hasSetupAccount}
					<Route path="/" component="{Landing}" />
				{:else if displayHome}
					<Route path="/" component="{Home}" />
				{/if}
			{/if}
			<Route path="/home" component="{Home}" />
			<Route path="/menu" component="{Menu}" />
			<Route path="/splash" component="{Splash}" />
			<Route path="/landing" component="{Landing}" />
			<Route path="/name" component="{Name}" />
			<Route path="/credential" component="{Credential}" />
			<Route path="/datamatrix" component="{DataMatrix}" />
			
			<Route path="/createIdentity" component="{CreateIdentity}" />
			<Route path="/createCredential" component="{CreateCredential}" />
			<Route path="/createPresentation" component="{CreatePresentation}" />
			<Route path="/verifyPresentation" component="{VerifyPresentation}" />
		</div>
	</Router>
</main>

<style>
	main, div {
		height: 100%
	}
</style>
