<script lang="ts">
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { fly } from "svelte/transition";
    import { Plugins } from "@capacitor/core";
    import bwipjs from "bwip-js";
    import { ServiceFactory } from "../factories/serviceFactory";
    import Button from "../components/Button.svelte";
    import { showAlert, multiClick } from "../lib/ui/helpers";
    import { loadingScreen, modalStatus } from "../lib/store";
    import type { IdentityService } from "../services/identityService";

    const { App, Device } = Plugins;

    const identityService = ServiceFactory.get<IdentityService>("identity");
    const name = window.history.state.name;
    let credentialSubject;

    onMount(() => App.addListener("backButton", goBack).remove);
    onMount(async () => {
        loadingScreen.set("Generating QR Code...");

        try {
            const storedIdentity = await identityService.retrieveIdentity();
            const { uuid, model, manufacturer, osVersion } = await Device.getInfo();
            credentialSubject = {
                id: storedIdentity.doc.id,
                "@context": ["https://schema.org", "https://smartdatamodels.org/context.jsonld"],
                type: ["Product", "Device"],
                identifier: `urn:uuid:${uuid}`,
                name,
                model: {
                    type: "DeviceModel",
                    modelName: model,
                    manufacturerName: manufacturer
                },
                osVersion
            };
            await createMatrix(JSON.stringify(credentialSubject));
        } catch (err) {
            console.error(err);
            await showAlert("Error", err.message);
        }

        loadingScreen.set();
    });

    async function createMatrix(content: string) {
        try {
            // The return value is the canvas element
            bwipjs.toCanvas("device-claims", {
                bcid: "qrcode",
                text: content,
                height: 50,
                width: 50,
                backgroundcolor: "ffffff"
            });
        } catch (e) {
            console.error(e);
        }
    }

    function goBack() {
        if ($modalStatus.active) {
            modalStatus.set({ active: false, type: null });
            return;
        }

        window.history.back();
    }

    function requestCredential() {
        navigate("/requestcredential");
    }

    function showJSON() {
        modalStatus.set({
            active: true,
            type: "code",
            props: { code: JSON.stringify(credentialSubject, null, 2) }
        });
    }
</script>

<main>
    <div class="wrapper" transition:fly={{ x: 500, duration: 500 }}>
        <header>
            <i on:click={goBack} class="icon-chevron" />
            <p>Request Device DID credential</p>
        </header>
        <div class="subheader">
            <p>Share device claims with the Organization ID holder app</p>
        </div>
        <div class="qr-wrapper">
            <canvas id="device-claims" use:multiClick on:multiClick={showJSON} />
        </div>
        <div class="info">
            <pre>Scan this QR code with the Holder app
                to continue</pre>
        </div>
        <footer>
            <Button
                style="height: 64px;"
                loadingText={"Generating identity"}
                label="Next"
                onClick={requestCredential}
            />
        </footer>
    </div>
</main>

<style>
    main {
        height: 100%;
        flex-direction: column;
        display: flex;
        flex: 1;
    }

    header {
        background-color: #aee693;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 72px;
        padding: 0 2.6vh;
    }

    header > p {
        flex-grow: 1;
        text-align: center;
        white-space: nowrap;
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 1.2em;
        margin: 0;
    }

    .qr-wrapper {
        height: fit-content;
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin: 7vh 0 9vh 0;
    }

    .wrapper {
        text-align: center;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }

    .info > pre {
        font-family: "Proxima Nova", sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 2.08vh;
        line-height: 3.3vh;
        color: #6f7a8d;
        text-align: center;
        padding: 0px 3vw;
        white-space: pre-line;
        margin-top: 8.2vh;
    }

    .subheader > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 700;
        font-size: 2.6vh;
        line-height: 3.2vh;
        margin: 6.5vh 3.6vh !important;
        white-space: pre-line;
        text-align: center;
        color: #051923;
    }

    footer {
        width: 100%;
        position: absolute;
        bottom: 0;
    }
</style>
