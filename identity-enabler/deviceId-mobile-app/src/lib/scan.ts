import { navigate } from "svelte-routing";
import { ServiceFactory } from "../factories/serviceFactory";
import type { IdentityService } from "../services/identityService";
import { loadingScreen } from "./store";
import { playAudio } from "./ui/helpers";
import { Plugins } from "@capacitor/core";

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

    if (typeof vp !== "object") {
        await handleError("No data", scanSoundStart);
        return;
    }

    if (!vp.verifiableCredential) {
        await handleError("Missing verifiable credential", scanSoundStart);
        return;
    }

    const credentialSubjectId = vp.verifiableCredential.credentialSubject?.id;
    if (!credentialSubjectId) {
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
    let verificationResult: boolean;
    try {
        verificationResult = await identityService.verifyVerifiablePresentation(vp);
    } catch (e) {
        console.error(e);
        await handleError(e.message, scanSoundStart);
        return;
    }

    if (!verificationResult) {
        await handleError("Invalid credential", scanSoundStart);
        return;
    }

    if (vp.verifiableCredential.expirationDate) {
        // only check expiry date if it is set
        const expiry = new Date(vp.verifiableCredential.expirationDate);
        if (expiry.getTime() < Date.now()) {
            await handleError("Expired credential", scanSoundStart);
            return;
        }
    }

    loadingScreen.set();
    await playAudio("valid");
    await Plugins.Toast.show({
        text: "Credential verified!",
        position: "center"
    });
    navigate("/credential", { state: { vp, save: true } });
}

async function handleError(message: string, scanSoundStart?: number): Promise<void> {
    loadingScreen.set();
    navigate("/invalid", { state: { scanSoundStart, message } });
}
