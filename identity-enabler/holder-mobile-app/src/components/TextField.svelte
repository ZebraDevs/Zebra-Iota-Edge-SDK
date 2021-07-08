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
        margin: 1.7vh 0 16.7vh 0;
        width: 44.4vh;
        height: 7.48vh;
        border: 1px solid #E2E2E2;
        box-sizing: border-box;
    }

    input:focus {
        outline: none !important;
        border: 1px solid #59c5ff;;
    }
</style>

<input {disabled} type="text" {placeholder} bind:value />
