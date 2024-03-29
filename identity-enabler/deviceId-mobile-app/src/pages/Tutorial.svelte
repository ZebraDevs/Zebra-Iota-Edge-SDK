<script lang="ts">
    import { onMount } from "svelte";
    import Markdown from "../components/Markdown.svelte";
    import { getMarkdownContent } from "../lib/helpers";
    import { TUTORIAL_URL } from "../config";
    import { loadingScreen } from "../lib/store";
    import { showAlert } from "../lib/ui/helpers";

    let markdown = "";
    let title = "";

    onMount(async () => {
        loadingScreen.set("Loading...");
        try {
            const tutorialMd: string = await getMarkdownContent(TUTORIAL_URL);
            const endOfTitleIdx = tutorialMd.indexOf("\n");
            title = tutorialMd.substring(2, endOfTitleIdx);
            markdown = tutorialMd.substring(endOfTitleIdx + 1);
        } catch (err) {
            await showAlert("Error", `Error loading tutorial: ${err.message}`);
        }
        loadingScreen.set();
    });
</script>

<main>
    <div class="header-wrapper">
        <i on:click|once={() => window.history.back()} class="side icon-chevron" />
        <header>{title}</header>
        <div class="side" />
    </div>
    <section>
        <div class="highlightjs-component">
            <Markdown {markdown} language="javascript" />
        </div>
    </section>
</main>

<style>
    main {
        min-height: 100%;
        width: 100%;
    }

    .header-wrapper {
        position: sticky;
        top: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: black;
        padding: 1.2rem;
    }

    .icon-chevron {
        color: white;
    }

    .header-wrapper > .side {
        flex: 1;
    }

    header {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 700;
        font-size: 1em;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #fff;
    }

    .highlightjs-component {
        overflow-wrap: break-word;
        word-wrap: break-word;
        overflow-x: auto;
        border-radius: 4px;
        background-color: #eee;
        padding: 1rem;
    }
</style>
