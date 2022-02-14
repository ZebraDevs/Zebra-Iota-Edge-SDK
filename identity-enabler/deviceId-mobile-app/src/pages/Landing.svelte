<script lang="ts">
    import { Plugins } from "@capacitor/core";
    import { onMount } from "svelte";
    import Button from "../components/Button.svelte";
    import Header from "../components/Header.svelte";
    import { navigate } from "svelte-routing";
    import { wait } from "../lib/helpers";
    import { BACK_BUTTON_EXIT_GRACE_PERIOD } from "../config";
    import { Page } from "@zebra-iota-edge-sdk/common";

    const info = {
        header: "Create and store device digital identity",
        content: "Generate an identity and share verifiable data about the device using IOTA’s Identity solution.",
        footer: "Next",
        image: "checklist.svg"
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
        navigate("/name");
    }
</script>

<Page>
    <div slot="content" class="content">
        <div>
            <Header text={info.header} />
        </div>
        <img src="/img/{info.image}" alt="checklist" />
        <p class="info">{info.content}</p>
    </div>
    <svelte:fragment slot="footer">
        <Button label={info.footer} onClick={onNext} />
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

    .info {
        font-family: "Proxima Nova", sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 0.9em;
        line-height: 1.5em;
        color: var(--black-60);
        text-align: center;
        padding: 0 8vw;
    }

    img {
        mix-blend-mode: multiply;
        max-height: 150px;
    }
</style>
