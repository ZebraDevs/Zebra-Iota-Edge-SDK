<script>
    import { Plugins } from "@capacitor/core";
    import { onMount } from "svelte";
    import Button from "../components/Button.svelte";
    import Header from "../components/Header.svelte";
    import { navigate } from "svelte-routing";
    import { wait } from "../lib/helpers";
    import { BACK_BUTTON_EXIT_GRACE_PERIOD } from "../config";

    const info = {
        header: "Create and store device digital identity",
        content: "Share device credentials and immunity status safely and privately using IOTA’s Identity solution.",
        footer: "Next"
    };

    const { App, Toast } = Plugins;
    let exitOnBack = false;

    onMount(() => App.addListener("backButton", onBack).remove);

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

    function onNext() {
        navigate("name");
    }
</script>

<main id="wrapper">
    <div class="content">
        <div>
            <Header text={info.header} />
        </div>
        <img src="/img/landing-1.png" alt="landing-1" />
        <p class="info">{info.content}</p>
    </div>
    <footer class="footerContainer">
        <Button label={info.footer} onClick={onNext} />
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

    .info {
        font-family: "Proxima Nova", sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 0.9em;
        line-height: 1.5em;
        color: #6f7a8d;
        text-align: center;
        padding: 0 8vw;
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
