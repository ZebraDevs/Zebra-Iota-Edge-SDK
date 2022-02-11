<script lang="ts">
    import { IOTA_IDENTITY_RESOLVER } from "../config";

    export let entries: { [key: string]: string };
</script>

<ul>
    {#each Object.keys(entries) as entryKey}
        <li>
            <p>{entryKey}</p>
            {#if entries[entryKey].startsWith("did:iota:")}
                <a
                    class="cut-text"
                    href={`${IOTA_IDENTITY_RESOLVER}/${entries[entryKey]}`}
                    target="_blank"
                    title="View in IOTA Explorer">{entries[entryKey]}</a
                >
            {:else}
                <span class="cut-text">{entries[entryKey]}</span>
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

    li > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 400;
        font-size: 0.7em;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        color: var(--black-40);
        margin-top: 0;
    }

    li > span,
    li > a {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 0.9em;
    }

    .cut-text {
        white-space: pre-wrap;
        word-wrap: break-word;
    }
</style>
