<script>
    import { Plugins } from "@capacitor/core";
    import {onMount} from "svelte";
    import { credentials } from "../lib/store";
    import Button from "../components/Button.svelte";
    import ObjectList from "../components/ObjectList.svelte";
    import { isExpired } from "../lib/helpers";
    import { navigate } from "svelte-routing";
    import CredentialHeader from "../components/CredentialHeader.svelte";
    import { flattenCredential } from "../lib/ui/helpers";
    import PageTransition from "../components/PageTransition.svelte";

    const { Modals, App } = Plugins;

    let credential = window.history.state.credential;
    let expired = isExpired(credential);
    let backwards = false;

    onMount(() => App.addListener("backButton", onBack).remove);

    function onDone() {
        navigate("/home");
    }

    async function onDelete() {
        let confirmRet = await Modals.confirm({
            title: "Delete credential",
            message: "Are you sure you want to delete the credential?"
        });
        if (confirmRet.value) {
            credentials.update(current => {
                current[credential.type[1]] = null;
                return current;
            });
            // ensure impossible to navigate back to a deleted credential page
            navigate("/home", { replace: true });
        }
    }

    function onClickDev() {
        navigate("/tutorial");
    }

    function onBack() {
        backwards = true;
        window.history.back();
    }
</script>

<PageTransition {backwards}>
    <main>
        <div class="header-wrapper" class:expired>
            <div class="options-wrapper">
                <i on:click={onDelete} class="icon-remove" />
                <i on:click={onClickDev} class="icon-code" />
            </div>
            <header>
                <CredentialHeader {credential} />
            </header>
        </div>
        <section>
            <ObjectList entries={flattenCredential(credential)} />
        </section>
        <footer>
            <Button label="Done" onClick={onDone} />
        </footer>
    </main>
</PageTransition>

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

    .header-wrapper.expired {
        background-color: black;
    }

    header {
        margin-left: auto;
        margin-right: auto;
        height: fit-content;
        margin-bottom: 0;
    }

    section {
        margin: 0 7vw;
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
    }
</style>
