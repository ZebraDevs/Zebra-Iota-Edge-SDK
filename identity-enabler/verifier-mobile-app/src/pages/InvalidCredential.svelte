<script lang="ts">
    import { Plugins } from "@capacitor/core";
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import Button from "../components/Button.svelte";
    import PageTransition from "../components/PageTransition.svelte";
    import { playAudio } from "../lib/ui/helpers";
    import type { IInvalidCredentialPageState } from "../models/types/IInvalidCredentialPageState";

    const PLAY_DELAY = 500;
    const state: IInvalidCredentialPageState | null = window.history?.state;
    const { App } = Plugins;
    let backwards = false;

    onMount(() => App.addListener("backButton", goBack).remove);
    onMount(() => {
        // We wait a little bit in order not to overlap the different aural feedback
        setTimeout(async () => await playAudio("invalid"), PLAY_DELAY);
    });

    function onDone() {
        navigate("/home");
    }

    function goBack() {
        backwards = true;
        window.history.back();
    }
</script>

<PageTransition {backwards}>
    <main>
        <section>
            <i class="icon-cross" />
            <p>{state?.message ?? "Invalid credential"}</p>
            {#if state?.detail}
                <small>{state.detail}</small>
            {/if}
        </section>
        <footer>
            <Button label="Done" onClick={onDone} />
        </footer>
    </main>
</PageTransition>

<style>
    main {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        height: 100%;
        width: 100%;
        background: black;
    }

    section {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    section > p {
        position: relative;
        justify-content: center;
        align-items: center;
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 1.9vh;
        line-height: 3.4vh;
        color: #fff;
        text-transform: uppercase;
    }

    section > small {
        color: #bbb;
    }

    .icon-cross {
        font-size: 64px;
    }

    footer {
        position: fixed;
        width: 100%;
        bottom: 0;
        z-index: 1;
    }
</style>
