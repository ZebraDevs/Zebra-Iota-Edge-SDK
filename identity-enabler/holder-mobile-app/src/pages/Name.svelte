<script lang="ts">
    import { Plugins } from "@capacitor/core";
    import { navigate } from "svelte-routing";
    import Button from "../components/Button.svelte";
    import { TextField } from "@zebra-iota-edge-sdk/common";
    import Header from "../components/Header.svelte";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { account, hasSetupAccount, loadingScreen } from "../lib/store";
    import { showAlert } from "../lib/ui/helpers";
    import type { IdentityService } from "../services/identityService";
    import { __WEB__ } from "$lib/platforms";
    import { Page } from "@zebra-iota-edge-sdk/common";

    let name = "";

    async function save() {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity to create a new IOTA Identity");
            return;
        }

        if (!__WEB__) {
            await Plugins.Keyboard.hide();
        }
        loadingScreen.set("Creating Identity...");
        const identityService = ServiceFactory.get<IdentityService>("identity");
        let identity;

        try {
            identity = await identityService.createIdentity();
        } catch (err) {
            console.error(err);
            loadingScreen.set("");
            await showAlert("Error", `Error creating identity: ${err.message}`);
            return;
        }

        await identityService.storeIdentity("did", identity);
        account.set({ name });
        hasSetupAccount.set(true);
        loadingScreen.set("");
        navigate("/home");
    }
</script>

<Page>
    <div slot="content" class="content">
        <div>
            <Header text="Set your name" />
        </div>
        <div>
            <img src="/img/inspect.svg" alt="inspect" />
        </div>
        <div>
            <TextField bind:value={name} placeholder="Your Name" />
        </div>
    </div>
    <svelte:fragment slot="footer">
        <Button disabled={name.length === 0 || Boolean($loadingScreen)} label="Next" onClick={save} />
    </svelte:fragment>
</Page>

<style>
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .content > * {
        margin: 3vh 0;
    }

    img {
        mix-blend-mode: multiply;
        max-height: 150px;
    }
</style>
