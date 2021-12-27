import { Plugins } from "@capacitor/core";
import { navigate } from "svelte-routing";
import { ServiceFactory } from "../factories/serviceFactory";
import type { IInvalidCredentialPageState } from "../models/types/IInvalidCredentialPageState";
import type { IdentityService } from "../services/identityService";
import { loadingScreen, updateStorage } from "./store";
import { playAudio } from "./ui/helpers";

/**
 * Handles data string captured by Camera, DataWedge or Image selection.
 *
 * @param decodedText The decoded string to verify and persist.
 * @returns Promise.
 */
export async function handleScannerData(decodedText: string): Promise<void> {
    loadingScreen.set("Validating Credential...");
    let vp;

    try {
        vp = JSON.parse(decodedText);
    } catch (e) {
        console.error(e);
        handleInvalid({ message: "Invalid JSON", detail: e.message });
        return;
    }

    if (typeof vp !== "object") {
        handleInvalid({ message: "No data" });
        return;
    }

    if (!vp.verifiableCredential) {
        handleInvalid({ message: "Missing verifiable credential" });
        return;
    }

    const credentialSubjectId = vp.verifiableCredential.credentialSubject?.id;
    if (!credentialSubjectId) {
        handleInvalid({ message: "Missing credential subject" });
        return;
    }

    loadingScreen.set("Verifying Credential...");
    const identityService = ServiceFactory.get<IdentityService>("identity");
    let verificationResult: boolean;
    try {
        verificationResult = await identityService.verifyVerifiablePresentation(vp);
    } catch (e) {
        console.error(e);
        handleInvalid({ message: "Verification error", detail: e.message });
        return;
    }

    if (!verificationResult) {
        handleInvalid();
        return;
    }

    const credential = vp.verifiableCredential;

    if (credential.expirationDate) {
        // only check expiry date if it is set
        const expiry = new Date(credential.expirationDate);
        if (expiry.getTime() < Date.now()) {
            handleInvalid({ message: "Expired credential" });
            return;
        }
    }

    await updateStorage("credentials", { [credential.type[1].split(/\b/)[0].toLowerCase()]: credential });
    loadingScreen.set();
    const { Toast } = Plugins;
    await Toast.show({
        text: "Credential verified!",
        position: "center"
    });
    playAudio("valid");
    navigate("/credential", { state: { credential } });
}

function handleInvalid(state?: IInvalidCredentialPageState): void {
    loadingScreen.set();
    navigate("/invalid", { state });
}
