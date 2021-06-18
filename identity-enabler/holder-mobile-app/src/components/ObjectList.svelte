<script>
    // import ObjectList from './ObjectList.svelte';
	import { flattenObj } from '../lib/helpers';

    export let object;
</script>

<style>
    ul {
        background: #fff;
        margin: 3vh 0;
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
        border-radius: 1vh;
        list-style-type: none;
        text-align: left;
        overflow: auto;

        -webkit-overflow-scrolling: touch;
    }

    li {
        padding: 1.5vh 5vw;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    li:nth-last-child(n + 2) {
        border-bottom: 1px solid #f1f4fa;
    }

    li > p {
        font-family: 'Inter', sans-serif;
        font-weight: 1000;
        font-size: 3vw;
        line-height: 4vw;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        color: #8593ac;
    }
</style>

<ul>
    {#each Object.entries(flattenObj(object)) as entry}
        <li>
            <p>{entry[0].split('.').pop()}</p>
            <span>{entry[1]}</span>
        </li>
    {/each}
</ul>
