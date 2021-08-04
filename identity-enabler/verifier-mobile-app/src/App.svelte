<script>
	import { Router, Route } from 'svelte-routing';
	
	import Home from './pages/Home.svelte';
	import DevInfo from './pages/DevInfo.svelte';
	import Scan from './pages/Scan.svelte';

	let url = window.location.pathname;
</script>

<main>
	<Router url="{url}">
		
		<div>
			<Route path="/" component="{Home}" />

			<Route path="/home" component="{Home}" />
			<Route path="/devinfo" component="{DevInfo}" />
			<Route route="/scan" component="{Scan}" />
		</div>
	</Router>
</main>

<style>
	main, div {
		height: 100%
	}
</style>
