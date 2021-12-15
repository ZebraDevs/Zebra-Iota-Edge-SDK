<script>
    import { Link } from "svelte-routing";
</script>

<main>
    <h1>Home</h1>
    <div class="controls">
        <button><Link to="createIdentity">Create Identity</Link></button>
        <button><Link to="createCredential">Create Credential</Link></button>
        <button><Link to="createPresentation">Create Presentation</Link></button>
    </div>
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
