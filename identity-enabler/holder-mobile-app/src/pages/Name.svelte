<script>
    import { Plugins } from "@capacitor/core";
    import { navigate } from "svelte-routing";
    import Button from "../components/Button.svelte";
    import TextField from "../components/TextField.svelte";
    import Header from "../components/Header.svelte";
    import FullScreenLoader from "../components/FullScreenLoader.svelte";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { account, error, hasSetupAccount } from "../lib/store";
    import { showAlert } from "../lib/ui/helpers";

    const { Keyboard } = Plugins;

    let name = "";
    let loading = false;
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

        if (loading) {
            return;
        }

        Keyboard.hide();

        error.set(null);

        account.set({ name: name });

        loading = true;

        try {
            const identityService = ServiceFactory.get("identity");
            const identity = await identityService.createIdentity();
            await identityService.storeIdentity("did", identity);
            console.log("Identity", identity);
            loading = false;
            hasSetupAccount.set(true);

            navigate("/home");
        } catch (err) {
            error.set("Error creating identity. Please try again.");
            loading = false;
        }
    }
</script>

<main bind:this={background} on:click={handleOuterClick}>
    {#if loading}
        <FullScreenLoader label="Creating Identity..." />
    {:else}
        <div class="content">
            <div>
                <Header text="Set your name" />
            </div>
            <div>
                <img src="../assets/set-name.png" alt="set-name" />
            </div>
            <div>
                <TextField bind:value={name} placeholder="Your Name" />
            </div>
        </div>
        <footer>
            <Button loadingText={"Generating identity"} disabled={name.length === 0} label="Next" onClick={save} />
        </footer>
    {/if}
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
        padding-bottom: 11vh;
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
