<script lang="ts">
    import { getContext } from "svelte";
    import { Plugins } from "@capacitor/core";
    import { multiClick } from "../../lib/ui/helpers";

    const { close } = getContext("simple-modal");
    const { Toast } = Plugins;

    export let json;

    async function copyJSON(): Promise<void> {
        if (window.navigator.clipboard) {
            await window.navigator.clipboard.writeText(json);
            await Toast.show({ text: "JSON copied", position: "bottom" });
            return;
        }
    }

</script>

<section>
    <div class="modal-wrapper">
        <pre use:multiClick on:multiClick={copyJSON}><code>{json}</code></pre>
    </div>
</section>

<style></style>
