<script type="ts">
    export let onClick;
    export let heading: string | undefined = undefined;
    export let subheading: string;
    export let icon: string = "credential";
    export let iconColor: string = "black";
    export let arrow = true;
</script>

<li on:click={onClick}>
    <i class="icon-{icon}" style="color: {iconColor};" />
    <div class="text-container">
        {#if heading}
            <div class="overflow-container">
                <h5>{heading}</h5>
            </div>
        {/if}
        <div class="overflow-container">
            <h6>{subheading}</h6>
        </div>
    </div>
    {#if arrow}
        <i class="icon-chevron rotate-180" />
    {/if}
</li>

<style>
    li {
        border: 2px solid rgb(219, 219, 219);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.8rem;
    }

    li > i {
        color: rgb(175, 175, 175);
        font-size: 3em;
    }

    .icon-chevron {
        font-size: 1.75em;
    }

    .text-container {
        flex: 1;
        padding: 0 1rem;
        min-width: 0;
        max-width: 100%;
    }

    .overflow-container {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    h5 {
        display: inline;
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 0.75em;
        letter-spacing: 0.06em;
        color: #8593ac;
        text-transform: uppercase;
        margin: 0 0 0.9vh 0;
    }

    h6 {
        display: inline;
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 1em;
        margin: 0;
        color: #051923;
    }
</style>
