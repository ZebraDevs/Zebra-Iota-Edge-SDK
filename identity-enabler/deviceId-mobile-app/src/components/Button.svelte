<script lang="ts">
    import Spinner from "./Spinner.svelte";

    export let label: string = "";
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
        font-size: 0.85em;
        font-weight: 700;
        cursor: pointer;
        margin: 0;
        color: black;
        background-color: #78d64b;
        border: none;
    }

    button.disabled {
        pointer-events: none;
        background-color: #c9efb7;
    }

    button :global(img) {
        margin-right: 12px;
        width: 3vh;
        height: 3vh;
    }
</style>
