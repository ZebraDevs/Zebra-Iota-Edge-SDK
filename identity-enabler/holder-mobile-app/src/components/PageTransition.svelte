<script lang="ts">
    import { flyOver } from "../lib/ui/helpers";

    export let backwards = false;

    $: flyParams = {
        x: backwards ? window.innerWidth : -window.innerWidth,
        duration: 400,
        opacity: 1
    };
</script>

<div out:flyOver={flyParams}>
    <slot />
</div>

<style>
    div {
        z-index: 5;
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: white;
    }
</style>
