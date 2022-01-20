<script type="ts">
    import { showAlert } from "../lib/ui/helpers";

    export let onClick;
    export let heading: string;
    export let subheading: string | undefined = undefined;
    export let icon: string = "credential";
    export let iconColor: string = "black";
    export let arrow = true;
    let handling = false;

    /**
     * Disable button while listener is being executed to prevent duplicated events.
     * @param args The event arguments to pass to the listener.
     */
    async function clickHandler(...args) {
        handling = true;
        try {
            await onClick(...args);
        } catch (e) {
            console.error(e);
            await showAlert("Error", e.message);
        }
        handling = false;
    }
</script>

<li on:click={clickHandler} style={handling ? "pointer-events: none" : ""}>
    <i class="icon-{icon}" style="color: {iconColor};" />
    <div class="text-container">
        <div class="overflow-container">
            <h5>{heading}</h5>
        </div>
        {#if subheading}
            <div class="overflow-container">
                <h6>{subheading}</h6>
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

    h5 {
        display: inline;
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 1em;
        margin: 0;
    }

    h6 {
        display: inline;
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 0.75em;
        margin: 0;
        color: #8593ac;
    }
</style>
