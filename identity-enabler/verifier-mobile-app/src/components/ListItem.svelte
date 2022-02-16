<script type="ts">
    export let onClick;
    export let heading: string;
    export let subheading: string | undefined = undefined;
    export let icon: string = "credential";
    export let iconColor: string = "black";
    export let arrow = true;
</script>

<li on:click={onClick}>
    <i class="icon-{icon}" style="color: {iconColor};" />
    <div class="text-container">
        <div class="overflow-container">
            <h3>{heading}</h3>
        </div>
        {#if subheading}
            <div class="overflow-container">
                <h5>{subheading}</h5>
            </div>
        {/if}
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
        padding: 0.65rem 0.8rem;
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
        padding: 0 0.75rem;
        min-width: 0;
        max-width: 100%;
    }

    .overflow-container {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    h3 {
        display: inline;
        margin: 0;
    }

    h5 {
        display: inline;
        margin: 0;
    }
</style>
