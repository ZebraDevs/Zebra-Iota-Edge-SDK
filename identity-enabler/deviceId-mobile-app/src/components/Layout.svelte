<script lang="ts">
    import { fly } from "svelte/transition";
</script>

<div class="layout-wrapper" in:fly={{ x: 500, duration: 500 }}>
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
    .layout-wrapper {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .layout-wrapper > main {
        padding: 1.5rem;
    }

    main {
        flex: 1;
        overflow-y: auto;
    }
</style>
