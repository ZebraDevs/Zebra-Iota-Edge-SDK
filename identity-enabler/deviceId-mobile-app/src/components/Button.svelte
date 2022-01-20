<script>
    import { showAlert } from "../lib/ui/helpers";
    import Spinner from "./Spinner.svelte";

    export let label;
    export let onClick;
    export let disabled = false;
    export let loading = false;
    let handling = false;

    /**
     * Disable button while listener is being executed to prevent duplicated events.
     * @param args The event arguments to pass to the listener.
     */
    async function clickHandler(...args) {
        handling = true;
        try {
            await onClick(...args);
        } catch (e) {
            console.error(e);
            await showAlert("Error", e.message);
        }
        handling = false;
    }
</script>

<button
    style={$$props.style}
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
        color: black;
        background-color: #78d64b;
        user-select: none;
    }

    button.disabled {
        background-color: #c9efb7;
    }

    button :global(img) {
        margin-right: 12px;
        width: 3vh;
        height: 3vh;
    }
</style>
