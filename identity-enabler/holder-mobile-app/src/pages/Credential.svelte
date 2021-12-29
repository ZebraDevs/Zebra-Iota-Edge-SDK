<script lang="ts">
    import { fly } from "svelte/transition";
    import Button from "../components/Button.svelte";
    import ObjectList from "../components/ObjectList.svelte";
    import { modalStatus } from "../lib/store";
    import { showAlert } from "../lib/ui/helpers";
    import { onMount } from "svelte";
    import { Plugins } from "@capacitor/core";
    import CredentialHeader from "../components/CredentialHeader.svelte";
    import { navigate } from "svelte-routing";

    const { App } = Plugins;
    const credential = window.history.state.credential;

    async function share() {
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

<main transition:fly={{ x: 500, duration: 500 }}>
    <div class="header-wrapper">
        <div class="options-wrapper">
            <i on:click={goBack} class="icon-chevron" />
            <i on:click={onClickDev} class="icon-code" />
        </div>
        <header>
            <CredentialHeader {credential} />
        </header>
    </div>
    <section>
        <ObjectList object={credential.credentialSubject} />
    </section>
    <footer>
        <Button label="Share credential" onClick={share}>
            <i class="icon-share" />
        </Button>
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
        background-color: #00a7ff;
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
    }

    i.icon-share {
        margin-right: 0.6rem;
    }
</style>
