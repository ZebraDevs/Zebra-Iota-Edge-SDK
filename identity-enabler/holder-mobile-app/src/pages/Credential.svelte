<script lang="ts">
    import Button from "../components/Button.svelte";
    import ObjectList from "../components/ObjectList.svelte";
    import { modalStatus } from "../lib/store";
    import { flattenCredential, showAlert } from "../lib/ui/helpers";
    import { onMount } from "svelte";
    import { Plugins } from "@capacitor/core";
    import CredentialHeader from "../components/CredentialHeader.svelte";
    import { navigate } from "svelte-routing";
    import { Page } from "@zebra-iota-edge-sdk/common";

    const { App } = Plugins;
    const credential = window.history.state.credential;

    async function share() {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity to share a Credential");
            return;
        }

        modalStatus.set({
            active: true,
            type: "share",
            props: { credential }
        });
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

    onMount(() => App.addListener("backButton", goBack).remove);
</script>

<Page>
    <div slot="header" class="options-wrapper">
        <i on:click={goBack} class="icon-chevron" />
        <CredentialHeader {credential} />
        <i on:click={onClickDev} class="icon-code" />
    </div>
    <section slot="content">
        <ObjectList entries={flattenCredential(credential)} />
    </section>
    <svelte:fragment slot="footer">
        <Button label="Share credential" onClick={share}>
            <i class="icon-share" />
        </Button>
    </svelte:fragment>
</Page>

<style>
    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .options-wrapper,
    section {
        padding: 1.5rem;
    }
</style>
