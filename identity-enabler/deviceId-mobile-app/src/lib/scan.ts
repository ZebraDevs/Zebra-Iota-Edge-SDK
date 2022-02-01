import { Plugins } from "@capacitor/core";
import { navigate } from "svelte-routing";
import { ServiceFactory } from "../factories/serviceFactory";
import type { IInvalidCredentialPageState } from "../models/types/IInvalidCredentialPageState";
import type { IdentityService } from "../services/identityService";
import { isExpired } from "./helpers";
import { loadingScreen } from "./store";
import { playAudio } from "./ui/helpers";

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
        handleInvalid({ message: "Invalid JSON", detail: e.message, scanSoundStart });
        return;
    }

    if (typeof vp !== "object") {
        handleInvalid({ message: "No data", scanSoundStart });
        return;
    }

    if (!vp.verifiableCredential) {
        handleInvalid({ message: "Missing verifiable credential", scanSoundStart });
        return;
    }

    const credentialSubjectId = vp.verifiableCredential.credentialSubject?.id;
    if (!credentialSubjectId) {
        handleInvalid({ message: "Missing credential subject", scanSoundStart });
        return;
    }

    const identityService = ServiceFactory.get<IdentityService>("identity");
    const identity = await identityService.retrieveIdentity();
    const id = JSON.parse(identity.didDoc).id;
    if (id !== credentialSubjectId) {
        // check that this VP/VC is for the current device
        handleInvalid({ message: "Incorrect credential subject", scanSoundStart });
        return;
    }

    loadingScreen.set("Verifying Credential...");
    let verificationResult: boolean;
    try {
        verificationResult = await identityService.verifyVerifiablePresentation(decodedText);
    } catch (e) {
        console.error(e);
        handleInvalid({ message: "Verification error", detail: e.message, scanSoundStart });
        return;
    }

    if (!verificationResult) {
        handleInvalid({ scanSoundStart });
        return;
    }

    if (isExpired(vp.verifiableCredential)) {
        handleInvalid({ message: "Expired credential", scanSoundStart });
        return;
    }

    loadingScreen.set(null);
    await playAudio("valid");
    await Plugins.Toast.show({
        text: "Credential verified!",
        position: "center"
    });
    navigate("/credential", { state: { vp, save: true } });
}

function handleInvalid(state?: IInvalidCredentialPageState): void {
    loadingScreen.set(null);
    navigate("/invalid", { state });
}
