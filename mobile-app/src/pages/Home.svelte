<script>
	import { Link } from 'svelte-routing';
</script>

<main>
	<h1>Home</h1>
		<button><Link to="createIdentity">CreateIdentity</Link></button>
		<button><Link to="createCredential">CreateCredential</Link></button>
		<button><Link to="createPresentation">CreatePresentation</Link></button>
		<button><Link to="verifyPresentation">VerifyPresentation</Link></button>
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
