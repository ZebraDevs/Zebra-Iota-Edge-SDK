<script lang="ts">
    import { Page } from "@zebra-iota-edge-sdk/common";

    const code: string = window.history.state.code;
</script>

<Page theme="dark">
    <div slot="header" class="options-wrapper">
        <i on:click|once={() => window.history.back()} class="side icon-chevron" />
        <h2>Code</h2>
        <div class="side" />
    </div>
    <section slot="content">
        <pre><code>{code}</code></pre>
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

    section {
        height: 100%;
        background-color: white;
    }

    pre {
        color: black;
        overflow: auto;
        margin: 0;
        padding: 1rem;
    }
</style>
