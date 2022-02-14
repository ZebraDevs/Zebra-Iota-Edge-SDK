<script lang="ts">
    import Layout from "../components/Layout.svelte";
    import { navigate } from "svelte-routing";
    import Button from "../components/Button.svelte";
    import { showAlert } from "../lib/ui/helpers";

    async function scan() {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity to verify a Device Credential");
            return;
        }
        navigate("/scan");
    }

    function onClickDev() {
        navigate("/tutorial");
    }

    function goBack() {
        window.history.back();
    }
</script>

<Layout>
    <div slot="header" class="options-wrapper">
        <i on:click={goBack} class="icon-chevron" />
        <h2>Request Device DID credential</h2>
        <i on:click={onClickDev} class="icon-code" />
    </div>

    <section slot="content">
        <h1>Add Device DID credential</h1>
        <p class="description">Scan the Device Credential DataMatrix code generated in the Holder app</p>
    </section>

    <div slot="footer">
        <Button style="height: 64px; width: 64px; border-radius: 50%;" onClick={scan}>
            <i class="icon-scan" />
        </Button>
    </div>
</Layout>

<style>
    .options-wrapper {
        background-color: var(--primary-60);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 1.5rem;
    }

    h2 {
        margin: 0 0.5rem;
        align-self: center;
    }

    section {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 1.5rem;
        text-align: center;
    }

    p.description {
        font-family: "Proxima Nova", sans-serif;
        font-size: 0.9em;
        color: #6f7a8d;
    }

    div[slot="footer"] {
        display: flex;
        justify-content: center;
        padding: 1.5rem;
    }
</style>
