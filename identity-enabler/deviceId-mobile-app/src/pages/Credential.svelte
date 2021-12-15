<script>
    import { navigate } from "svelte-routing";
    import { beforeUpdate } from "svelte";
    import { fly } from "svelte/transition";
    import { Plugins } from "@capacitor/core";
    import { updateStorage, modalStatus } from "../lib/store";
    import Button from "../components/Button.svelte";
    import ObjectList from "../components/ObjectList.svelte";
    import DevInfo from "./DevInfo.svelte";

    const { App } = Plugins;

    let showTutorial = false;

    const credential = window.history.state.credential;
    const save = window?.history?.state?.save;

    function share() {
        modalStatus.set({
            active: true,
            type: "share",
            props: { credential }
        });
    }

    async function onSaveCredential() {
        await updateStorage("credentials", {
            [credential.verifiableCredential.type[1].split(/\b/)[0].toLowerCase()]: credential
        });
        navigate("home");
    }

    function goBack() {
        navigate("home");
    }

    function onClickDev() {
        showTutorial = true;
    }

    beforeUpdate(() => {
        !showTutorial && App.removeAllListeners();
    });
</script>

<main transition:fly={{ x: 500, duration: 500 }}>
    {#if showTutorial}
        <DevInfo page="Credential" bind:showTutorial />
    {/if}

    {#if !showTutorial}
        <div class="header-wrapper">
            <div class="options-wrapper">
                <img src="../assets/chevron-left.svg" on:click={goBack} alt="chevron-left" />
                <img src="../assets/code.svg" on:click={onClickDev} alt="code" />
            </div>
            <header>
                <img class="credential-logo" src="../assets/zebra.svg" alt="credential-logo" />
                <p>ZEBRA TECHNOLOGIES</p>
                <p>Device DID</p>
            </header>
        </div>
        <section>
            <ObjectList object={credential.verifiableCredential.credentialSubject} />
        </section>
        <footer>
            {#if save}
                <Button style="background: #0099FF; color: white;" label="Save credential" onClick={onSaveCredential} />
            {:else}
                <Button style="background: #0099FF; color: white;" label="Share" onClick={"share"}>
                    <img src="../assets/share.png" alt="share" />
                </Button>
            {/if}
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
        background: linear-gradient(90deg, #00ffff 0%, #0099ff 100%);
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
        font-weight: 700;
        font-size: 2.6vh;
        line-height: 2.6vh;
        color: #fff;
        margin: 0;
    }

    header > p:nth-child(3) {
        text-transform: uppercase;
        margin: 1.7vh 0 0 0;
    }

    header > p:nth-child(2) {
        margin: 1.2vh 0 1.7vh 0;
        font-size: 1.7vh;
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

    .credential-logo {
        width: 10%;
    }

    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 3.5vh 3.5vh 0 3.5vh;
        z-index: 3;
    }
</style>
