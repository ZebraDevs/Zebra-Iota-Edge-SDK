<script lang="ts">
    export let text = "";
</script>

<div class="container">
    <i class="icon-zebra" />

    <h1>{text}</h1>
</div>

<style>
    .container {
        padding: 0 2rem;
        text-align: center;
    }

    .icon-zebra {
        font-size: 110px;
    }

    h1 {
        margin: 0;
    }
</style>
