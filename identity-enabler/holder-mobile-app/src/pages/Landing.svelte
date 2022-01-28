<script>
    import Button from "../components/Button.svelte";
    import Header from "../components/Header.svelte";
    import { landingIndex } from "../lib/store";
    import { navigate } from "svelte-routing";
    import { onMount } from "svelte";
    import Hammer from "hammerjs";
    import { fly } from "svelte/transition";
    import { Plugins } from "@capacitor/core";
    import { wait } from "../lib/helpers";
    import { BACK_BUTTON_EXIT_GRACE_PERIOD } from "../config";
    import PageTransition from "../components/PageTransition.svelte";

    const { App, Toast } = Plugins;
    let mounted;
    let back = $landingIndex > 0;
    let exitOnBack = false;

    const info = [
        {
            header: "AppX stores your decentralized identity",
            content:
                "A safe space for your information, only accessible by you. AppX is powered by the neutral, free and decentralized network: IOTA.",
            footer: "Next",
            image: "checklist.svg"
        },
        {
            header: "Your data, your ownership",
            content: "Your data is controlled only on your phone. Currently, no backup options are available.",
            footer: "Next",
            image: "notepad.svg"
        },
        {
            header: "You control access to your credentials",
            content: "AppX is all about controlling your credentials. You decide who to share them with.",
            footer: "Next",
            image: "folder.svg"
        }
    ];

    async function onBackButton() {
        if ($landingIndex > 0) {
            prevLanding();
            return;
        }

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

    function nextLanding() {
        if ($landingIndex === info.length - 1) {
            navigate("/name");
        } else {
            back = false;
            landingIndex.update(x => x + 1);
        }
    }

    function prevLanding() {
        if ($landingIndex > 0) {
            back = true;
            landingIndex.update(x => x - 1);
        }
    }

    function getInAnimation() {
        if ($landingIndex > 0 && $landingIndex < info.length - 1) {
            return { x: back ? -360 : 360 };
        }
        return { x: $landingIndex === 0 ? -360 : 360 };
    }

    function getOutAnimation() {
        if ($landingIndex > 0 && $landingIndex < info.length - 1) {
            return { x: back ? 360 : -360 };
        }
        return { x: $landingIndex === 0 ? 360 : -360 };
    }

    onMount(() => {
        const listenerHandle = App.addListener("backButton", onBackButton);
        mounted = true;

        if (window.matchMedia("(pointer: coarse)").matches) {
            const hammer = new Hammer(document.getElementById("wrapper"));
            hammer.get("swipe").set({ direction: Hammer.DIRECTION_HORIZONTAL });
            hammer.on("swipeleft", () => nextLanding());
            hammer.on("swiperight", () => prevLanding());
        }

        return listenerHandle.remove;
    });
</script>

<PageTransition>
    <main id="wrapper">
        <div class="headerContainer">
            <Header text={info[$landingIndex].header} />
        </div>
        <div class="contentContainer">
            {#each [$landingIndex] as count (count)}
                <div
                    class="content"
                    in:fly={mounted ? { ...getInAnimation(), duration: 400, opacity: 0 } : false}
                    out:fly|local={{ ...getOutAnimation(), duration: 400, opacity: 0 }}
                >
                    <img src="/img/{info[$landingIndex].image}" alt={info[$landingIndex].image.replace(/\.svg$/, "")} />
                    <div class="dots">
                        {#each Array(3)
                            .fill()
                            .map((_, i) => i) as idx}
                            <span class:active={idx === $landingIndex} />
                        {/each}
                    </div>
                    <p class="info">{info[$landingIndex].content}</p>
                </div>
            {/each}
        </div>
        <footer class="footerContainer">
            <Button label={info[$landingIndex].footer} onClick={nextLanding} />
        </footer>
    </main>
</PageTransition>

<style>
    main {
        height: 100%;
        flex-direction: column;
        display: flex;
        align-items: center;
    }

    .content {
        text-align: center;
        align-items: center;
        width: 100%;
        padding: 0 3.4vh;
    }

    .content > img {
        mix-blend-mode: multiply;
        max-height: 150px;
    }

    .dots {
        text-align: center;
        justify-content: center;
        margin: 1rem 0;
    }

    .dots > span {
        height: 0.7em;
        width: 0.7em;
        background-color: #c4d0e3;
        border-radius: 50%;
        display: inline-block;
        margin-right: 0.7rem;
    }

    .dots > span.active {
        height: 0.75em;
        width: 0.75em;
        background: #00a7ff;
    }

    .info {
        font-family: "Proxima Nova", sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 0.9em;
        line-height: 1.5em;
        color: #6f7a8d;
        text-align: center;
        padding: 0px 3vw;
    }

    .headerContainer {
        display: flex;
        padding: 3vh 0;
    }

    .contentContainer {
        display: flex;
        padding-bottom: 3.5em;
    }

    .footerContainer {
        position: fixed;
        bottom: 0;
        width: 100%;
    }
</style>
