<script>
    import { getContext } from "svelte";
    import { navigate } from "svelte-routing";
    import { Plugins } from "@capacitor/core";
    import Button from "../Button.svelte";

    const { close } = getContext("simple-modal");
    const { Share } = Plugins;

    const credential = window.history.state.credential;

    function share() {
        navigate("/createPresentation", { state: { credential } });
        close();
    }

    async function shareJSON() {
        await Share.share({
            title: "Verifiable Presentation",
            text: JSON.stringify(credential, null, 2)
        });
        close();
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
                <i class="icon-qr" />
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
                <i class="icon-link" />
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
        margin: 5.3vh;
    }

    .border {
        margin: 2.9vh 0;
        border: 1px solid #dfdfdf;
    }

    .btn-wrapper i {
        color: black;
        margin-right: 0.5rem;
        font-size: 1.5em;
    }
</style>
