<script lang="ts">
    import { Plugins } from "@capacitor/core";
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { modalStatus, credentials } from "../lib/store";
    import Button from "../components/Button.svelte";
    import ObjectList from "../components/ObjectList.svelte";
    import CredentialHeader from "../components/CredentialHeader.svelte";
    import { flattenCredential } from "../lib/ui/helpers";
    import Layout from "../components/Layout.svelte";

    const { App } = Plugins;

    const vp = window.history.state.vp;
    const save = window?.history?.state?.save;

    onMount(() => App.addListener("backButton", goBack).remove);

    function share() {
        modalStatus.set({
            active: true,
            type: "share",
            props: { vp }
        });
    }

    async function onSaveCredential() {
        credentials.update(creds => {
            creds[vp.verifiableCredential.type[1]] = vp;
            return creds;
        });
        navigate("/home");
    }

    function goBack() {
        if ($modalStatus.active) {
            modalStatus.set({ active: false, type: null });
            return;
        }

        window.history.back();
    }

    function onClickDev() {
        navigate("/tutorial");
    }
</script>

<Layout>
    <div slot="header" class="options-wrapper">
        <i on:click={goBack} class="icon-chevron" />
        <CredentialHeader credential={vp.verifiableCredential} />
        <i on:click={onClickDev} class="icon-code" />
    </div>

    <section slot="content">
        <ObjectList entries={flattenCredential(vp.verifiableCredential)} />
    </section>

    <svelte:fragment slot="footer">
        {#if save}
            <Button label="Save credential" onClick={onSaveCredential} />
        {:else}
            <Button label="Share credential" onClick={share}>
                <i class="icon-share" />
            </Button>
        {/if}
    </svelte:fragment>
</Layout>

<style>
    .options-wrapper {
        background-color: var(--primary-60);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .options-wrapper,
    section {
        padding: 1.5rem;
    }
</style>
