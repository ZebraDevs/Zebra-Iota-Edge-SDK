<script lang="ts">
    export let text = "";
</script>

<div class="container">
    <i class="icon-zebra" />

    <h2>{text}</h2>
</div>

<style>
    .container {
        padding: 0 2rem;
        text-align: center;
    }

    .icon-zebra {
        color: black;
        font-size: 110px;
    }

    h2 {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 700;
        font-size: 1.5em;
        line-height: 1.2em;
        margin: 0;
        color: #131f37;
    }
</style>
