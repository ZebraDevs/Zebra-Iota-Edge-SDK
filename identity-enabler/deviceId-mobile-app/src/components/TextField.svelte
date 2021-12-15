<script>
    export let value;
    export let placeholder;
    export let disabled;
</script>

<style>
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    input {
        font-size: 1.2em;
        border: 1px solid #E2E2E2;
        box-sizing: border-box;
    }

    input:focus {
        outline: none !important;
        border: 1px solid #59c5ff;;
    }
</style>

<input {disabled} type="text" {placeholder} bind:value />
