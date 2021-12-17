<script>
    import { fly } from "svelte/transition";
    import { Plugins } from "@capacitor/core";
    import { updateStorage } from "../lib/store";
    import Button from "../components/Button.svelte";
    import ObjectList from "../components/ObjectList.svelte";
    import DevInfo from "./DevInfo.svelte";
    import { isExpired } from "../lib/helpers";
    import { navigate } from "svelte-routing";
    import { onMount } from "svelte";

    const { App, Modals } = Plugins;

    let showTutorial = false;
    let credential = window.history.state.credential;
    let expired = isExpired(credential.issuanceDate);

    function onDone() {
        navigate("/home");
    }

    async function onDelete() {
        let confirmRet = await Modals.confirm({
            title: "Delete credential",
            message: "Are you sure you want to delete the credential?"
        });
        if (confirmRet.value) {
            await updateStorage("credentials", { [credential.type[1].split(/\b/)[0].toLowerCase()]: "" });
            // ensure impossible to navigate back to a deleted credential page
            navigate("/home", { replace: true });
        }
    }

    function onClickDev() {
        showTutorial = true;
    }

    function onBack() {
        if (showTutorial) {
            showTutorial = false;
            return;
        }

        window.history.back();
    }

    onMount(() => App.addListener("backButton", onBack).remove);
</script>

<main transition:fly={{ x: 500, duration: 500 }}>
    {#if showTutorial}
        <DevInfo page="Credential" bind:showTutorial />
    {/if}

    {#if !showTutorial}
        <div class="header-wrapper" class:expired>
            <div class="options-wrapper">
                <i on:click={onDelete} class="icon-remove" />
                <i on:click={onClickDev} class="icon-code" />
            </div>
            <header>
                {#if !expired}
                    <i class="icon-check" />
                    <p>VALID CREDENTIAL</p>
                {:else}
                    <i class="icon-cross" />
                    <p>EXPIRED CREDENTIAL</p>
                {/if}
            </header>
        </div>
        <section>
            <ObjectList object={credential.credentialSubject} />
        </section>
        <footer>
            <Button label="Done" onClick={() => navigate("/home")} />
        </footer>
    {/if}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        position: relative;
        height: 100%;
    }

    header {
        margin-bottom: 5vh;
    }

    .header-wrapper {
        text-align: center;
        padding-bottom: 3vh;
        background-color: #6165e3;
    }

    header > i {
        font-size: 64px;
    }

    .header-wrapper.expired {
        background-color: black;
    }

    header {
        margin-left: auto;
        margin-right: auto;
        z-index: 1;
        height: fit-content;
        margin-bottom: 0;
    }

    header > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 1.9vh;
        line-height: 3.4vh;
        color: #fff;
        margin: 0;
    }

    section {
        margin: 0 7vw;
        z-index: 0;
    }

    footer {
        position: fixed;
        width: 100%;
        bottom: 0;
        z-index: 1;
    }

    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 3.5vh 3.5vh 0 3.5vh;
        z-index: 2;
    }
</style>
