<script lang="ts">
    import { getContext } from "svelte";
    import { navigate } from "svelte-routing";
    import { Plugins } from "@capacitor/core";
    import Button from "../Button.svelte";

    const { close } = getContext("simple-modal");

    export let vp;

    function share() {
        navigate("/createPresentation", { state: { vp } });
        close();
    }

    async function shareJSON() {
        await Plugins.Share.share({
            title: "Verifiable Presentation",
            text: JSON.stringify(vp, null, 2)
        });
        close();
    }
</script>

<section>
    <div class="modal-wrapper">
        <h2>Share credential</h2>
        <div class="border" />
        <Button
            style="background: white; justify-content: start; padding: 0 1.5rem;"
            label="Share as data matrix"
            onClick={share}
        >
            <i class="icon-qr" />
        </Button>
        <div class="border" />
        <Button
            style="background: white; justify-content: start; padding: 0 1.5rem;"
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
