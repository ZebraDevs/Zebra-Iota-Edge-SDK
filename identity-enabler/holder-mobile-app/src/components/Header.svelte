<script>
    export let text = "";
</script>

<div class="container">
    <div class="logo">
        <img src="../assets/logo.svg" alt="logo" />
    </div>

    <header>
        <pre>{text}</pre>
    </header>
</div>

<style>
    .container {
        padding: 0 8vw;
    }

    .logo {
        margin: 40px auto;
        filter: invert(100%);
        width: 56.26px;
        height: 63px;
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
