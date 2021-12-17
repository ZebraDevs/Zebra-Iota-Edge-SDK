<script>
    import Markdown from "../components/Markdown.svelte";

    export let showJSON = Boolean;
    export let code = "";

    function onClose() {
        showJSON = false;
    }
</script>

<main>
    <div class="header-wrapper">
        <span>VERIFIABLE PRESENTATION</span>
        <i on:click={onClose} class="icon-cross" />
    </div>
    <section>
        <div class="highlightjs-component">
            <Markdown markdown={code} language="json" />
        </div>
    </section>
</main>

<style>
    main {
        height: 100%;
        width: 100%;
        background: white;
        display: flex;
        flex-direction: column;
        position: absolute;
        z-index: 10;
    }

    .header-wrapper {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        background: black;
        padding: 4vh 17.7vh;
        position: relative;
    }

    .header-wrapper > span {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 500;
        font-size: 2vh;
        line-height: 2.3vh;
        color: #fff;
        white-space: nowrap;
    }

    i.icon-cross {
        position: absolute;
        right: 3.4vh;
        color: white;
    }

    section {
        background: white;
    }

    .highlightjs-component {
        overflow-wrap: break-word;
        word-wrap: break-word;
        overflow-x: auto;
        background: #eeeeee;
        border-radius: 4px;
        padding: 0 1.15vh;
        margin: 2.4vh 2.3vh;
    }
</style>
