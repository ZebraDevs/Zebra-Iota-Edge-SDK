<script>
    import { IOTA_IDENTITY_RESOLVER } from "../config";
    import { flattenObj } from "../lib/helpers";

    export let object;
</script>

<ul>
    {#each Object.entries(flattenObj(object)) as entry}
        <li>
            <p>{entry[0].split(".").pop()}</p>
            {#if typeof entry[1] === "string" && entry[1].startsWith("did:iota:")}
                <a
                    class="cut-text"
                    href={`${IOTA_IDENTITY_RESOLVER}/${entry[1]}`}
                    target="_blank"
                    title="View in IOTA Explorer">{entry[1]}</a
                >
            {:else}
                <span class="cut-text">{entry[1]}</span>
            {/if}
        </li>
    {/each}
</ul>

<style>
    ul {
        background: #fff;
        margin: 3vh 0 11vh 0;
        padding: 0;
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
        list-style-type: none;
        text-align: left;
        position: relative;
        z-index: 5;
        -webkit-overflow-scrolling: touch;
    }

    li {
        padding: 2.3vh 3.5vw;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    li:nth-last-child(n + 2) {
        border-bottom: 1px solid #f1f4fa;
    }

    li > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 400;
        font-size: 2.8vw;
        line-height: 4vw;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        color: #8593ac;
        margin: 0.43vh 0;
    }

    li > span,
    li > a {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 2vh;
        line-height: 3.4vh;
        color: #051923;
    }

    .cut-text {
        word-wrap: break-word;
    }
</style>
