<script lang="ts">
    import Spinner from "./Spinner.svelte";

    export let label;
</script>

<main>
    <div class="loader-wrapper">
        <Spinner />
        <div class="loader-label">{label ?? "Loading..."}</div>
    </div>
</main>

<style>
    main {
        position: absolute;
        background: #aee693;
        height: 100%;
        width: 100%;
        z-index: 10;
    }
    .loader-wrapper {
        height: inherit;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .loader-label {
        font-family: "Proxima Nova", sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
        text-align: center;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: black;
        margin-top: 40px;
    }
</style>
