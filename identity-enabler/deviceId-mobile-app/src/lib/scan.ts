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
        loadingScreen.set();
        navigate("/invalid", { state: { scanSoundStart, message: "Invalid JSON" } });
        return;
    }

    if (!vp) {
        loadingScreen.set();
        navigate("/invalid", { state: { scanSoundStart } });
        return;
    }

    const identityService = ServiceFactory.get<IdentityService>("identity");
    const identity = await identityService.retrieveIdentity();

    const credentialSubjectId = vp.verifiableCredential?.credentialSubject?.id;
    if (credentialSubjectId === undefined) {
        loadingScreen.set();
        navigate("/invalid", { state: { scanSoundStart } });
        return;
    }

    const id = JSON.parse(identity.didDoc).id;
    if (id !== credentialSubjectId) {
        // check that this VP/VC is for the current device
        loadingScreen.set();
        navigate("/invalid", { state: { scanSoundStart, message: "Incorrect credential subject" } });
        return;
    }

    loadingScreen.set("Verifying Credential...");
    const verificationResult = await identityService.verifyVerifiablePresentation(vp);

    if (!verificationResult) {
        loadingScreen.set();
        navigate("/invalid", { state: { scanSoundStart } });
        return;
    }

    await playAudio("valid");
    await Plugins.Toast.show({
        text: "Credential verified!",
        position: "center"
    });
    loadingScreen.set();
    navigate("credential", { state: { credential: vp, save: true } });
}
