<script>
    import { navigate } from "svelte-routing";
    import { fly } from "svelte/transition";
    import Button from "../components/Button.svelte";
    import { showAlert } from "../lib/ui/helpers";

    async function scan() {
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity to verify a Device Credential");
            return;
        }

        navigate("/scan");
    }

    function onClickDev() {
        navigate("/tutorial");
    }
</script>

<main transition:fly={{ x: 500, duration: 500 }}>
    <header>
        <i on:click|once={() => window.history.back()} class="icon-chevron" />
        <p>Request Device DID credential</p>
        <i on:click={onClickDev} class="icon-code" />
    </header>

    <section>
        <p class="subheader">Add Device DID credential</p>
        <p class="description">Scan the Device Credential DataMatrix code generated in the Holder app</p>
    </section>

    <footer>
        <Button style="height: 64px; width: 64px; border-radius: 50%;" onClick={scan}>
            <i class="icon-scan" />
        </Button>
    </footer>
</main>

<style>
    main {
        height: 100%;
        flex-direction: column;
        display: flex;
        justify-content: space-between;
    }

    section {
        padding: 0 2rem;
        text-align: center;
    }

    header {
        background-color: #aee693;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 72px;
        padding: 0 2.6vh;
    }

    header > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 1.2em;
        margin: 0;
        z-index: 1;
    }

    p.subheader {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 700;
        font-size: 1.6em;
        margin-bottom: 1.75vh;
    }

    p.description {
        font-family: "Proxima Nova", sans-serif;
        font-size: 0.9em;
        color: #6f7a8d;
    }

    footer {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1.5rem;
    }
</style>
