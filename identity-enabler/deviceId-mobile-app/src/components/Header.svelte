<script>
    export let text = "";
</script>

<div class="container">
    <div class="logo">
        <i class="icon-zebra" />
    </div>

    <header>
        <pre>{text}</pre>
    </header>
</div>

<style>
    .container {
        padding: 0 8vw;
    }

    .icon-zebra {
        color: black;
        font-size: 110px;
    }

    .logo {
        margin: 20px auto;
        text-align: center;
    }

    header > pre {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 700;
        font-size: 1.5em;
        line-height: 1.2em;
        margin: 0 !important;
        white-space: pre-wrap;
        text-align: center;
        color: #131f37;
    }
</style>
