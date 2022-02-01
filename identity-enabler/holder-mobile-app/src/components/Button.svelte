<script lang="ts">
    import { showAlert } from "../lib/ui/helpers";
    import Spinner from "./Spinner.svelte";

    export let label: string | undefined = undefined;
    export let onClick;
    export let disabled = false;
    export let loading = false;
    let handling = false;

    /**
     * Disable button while listener is being executed to prevent duplicated events.
     * @param ev The event to pass to the listener.
     */
    async function clickHandler(ev: MouseEvent) {
        handling = true;
        try {
            await onClick(ev);
        } catch (err) {
            console.error(err);
            await showAlert("Error", err.message);
        }
        handling = false;
    }
</script>

<button
    style={$$props.style}
    type="button"
    class:disabled={disabled || handling}
    disabled={disabled || handling}
    on:click={clickHandler}
>
    {#if loading}
        <Spinner />
    {:else}
        <slot />
        {#if label}
            {label}
        {/if}
    {/if}
</button>

<style>
    button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 3.5em;
        font-size: 4vw;
        font-weight: 700;
        cursor: pointer;
        margin: 0;
        color: white;
        background-color: #00a7ff;
        user-select: none;
    }

    button.disabled {
        background-color: #99dcff;
    }

    button :global(img) {
        margin-right: 12px;
        width: 3vh;
        height: 3vh;
    }
</style>
