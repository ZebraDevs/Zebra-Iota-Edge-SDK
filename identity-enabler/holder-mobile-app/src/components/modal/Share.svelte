<script>
    import { getContext } from "svelte";
    import { navigate } from "svelte-routing";
    import { Plugins } from "@capacitor/core";
    import Button from "../Button.svelte";
    import { ServiceFactory } from "../../factories/serviceFactory";

    const { close } = getContext("simple-modal");
    const { Share } = Plugins;

    const credential = window.history.state.credential;
    const identityService = ServiceFactory.get("identity");

    function share() {
        close();
        navigate("/createPresentation", { state: { credential } });
    }

    async function shareJSON() {
        try {
            const storedIdentity = await identityService.retrieveIdentity();
            const verifiablePresentation = await identityService.createVerifiablePresentation(
                storedIdentity,
                credential?.credentialDocument
            );
            const presentationJSON = JSON.stringify(verifiablePresentation, null, 2);

            await Share.share({
                title: "Verifiable Presentation",
                text: presentationJSON
            });
        } catch (error) {
            console.log("Error sharing: " + error);
            return;
        }
    }
</script>

<section>
    <div class="modal-wrapper">
        <div class="btn-wrapper">
            <Button
                style="background: white; color: #051923; display: flex; justify-content: flex-start;
                            padding: 0;
                            height: fit-content;
                            font-weight: 600;
                            font-size: 2.3vh;
                            line-height: 3.4vh;"
                label="Share as data matrix"
                onClick={share}
            >
                <img class="modal-icon" src="../assets/data-matrix.svg" alt="data-matrix" />
            </Button>
            <div class="border" />
            <Button
                style="background: white; color: #051923; display: flex; justify-content: flex-start;
                            padding: 0;
                            height: fit-content;
                            font-weight: 600;
                            font-size: 2.3vh;
                            line-height: 3.4vh;"
                label="Share as JSON"
                onClick={shareJSON}
            >
                <img class="modal-icon" src="../assets/link.svg" alt="link" />
            </Button>
        </div>
    </div>
</section>

<style>
    .btn-wrapper {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600 !important;
        font-size: 6.3vh !important;
        line-height: 3.4vh !important;
        margin: 9.3vh 5.3vh 5.3vh 5.3vh;
    }

    .border {
        margin: 2.9vh 0;
        border: 1px solid #dfdfdf;
    }

    .modal-icon {
        width: 16px;
        height: 16px;
        margin-right: 2.3vh;
    }
</style>
