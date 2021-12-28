<script lang="ts">
    import { onMount } from "svelte";
    import Markdown from "../components/Markdown.svelte";
    import { getMarkdownContent } from "../lib/helpers";
    import { TUTORIAL_BASE_URL } from "../config";
    import { loadingScreen } from "../lib/store";
    import { showAlert } from "../lib/ui/helpers";

    export let page = "";
    export let showTutorial: boolean;

    let code = "";

    onMount(async () => {
        loadingScreen.set("Loading Tutorial...");

        try {
            code = await getMarkdownContent(`${TUTORIAL_BASE_URL}/${page}.md`);
        } catch (err) {
            console.error(err);
            await showAlert("Error", "Error fetching tutorial");
        }

        loadingScreen.set();
    });

    function onClose() {
        showTutorial = false;
    }
</script>

<main>
    <div class="header-wrapper">
        <span>{page.toUpperCase()}</span>
        <i on:click={onClose} class="icon-cross" />
    </div>
    <section>
        <div class="highlightjs-component">
            <Markdown markdown={code} language="javascript" />
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
        border-radius: 4px;
        background-color: #eee;
        padding: 1rem;
        margin: 1rem;
    }
</style>
