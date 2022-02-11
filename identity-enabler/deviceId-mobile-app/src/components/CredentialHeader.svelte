<script lang="ts">
    import { IOTA_IDENTITY_RESOLVER } from "../config";
    import { credentialDisplayMap } from "../lib/ui/credentialDisplayMap";
    import { getDateString, getTimeString, shortenDID } from "../lib/ui/helpers";

    export let credential;
    export let color = "black";
    export let hideDetails = false;

    const issuanceDate = new Date(credential.issuanceDate);
</script>

<div id="wrapper" style="color: {color};">
    <i class="icon-credential" />
    <h2>{credentialDisplayMap[credential.type[1]]}</h2>
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
        font-family: "Proxima Nova", sans-serif;
    }

    .icon-credential {
        color: inherit;
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

    a {
        color: inherit;
    }

    a:visited {
        color: unset;
    }
</style>
