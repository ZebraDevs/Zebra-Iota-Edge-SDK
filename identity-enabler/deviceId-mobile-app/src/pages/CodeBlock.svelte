<script lang="ts">
    import PageTransition from "../components/PageTransition.svelte";

    const code: string = window.history.state.code;
</script>

<PageTransition backwards={true}>
    <main>
        <div class="header-wrapper">
            <i on:click|once={() => window.history.back()} class="side icon-chevron" />
            <header>Code</header>
            <div class="side" />
        </div>
        <section>
            <pre><code>{code}</code></pre>
        </section>
    </main>
</PageTransition>

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

    pre {
        overflow: auto;
        margin: 0;
        background-color: #eee;
        padding: 1rem;
    }
</style>
