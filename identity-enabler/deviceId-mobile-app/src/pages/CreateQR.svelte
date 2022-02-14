<script lang="ts">
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { Plugins } from "@capacitor/core";
    import bwipjs from "bwip-js";
    import { ServiceFactory } from "../factories/serviceFactory";
    import Button from "../components/Button.svelte";
    import { showAlert, multiClick } from "../lib/ui/helpers";
    import { loadingScreen } from "../lib/store";
    import type { IdentityService } from "../services/identityService";
    import { Page } from "@zebra-iota-edge-sdk/common";

    const { Device } = Plugins;

    const identityService = ServiceFactory.get<IdentityService>("identity");
    const name = window.history.state.name;
    let credentialSubject;

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

        loadingScreen.set("");
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

    function requestCredential() {
        navigate("/requestcredential");
    }

    function showJSON() {
        navigate("/code", { state: { code: JSON.stringify(credentialSubject, null, 2) } });
    }
</script>

<Page>
    <div slot="header" class="options-wrapper">
        <i on:click|once={() => window.history.back()} class="icon-chevron" />
        <h2>Request Device DID credential</h2>
        <div class="side" />
    </div>

    <div slot="content" class="wrapper">
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
    </div>

    <svelte:fragment slot="footer">
        <Button label="Next" onClick={requestCredential} />
    </svelte:fragment>
</Page>

<style>
    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 1.5rem;
    }

    h2 {
        margin: 0 0.5rem;
        align-self: center;
    }

    .options-wrapper > .side {
        flex: 1;
    }

    .wrapper {
        text-align: center;
        padding: 1.5rem;
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

    .info > pre {
        font-family: "Proxima Nova", sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 2.08vh;
        line-height: 3.3vh;
        color: var(--black-60);
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
    }
</style>
