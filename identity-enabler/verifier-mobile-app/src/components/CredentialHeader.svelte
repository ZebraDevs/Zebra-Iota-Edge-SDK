<script lang="ts">
    import { IOTA_IDENTITY_RESOLVER } from "../config";
    import { isExpired } from "../lib/helpers";
    import { getDateString, getTimeString, shortenDID } from "../lib/ui/helpers";

    export let credential;
    export let color = "white";
    export let hideDetails = false;

    const issuanceDate = new Date(credential.issuanceDate);

    const expired = isExpired(credential);
</script>

<div id="wrapper" style="color: {color};">
    {#if !expired}
        <i class="icon-check" />
        <h2>VALID CREDENTIAL</h2>
    {:else}
        <i class="icon-cross" />
        <h2>EXPIRED CREDENTIAL</h2>
    {/if}
    {#if !hideDetails}
        <p>
            <span>Issued by </span>
            <a
                href="{IOTA_IDENTITY_RESOLVER}/{credential.issuer.id ?? credential.issuer}"
                class="emphasis"
                target="_blank"
                >{credential.issuer.name ?? shortenDID(credential.issuer.id ?? credential.issuer)}
            </a>
            <span> on {getDateString(issuanceDate)} at {getTimeString(issuanceDate)}</span>
        </p>
    {/if}
</div>

<style>
    #wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    i {
        font-size: 64px;
    }

    h2 {
        margin: 0;
    }

    p {
        margin-bottom: 0;
        line-height: 1.5em;
        font-size: smaller;
        text-align: center;
    }

    p .emphasis {
        font-weight: bold;
        padding: 0 0.1rem;
    }
</style>
