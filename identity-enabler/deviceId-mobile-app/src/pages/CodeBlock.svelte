<script lang="ts">
    import Layout from "../components/Layout.svelte";

    const code: string = window.history.state.code;
</script>

<Layout>
    <div slot="header" class="options-wrapper">
        <i on:click|once={() => window.history.back()} class="side icon-chevron" />
        <h2>Code</h2>
        <div class="side" />
    </div>
    <section slot="content">
        <pre><code>{code}</code></pre>
    </section>
</Layout>

<style>
    .options-wrapper {
        background-color: black;
        color: white;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 1.5rem;
    }

    .icon-chevron {
        color: white;
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
    }

    pre {
        overflow: auto;
        margin: 0;
        background-color: #eee;
        padding: 1rem;
    }
</style>
