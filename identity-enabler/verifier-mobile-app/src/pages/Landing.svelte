<script lang="ts">
    import { Plugins } from "@capacitor/core";
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import Button from "../components/Button.svelte";
    import Header from "../components/Header.svelte";
    import { BACK_BUTTON_EXIT_GRACE_PERIOD } from "../config";
    import { wait } from "../lib/helpers";
    import { firstLaunch } from "../lib/store";

    const { App, Toast } = Plugins;
    let exitOnBack = false;

    onMount(() => App.addListener("backButton", onBack).remove);

    function onNext() {
        firstLaunch.set(false);
        navigate("/home");
    }

    async function onBack() {
        if (exitOnBack) {
            // From the landing screen, navigating back twice should exit the app
            App.exitApp();
            return;
        }

        exitOnBack = true;
        await Toast.show({
            position: "bottom",
            duration: "short",
            text: "Tap back again to exit"
        });
        await wait(BACK_BUTTON_EXIT_GRACE_PERIOD);
        exitOnBack = false;
    }
</script>

<main id="wrapper">
    <div class="content">
        <div>
            <Header text="Scan, verify and store credentials" />
        </div>
        <img src="/img/landing-1.png" alt="landing-1" />
    </div>
    <footer class="footerContainer">
        <Button label="Next" onClick={onNext} />
    </footer>
</main>

<style>
    main {
        height: 100%;
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
