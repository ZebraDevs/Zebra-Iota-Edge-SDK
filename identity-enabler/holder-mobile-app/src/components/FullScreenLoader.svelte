<script lang="ts">
    import Spinner from "./Spinner.svelte";

    export let label: string;
</script>

<div class="loader-wrapper">
    <Spinner />
    <h3 class="loader-label">{label ?? "Loading..."}</h3>
</div>

<style>
    .loader-wrapper {
        position: absolute;
        background: var(--primary);
        height: 100%;
        width: 100%;
        z-index: 10;
        height: inherit;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .loader-label {
        letter-spacing: 0.05em;
        text-transform: uppercase;
        margin-top: 40px;
        color: white;
    }
</style>
