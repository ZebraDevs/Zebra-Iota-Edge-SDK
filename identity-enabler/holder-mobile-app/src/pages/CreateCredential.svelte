<script>
    import { Link } from "svelte-routing";
    import { onMount } from "svelte";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { error, storedCredentials } from "../lib/store";
    import { SchemaNames } from "../schemas";
    import Spinner from "../components/Spinner.svelte";

    let credentialJSON = "";
    let loading = true;

    onMount(() => {
        setTimeout(async () => {
            const identityService = ServiceFactory.get("identity");

            error.set(null);

            try {
                const storedIdentity = await identityService.retrieveIdentity();

                const credential = await identityService.createSelfSignedCredential(
                    storedIdentity,
                    SchemaNames.CONTACT_DETAILS,
                    {
                        UserContacts: {
                            Email: "email@company.com",
                            Phone: "111-222-3333"
                        }
                    }
                );

                storedCredentials.update(prev =>
                    [...prev, credential].map(cred => ({
                        credentialDocument: { ...cred },
                        metaInformation: { issuer: "iota" },
                        id: "credentialId"
                    }))
                );

                credentialJSON = JSON.stringify(credential, null, 2);

                loading = false;
            } catch (err) {
                error.set("Error creating identity. Please try again.");
                loading = false;
            }
        }, 500);
    });
</script>

<main>
    <Link to="/home">Back</Link>
    <h1>Credential</h1>
    {#if loading}
        <Spinner />
    {:else}
        <h3>{credentialJSON}</h3>
    {/if}
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 2.5em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
