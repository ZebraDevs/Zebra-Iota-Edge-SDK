<script lang="ts">
    import { getContext } from "svelte";
    import { navigate } from "svelte-routing";
    import { Plugins } from "@capacitor/core";
    import Button from "../Button.svelte";
    import { ServiceFactory } from "../../factories/serviceFactory";
    import { showAlert } from "../../lib/ui/helpers";
    import type { IdentityService } from "../../services/identityService";

    const { close } = getContext("simple-modal");
    const { Share } = Plugins;

    export let credential;
    const identityService = ServiceFactory.get<IdentityService>("identity");

    function share() {
        close();
        navigate("/createPresentation", { state: { credential } });
    }

    async function shareJSON() {
        try {
            const storedIdentity = await identityService.retrieveIdentity();
            const verifiablePresentation = await identityService.createVerifiablePresentation(
                storedIdentity,
                credential
            );
            const presentationJSON = JSON.stringify(verifiablePresentation.toJSON(), null, 2);

            await Share.share({
                title: "Verifiable Presentation",
                text: presentationJSON
            });
        } catch (error) {
            console.error(error);
            await showAlert("Error", error.message);
        }
    }
</script>

<section>
    <div class="modal-wrapper">
        <h2>Share credential</h2>
        <div class="border" />
        <Button
            style="color: black; background: white; justify-content: start; padding: 0 1.5rem;"
            label="Share as data matrix"
            onClick={share}
        >
            <i class="icon-qr" />
        </Button>
        <div class="border" />
        <Button
            style="color: black; background: white; justify-content: start; padding: 0 1.5rem;"
            label="Share as JSON"
            onClick={shareJSON}
        >
            <i class="icon-link" />
        </Button>
    </div>
</section>

<style>
    h2 {
        text-align: center;
        margin: 1.5rem 0;
    }

    .border {
        border: 1px solid var(--black-10);
    }

    i {
        margin-right: 0.5rem;
    }
</style>
