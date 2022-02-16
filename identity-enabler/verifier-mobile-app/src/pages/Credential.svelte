<script lang="ts">
    import { Plugins } from "@capacitor/core";
    import { credentials } from "../lib/store";
    import Button from "../components/Button.svelte";
    import ObjectList from "../components/ObjectList.svelte";
    import { isExpired } from "../lib/helpers";
    import { navigate } from "svelte-routing";
    import CredentialHeader from "../components/CredentialHeader.svelte";
    import { flattenCredential } from "../lib/ui/helpers";
    import { Page } from "@zebra-iota-edge-sdk/common";

    const { Modals } = Plugins;

    const credential = window.history.state.credential;
    const expired = isExpired(credential);

    function onDone() {
        navigate("/home");
    }

    async function onDelete() {
        const confirmRet = await Modals.confirm({
            title: "Delete credential",
            message: "Are you sure you want to delete the credential?"
        });
        if (confirmRet.value) {
            credentials.update(current => {
                current[credential.type[1]] = null;
                return current;
            });
            // ensure impossible to navigate back to a deleted credential page
            navigate("/home", { replace: true });
        }
    }

    function onClickDev() {
        navigate("/tutorial");
    }
</script>

<Page>
    <div slot="header" class="options-wrapper" class:expired>
        <i on:click={onDelete} class="icon-remove" />
        <CredentialHeader {credential} />
        <i on:click={onClickDev} class="icon-code" />
    </div>

    <section slot="content">
        <ObjectList entries={flattenCredential(credential)} />
    </section>

    <svelte:fragment slot="footer">
        <Button label="Done" onClick={onDone} />
    </svelte:fragment>
</Page>

<style>
    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .options-wrapper.expired {
        background-color: black;
    }

    .options-wrapper,
    section {
        padding: 1.5rem;
    }
</style>
