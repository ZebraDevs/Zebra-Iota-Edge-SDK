<script>
    import Spinner from "./Spinner.svelte";

    export let label;
    export let onClick;
    export let disabled = false;
    export let loading = false;
</script>

<button style={$$props.style} class:disabled on:click={onClick}>
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
        background-color: #1e22aa;
    }

    button.disabled {
        pointer-events: none;
        opacity: 0.5;
    }

    button :global(img) {
        margin-right: 12px;
        width: 3vh;
        height: 3vh;
    }
</style>
