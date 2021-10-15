<script>
	import { Router, Route } from 'svelte-routing';
	import { onMount } from 'svelte';
	
	import Home from './pages/Home.svelte';
	import { ServiceFactory } from './factories/serviceFactory';
	import CreateIdentity from './pages/CreateIdentity.svelte';
	import CreateCredential from './pages/CreateCredential.svelte';
	import CreatePresentation from './pages/CreatePresentation.svelte';
	import Landing from './pages/Landing.svelte';
	import Name from './pages/Name.svelte';
	import Menu from './pages/Menu.svelte';
	import PresentationJSON from './pages/PresentationJSON.svelte';
	import DataMatrix from './pages/DataMatrix.svelte';
	import Credential from './pages/Credential.svelte';
	import DevInfo from './pages/DevInfo.svelte';
	import Content from './components/modal/Content.svelte';
	import Modal from './components/modal/Index.svelte';

	import { hasSetupAccount } from './lib/store';
	import Keychain from './lib/keychain';

	let url = window.location.pathname;
	let displayHome = false;

	onMount(async () => {
			if (!$hasSetupAccount) {
					return Keychain.clear();
			}

			const identityService = ServiceFactory.get('identity');
			const storedIdentity = await identityService.retrieveIdentity();

			if (storedIdentity) {
				console.log('Found identity', storedIdentity)
				displayHome = true;
			}
	});
</script>

<main>
	<Router url="{url}">
		
		<div>
			{#if !$hasSetupAccount}
				<Route path="/" component="{Landing}" />
			{:else if displayHome}
				<Route path="/" component="{Home}" />
			{/if}
			<Route path="/home" component="{Home}" />
			<Route path="/menu" component="{Menu}" />
			<Route path="/landing" component="{Landing}" />
			<Route path="/name" component="{Name}" />
			<Route path="/credential" component="{Credential}" />
			<Route path="/datamatrix" component="{DataMatrix}" />

			<Route path="/devinfo" component="{DevInfo}" />
			<Route path="/presentationjson" component="{PresentationJSON}" />
			
			<Route path="/createIdentity" component="{CreateIdentity}" />
			<Route path="/createCredential" component="{CreateCredential}" />
			<Route path="/createPresentation" component="{CreatePresentation}" />
		</div>
	</Router>
	<Modal>
		<Content />
	</Modal>
</main>

<style>
	main, div {
		height: 100%
	}
</style>