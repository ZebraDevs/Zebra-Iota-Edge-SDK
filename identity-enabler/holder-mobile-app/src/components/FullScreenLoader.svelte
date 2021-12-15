<script>
    import Spinner from "./Spinner.svelte";

    export let label;
</script>

<div class="loader-wrapper">
    <Spinner />
    <div class="loader-label">{label}</div>
</div>

<style>
    .loader-wrapper {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        row-gap: 40px;
        background: linear-gradient(90deg, #00ffff 0%, #0099ff 100%);
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
        color: #f8f8f8;
        margin-top: 40px;
    }
</style>
