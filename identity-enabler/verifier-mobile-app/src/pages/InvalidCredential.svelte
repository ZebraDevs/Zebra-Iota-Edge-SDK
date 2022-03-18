<script lang="ts">
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import Button from "../components/Button.svelte";
    import { playAudio } from "../lib/ui/helpers";
    import type { IInvalidCredentialPageState } from "../models/types/IInvalidCredentialPageState";
    import { Page } from "@zebra-iota-edge-sdk/common";

    const PLAY_DELAY = 500;
    const state: IInvalidCredentialPageState | null = window.history?.state;

    onMount(() => {
        // We wait a little bit in order not to overlap the different aural feedback
        setTimeout(async () => playAudio("invalid"), PLAY_DELAY);
    });

    function onDone() {
        navigate("/home");
    }
</script>

<Page theme="dark">
    <section slot="content">
        <i class="icon-cross" />
        <p>{state?.message ?? "Invalid credential"}</p>
        {#if state?.detail}
            <small>{state.detail}</small>
        {/if}
    </section>
    <svelte:fragment slot="footer">
        <Button label="Done" onClick={onDone} />
    </svelte:fragment>
</Page>

<style>
    section {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 1.5rem;
        text-align: center;
    }

    section > p {
        font-weight: 600;
        font-size: 1.1em;
        text-transform: uppercase;
    }

    section > small {
        color: var(--black-20);
    }

    .icon-cross {
        font-size: 64px;
    }
</style>
