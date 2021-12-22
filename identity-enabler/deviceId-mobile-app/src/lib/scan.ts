import { navigate } from "svelte-routing";
import { ServiceFactory } from "../factories/serviceFactory";
import type { IdentityService } from "../services/identityService";
import { loadingScreen } from "./store";
import { playAudio } from "./ui/helpers";
import { Plugins } from "@capacitor/core";
import { wait } from "./helpers";

/**
 * Handles data string captured by Camera, DataWedge or Image selection.
 *
 * @param decodedText The decoded string to verify and persist.
 * @param method How the code was decoded.
 * @returns Promise.
 */
export async function handleScannerData(decodedText: string, method: "Camera" | "File" | "DataWedge"): Promise<void> {
    loadingScreen.set("Validating Credential...");
    let scanSoundStart: number;

    if (method !== "DataWedge") {
        await playAudio("scanned");
        scanSoundStart = Date.now();
    }

    let vp;
    try {
        vp = JSON.parse(decodedText);
    } catch (e) {
        console.error(e);
        await handleError("Invalid JSON", scanSoundStart);
        return;
    }

    if (!vp) {
        await handleError("No data", scanSoundStart);
        return;
    }

    const credentialSubjectId = vp.verifiableCredential?.credentialSubject?.id;
    if (credentialSubjectId === undefined) {
        await handleError("Missing credential subject", scanSoundStart);
        return;
    }

    const identityService = ServiceFactory.get<IdentityService>("identity");
    const identity = await identityService.retrieveIdentity();
    const id = JSON.parse(identity.didDoc).id;
    if (id !== credentialSubjectId) {
        // check that this VP/VC is for the current device
        await handleError("Incorrect credential subject", scanSoundStart);
        return;
    }

    loadingScreen.set("Verifying Credential...");
    const verificationResult = await identityService.verifyVerifiablePresentation(vp);

    if (!verificationResult) {
        await handleError("Invalid credential", scanSoundStart);
        return;
    }

    loadingScreen.set();
    await playAudio("valid");
    await Plugins.Toast.show({
        text: "Credential verified!",
        position: "center"
    });
    navigate("credential", { state: { credential: vp, save: true } });
}

async function handleError(message: string, scanSoundStart?: number) {
    loadingScreen.set();

    if (window.location.pathname === "/invalid") {
        // workaround to ensure InvalidCredentialPage remounts
        window.history.back();
        await wait(550);
    }

    navigate("/invalid", { state: { scanSoundStart, message } });
}
