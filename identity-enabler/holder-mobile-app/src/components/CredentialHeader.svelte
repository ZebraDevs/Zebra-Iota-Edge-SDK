<script lang="ts">
    import { IOTA_IDENTITY_RESOLVER } from "../config";
    import { shortenDID } from "../lib/ui/helpers";

    export let credential;
    export let color = "white";
    export let hideDetails = false;
</script>

<div id="wrapper" style="color: {color};">
    <i class="icon-credential" />
    <h2>{credential.type[1]}</h2>
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
            <span class="emphasis">{new Date(credential.issuanceDate).toLocaleString([...window.navigator.languages])}</span>
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

    .icon-credential {
        color: inherit;
        font-size: 64px;
    }

    h2 {
        margin: 0;
        font-size: 1.4em;
    }

    p {
        line-height: 1.5em;
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
