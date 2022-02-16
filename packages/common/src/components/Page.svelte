<script lang="ts">
    import { fly } from "svelte/transition";

    export let theme: "light" | "dark" = "light";
</script>

<div class="page-wrapper {theme}" in:fly={{ x: 500, duration: 500 }}>
    {#if $$slots.header}
        <header>
            <slot name="header" />
        </header>
    {/if}
    <main>
        <slot name="content" />
    </main>
    {#if $$slots.footer}
        <footer>
            <slot name="footer" />
        </footer>
    {/if}
</div>

<style>
    .page-wrapper {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    main {
        flex: 1;
        overflow-y: auto;
    }
</style>
