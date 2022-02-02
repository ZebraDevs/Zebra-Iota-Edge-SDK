import { navigate } from "svelte-routing";
import type { IInvalidCredentialPageState } from "../models/types/IInvalidCredentialPageState";
import { loadingScreen } from "./store";
import { playAudio } from "./ui/helpers";

// We delay playing the valid or invalid sound in order not to overlap
// with the scanning sound
const PLAY_DELAY = 400;

/**
 * Handles data string captured by Camera, DataWedge or Image selection.
 *
 * @param decodedText The decoded string to verify and persist.
 * @param method How the code was decoded.
 * @returns Promise.
 */
export async function handleScannerData(decodedText: string, method: "Camera" | "File" | "DataWedge"): Promise<void> {
    loadingScreen.set("Validating Claims...");
    let scanSoundStart: number;

    if (method !== "DataWedge") {
        await playAudio("scanned");
        scanSoundStart = Date.now();
    }

    let credentialSubject;

    try {
        credentialSubject = JSON.parse(decodedText);
    } catch (err) {
        console.error(err);
        handleInvalid({ message: "Invalid JSON", detail: err.message, scanSoundStart });
        return;
    }

    if (typeof credentialSubject !== "object") {
        handleInvalid({ message: "No data", scanSoundStart });
        return;
    }

    if (typeof credentialSubject.id !== "string" || !credentialSubject.id.startsWith("did:iota:")) {
        handleInvalid({ message: "Missing subject ID", scanSoundStart });
        return;
    }

    loadingScreen.set(undefined);
    setTimeout(async () => playAudio("valid"), PLAY_DELAY);
    navigate("/devicecredential", { state: { credentialSubject } });
}

function handleInvalid(state?: IInvalidCredentialPageState): void {
    loadingScreen.set(undefined);
    navigate("/invalid", { state });
}
