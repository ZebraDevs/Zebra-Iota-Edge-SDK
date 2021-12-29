<script lang="ts">
    import { onMount } from "svelte";
    import Markdown from "../components/Markdown.svelte";
    import { getMarkdownContent } from "../lib/helpers";
    import { TUTORIAL_URL } from "../config";
    import { loadingScreen } from "../lib/store";
    import { showAlert } from "../lib/ui/helpers";

    let code = "";

    onMount(async () => {
        loadingScreen.set("Loading...");
        try {
            code = await getMarkdownContent(TUTORIAL_URL);
        } catch (err) {
            await showAlert("Error", `Error loading tutorial: ${err.message}`);
        }
        loadingScreen.set();
    });

    function onBack() {
        window.history.back();
    }
</script>

<main>
    <div class="header-wrapper">
        <i on:click={onBack} class="icon-chevron" />
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
        display: flex;
        flex-direction: column;
        position: absolute;
        z-index: 10;
    }

    .header-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: black;
        padding: 1.2rem;
    }

    .icon-chevron {
        color: white;
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
