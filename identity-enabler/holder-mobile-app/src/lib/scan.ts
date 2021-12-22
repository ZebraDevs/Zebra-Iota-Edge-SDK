import { navigate } from "svelte-routing";
import { playAudio } from "./ui/helpers";

// We delay playing the valid or invalid sound in order not to overlap
// with the scanning sound
const PLAY_DELAY = 400;

/**
 * Handles data string captured by Camera, DataWedge or Image selection.
 *
 * @param decodedText The decoded string to verify and persist.
 * @returns Promise.
 */
export async function handleScannerData(decodedText: string): Promise<void> {
    await playAudio("scanned");
    let credentialSubject;

    try {
        credentialSubject = JSON.parse(decodedText);
    } catch (err) {
        console.error(err);
        navigate("/invalid", { state: { message: "Invalid JSON" } });
        return;
    }

    if (typeof credentialSubject?.id !== "string" || !credentialSubject.id.startsWith("did:iota:")) {
        navigate("/invalid", { state: { message: "Missing subject ID" } });
        return;
    }

    setTimeout(async () => await playAudio("valid"), PLAY_DELAY);
    navigate("/devicecredential", { state: { credentialSubject } });
}
