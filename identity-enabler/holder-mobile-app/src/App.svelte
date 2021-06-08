<script>
	import { Link, Router, Route } from 'svelte-routing';
	import Home from './pages/Home.svelte';
	import CreateIdentity from './pages/CreateIdentity.svelte';
	import CreateCredential from './pages/CreateCredential.svelte';
	import CreatePresentation from './pages/CreatePresentation.svelte';
	import VerifyPresentation from './pages/VerifyPresentation.svelte';
	import Splash from './pages/Splash.svelte';
	import Landing from './pages/Landing.svelte';
	import Name from './pages/Name.svelte';

	let url = window.location.pathname;
</script>

<main>
	<Router url="{url}">
		<!-- <nav>
			<Link to="/">Home</Link>
			<Link to="createIdentity">CreateIdentity</Link>
			<Link to="createCredential">CreateCredential</Link>
			<Link to="createPresentation">CreatePresentation</Link>
			<Link to="verifyPresentation">VerifyPresentation</Link>
		</nav> -->
		<div>
			<Route path="/" component="{Home}" />
			<Route path="/splash" component="{Splash}" />
			<Route path="/landing" component="{Landing}" />
			<Route path="/onboarding/name" component="{Name}" />

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