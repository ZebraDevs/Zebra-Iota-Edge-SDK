import { navigate } from "svelte-routing";
import { wait } from "./helpers";
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
        await handleError("Invalid JSON", scanSoundStart);
        return;
    }

    if (typeof credentialSubject?.id !== "string" || !credentialSubject.id.startsWith("did:iota:")) {
        await handleError("Missing subject ID", scanSoundStart);
        return;
    }

    loadingScreen.set();
    setTimeout(async () => await playAudio("valid"), PLAY_DELAY);
    navigate("/devicecredential", { state: { credentialSubject } });
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
