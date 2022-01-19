<script lang="ts">
    import { Plugins } from "@capacitor/core";
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { fly } from "svelte/transition";
    import { modalStatus, credentials } from "../lib/store";
    import Button from "../components/Button.svelte";
    import ObjectList from "../components/ObjectList.svelte";
    import CredentialHeader from "../components/CredentialHeader.svelte";
    import { flattenCredential } from "../lib/ui/helpers";

    const { App } = Plugins;
    let navigated = false;

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
        if (navigated) {
            return;
        }

        credentials.update(creds => {
            creds[vp.verifiableCredential.type[1]] = vp;
            return creds;
        });
        navigate("/home");
        navigated = true;
    }

    function goBack() {
        if (navigated) {
            return;
        }

        if ($modalStatus.active) {
            modalStatus.set({ active: false, type: null });
            return;
        }

        window.history.back();
        navigated = true;
    }

    function onClickDev() {
        navigate("/tutorial");
    }
</script>

<main transition:fly={{ x: 500, duration: 500 }}>
    <div class="header-wrapper">
        <div class="options-wrapper">
            <i on:click={goBack} class="icon-chevron" />
            <i on:click={onClickDev} class="icon-code" />
        </div>
        <header>
            <CredentialHeader credential={vp.verifiableCredential} />
        </header>
    </div>
    <section>
        <ObjectList entries={flattenCredential(vp.verifiableCredential)} />
    </section>
    <footer>
        {#if save}
            <Button label="Save credential" onClick={onSaveCredential} />
        {:else}
            <Button label="Share credential" onClick={share}>
                <i class="icon-share" />
            </Button>
        {/if}
    </footer>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        position: relative;
        height: 100%;
    }

    header {
        margin-bottom: 5vh;
    }

    .header-wrapper {
        text-align: center;
        padding-bottom: 0.5rem;
        background-color: #aee693;
    }

    header {
        margin-left: auto;
        margin-right: auto;
        z-index: 1;
        height: fit-content;
        margin-bottom: 0;
    }

    section {
        margin: 0 7vw;
        z-index: 0;
    }

    footer {
        position: fixed;
        width: 100%;
        bottom: 0;
        z-index: 1;
    }

    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 3.5vh 3.5vh 0 3.5vh;
        z-index: 3;
    }
</style>
