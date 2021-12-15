<script lang="ts">
    import Spinner from './Spinner.svelte';

    export let label: string | undefined = undefined;
    export let onClick;
    export let disabled = false;
    export let loading = false;
</script>

<style>
    button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 3em;
        font-size: 4vw;
        font-weight: 700;
        cursor: pointer;
        margin: 0;
        color: white;
        background-color: #00A7FF;
    }

    button.disabled {
        pointer-events: none;
        background-color: #84d4ff;
    }

    button :global(img) {
        margin-right: 12px;
        width: 3vh;
        height: 3vh;
    }
</style>

<button style={$$props.style} class:disabled on:click="{onClick}">
    {#if loading}
        <Spinner />
    {:else}
        <slot></slot>
        {#if label}
            {label}
        {/if}
    {/if}
</button>
