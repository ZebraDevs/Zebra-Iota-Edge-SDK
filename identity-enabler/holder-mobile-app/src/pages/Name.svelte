<script>
    import { Plugins } from "@capacitor/core";
    import { navigate } from "svelte-routing";
    import Button from "../components/Button.svelte";
    import TextField from "../components/TextField.svelte";
    import Header from "../components/Header.svelte";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { account, hasSetupAccount, loadingScreen } from "../lib/store";
    import { showAlert } from "../lib/ui/helpers";

    const { Keyboard } = Plugins;

    let name = "";
    let background;

    function handleOuterClick() {
        if (event.target === background) {
            event.preventDefault();

            if (document.activeElement) {
                document.activeElement.blur();
            }
        }
    }

    async function save() {
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity to create a new IOTA Identity");
            return;
        }

        Keyboard.hide();
        loadingScreen.set("Creating Identity...");
        const identityService = ServiceFactory.get("identity");
        let identity;

        try {
            identity = await identityService.createIdentity();
        } catch (err) {
            console.error(err);
            loadingScreen.set();
            await showAlert("Error", `Error creating identity: ${err.message}`);
            return;
        }

        await identityService.storeIdentity("did", identity);
        account.set({ name });
        hasSetupAccount.set(true);
        loadingScreen.set();
        navigate("/home");
    }
</script>

<main bind:this={background} on:click={handleOuterClick}>
    <div class="content">
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
    <footer>
        <Button
            loadingText={"Generating identity"}
            disabled={name.length === 0 || Boolean($loadingScreen)}
            label="Next"
            onClick={save}
        />
    </footer>
</main>

<style>
    main {
        height: 100%;
        width: 100%;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 3.5em;
    }

    .content > * {
        margin: 3vh 0;
    }

    img {
        mix-blend-mode: multiply;
        max-height: 150px;
    }

    footer {
        position: fixed;
        bottom: 0;
        width: 100%;
    }
</style>
