<script lang="ts">
    import { onMount } from "svelte";
    import Markdown from "../components/Markdown.svelte";
    import { TUTORIAL_URL } from "../config";
    import { loadingScreen } from "../lib/store";
    import { showAlert } from "../lib/ui/helpers";
    import { Page } from "@zebra-iota-edge-sdk/common";

    let markdown = "";
    let title = "";

    onMount(async () => {
        loadingScreen.set("Loading...");
        try {
            const response = await fetch(TUTORIAL_URL);
            const tutorialMd = await response.text();
            const endOfTitleIdx = tutorialMd.indexOf("\n");
            title = tutorialMd.slice(2, endOfTitleIdx);
            markdown = tutorialMd.slice(Math.max(0, endOfTitleIdx + 1));
        } catch (err) {
            await showAlert("Error", `Error loading tutorial: ${err.message}`);
        }
        loadingScreen.set("");
    });
</script>

<Page theme="dark">
    <div slot="header" class="options-wrapper">
        <i on:click|once={() => window.history.back()} class="side icon-chevron" />
        <h2>{title}</h2>
        <div class="side" />
    </div>

    <section slot="content">
        <div class="highlightjs-component">
            <Markdown {markdown} language="javascript" />
        </div>
    </section>
</Page>

<style>
    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 1.5rem;
    }

    h2 {
        margin: 0;
        align-self: center;
        text-transform: uppercase;
    }

    .options-wrapper > .side {
        flex: 1;
    }

    .highlightjs-component {
        overflow: auto;
        background-color: white;
        color: black;
        padding: 1rem;
    }
</style>
