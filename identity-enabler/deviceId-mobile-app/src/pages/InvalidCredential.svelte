<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import Button from "../components/Button.svelte";
    import { playAudio } from "../lib/ui/helpers";
    import type { IInvalidCredentialPageState } from "../models/types/IInvalidCredentialPageState";

    const PLAY_DELAY = 400;
    const state: IInvalidCredentialPageState | null = window.history?.state;

    onMount(async () => {
        // We wait a little bit in order not to overlap the different aural feedback
        const delay = state?.scanSoundStart ? PLAY_DELAY - (Date.now() - state?.scanSoundStart) : PLAY_DELAY;
        if (delay < 0) {
            await playAudio("invalid");
        } else {
            setTimeout(async () => playAudio("invalid"), delay);
        }
    });

    function onDone() {
        window.history.back();
    }
</script>

<main transition:fly={{ y: 200, duration: 500 }}>
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
        z-index: 2;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    section > p {
        z-index: 2;
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
        color: white;
    }

    footer {
        position: fixed;
        width: 100%;
        bottom: 0;
        z-index: 6;
    }
</style>
