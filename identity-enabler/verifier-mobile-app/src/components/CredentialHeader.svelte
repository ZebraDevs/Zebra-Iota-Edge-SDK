<script lang="ts">
    import { IOTA_IDENTITY_RESOLVER } from "../config";
    import { isExpired } from "../lib/helpers";
    import { shortenDID } from "../lib/ui/helpers";

    export let credential;
    export let color = "white";
    export let hideDetails = false;

    let expired = isExpired(credential.issuanceDate);
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
            <span>Issued to </span>
            <a href="{IOTA_IDENTITY_RESOLVER}/{credential.credentialSubject.id}" class="emphasis" target="_blank">
                {shortenDID(credential.credentialSubject.id)}
            </a>
            <span> by </span>
            <a href="{IOTA_IDENTITY_RESOLVER}/{credential.issuer.id}" class="emphasis" target="_blank"
                >{credential.issuer.name}
            </a>
            <span> at </span>
            <span class="emphasis">{new Date(credential.issuanceDate).toLocaleString()}</span>
        </p>
    {/if}
</div>

<style>
    #wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 2rem;
        font-family: "Proxima Nova", sans-serif;
    }

    i {
        color: inherit;
        font-size: 64px;
    }

    h2 {
        margin: 0;
        font-size: 1.2em;
    }

    p {
        line-height: 1.5em;
        margin-bottom: 0;
    }

    p .emphasis {
        font-weight: bold;
        padding: 0 0.2rem;
    }

    a {
        color: inherit;
    }

    a:visited {
        color: unset;
    }
</style>
