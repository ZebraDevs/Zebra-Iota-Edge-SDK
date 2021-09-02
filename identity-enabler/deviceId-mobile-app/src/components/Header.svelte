<script>
    export let text = '';
</script>

<style>
    .container {
        height: 22vh;
        width: 100%;
        padding: 0 8vw;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .logo {
        margin: 4.1vh 0;
        filter: invert(100%);
    }

    header > pre {
        font-family: 'Proxima Nova', sans-serif;
        font-weight: 700;
        font-size: 3.5vh;
        line-height: 4.4vh;
        margin-bottom: 0 !important;
        padding-bottom: 8.8vh;
        white-space: pre-line;
        text-align: center;
        color: #131f37;
    }
</style>

<div class="container">
    <img class="logo" src="../assets/logo.svg" alt="logo" />
    <header>
        <pre>{text}</pre>
    </header>
</div>
