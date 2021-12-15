<script>
    import Button from "../components/Button.svelte";
    import Header from "../components/Header.svelte";
    import { landingIndex } from "../lib/store";
    import { navigate } from "svelte-routing";
    import { onMount } from "svelte";
    import Hammer from "hammerjs";
    import { fly } from "svelte/transition";

    let mounted;
    let back = $landingIndex > 0;

    const info = [
        {
            header: "AppX stores your health records and tests",
            content:
                "A safe space for your personal information, only accessible by you. AppX is powered by the neutral, free and decentralized network: IOTA.",
            footer: "Next"
        },
        {
            header: "Your data, your ownership",
            content: "Your data is controlled only on your phone. Currently, no backup options are available.",
            footer: "Next"
        },
        {
            header: "You control access to your immunity status",
            content:
                "AppX is all about controlling your information, not locking it up. You can decide who you share your data with by providing consent.",
            footer: "Next"
        }
    ];

    function onNext() {
        if ($landingIndex === info.length - 1) {
            navigate("name");
        } else {
            back = false;
            landingIndex.update(x => x + 1);
        }
    }

    function onBack() {
        if ($landingIndex !== 0) {
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
        mounted = true;
        if (window.matchMedia("(pointer: coarse)").matches) {
            const hammer = new Hammer(document.getElementById("wrapper"));
            hammer.get("swipe").set({ direction: Hammer.DIRECTION_HORIZONTAL });
            hammer.on("swipeleft", () => onNext());
            hammer.on("swiperight", () => onBack());
        }
    });
</script>

<main id="wrapper">
    <div class="headerContainer">
        <Header text={info[$landingIndex].header} />
    </div>
    <div class="contentContainer">
        {#each [$landingIndex] as count (count)}
            <div
                class="content"
                in:fly={mounted ? { ...getInAnimation(), duration: 400, opacity: 0 } : false}
                out:fly={{ ...getOutAnimation(), duration: 400, opacity: 0 }}
            >
                <img src="../assets/landing-{$landingIndex + 1}.png" alt="landing-{$landingIndex + 1}" />
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
        <Button label={info[$landingIndex].footer} onClick={onNext} />
    </footer>
</main>

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
        padding: 3vh 0;
    }

    .dots {
        text-align: center;
        justify-content: center;
        margin-bottom: 3.3vh;
    }

    span {
        height: 1.3vh;
        width: 1.3vh;
        background-color: #c4d0e3;
        border-radius: 50%;
        display: inline-block;
        margin-right: 1vh;
    }

    span.active {
        height: 1.4vh;
        width: 1.4vh;
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
        padding-bottom: 11vh;
    }

    .footerContainer {
        position: fixed;
        bottom: 0;
        width: 100%;
    }
</style>
