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
        height: 22vh;
        width: 100%;
        padding: 0 8vw;
    }

    .logo {
        text-align: center;
        margin: 40px auto;
        filter: invert(100%);
        width: 56.26px;
        height: 63px;
    }

    header > pre {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 700;
        font-size: 3.5vh;
        line-height: 4.4vh;
        margin: 0 !important;
        padding-top: 2.5vh;
        white-space: pre-wrap;
        text-align: center;
        color: #131f37;
    }
</style>
