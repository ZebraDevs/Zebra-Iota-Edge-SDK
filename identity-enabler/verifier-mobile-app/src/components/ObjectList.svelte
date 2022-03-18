<script lang="ts">
    import { IOTA_IDENTITY_RESOLVER } from "../config";

    export let entries: { [key: string]: string };
</script>

<ul>
    {#each Object.keys(entries) as entryKey}
        <li>
            <h5 class="key">{entryKey}</h5>
            {#if entries[entryKey].startsWith("did:iota:")}
                <a
                    class="cut-text"
                    href={`${IOTA_IDENTITY_RESOLVER}/${entries[entryKey]}`}
                    target="_blank"
                    title="View in IOTA Explorer">{entries[entryKey]}</a
                >
            {:else}
                <p class="cut-text">{entries[entryKey]}</p>
            {/if}
        </li>
    {/each}
</ul>

<style>
    ul {
        margin: 0;
        padding: 0;
        list-style-type: none;
        text-align: left;
        position: relative;
        -webkit-overflow-scrolling: touch;
    }

    li {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    li:nth-last-child(n + 2) {
        border-bottom: 1px solid var(--black-10);
    }

    li > h5 {
        letter-spacing: 0.03em;
        text-transform: uppercase;
        margin: 0 0 0.25rem 0;
    }

    .cut-text {
        margin: 0;
        font-weight: bold;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
</style>
