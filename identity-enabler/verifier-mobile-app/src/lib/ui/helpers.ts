import { Plugins } from "@capacitor/core";
import { CredentialType } from "../helpers";

export async function showAlert(title: string, message: string) {
    const { Modals } = Plugins;
    await Modals.alert({ title, message });
}

export async function playAudio(sound: string) {
    const audio = new Audio();
    audio.onerror = () => {
        console.error("Audio Play Error", audio.error);
    };

    audio.src = `/audio/${sound}.wav`;

    await audio.play();
}

/**
 * Shorten a DID for display.
 *
 * @param did DID
 * @returns Short DID with ellipsis.
 */
export function shortenDID(did: string): string {
    return `${did.substring(0, 15)}...${did.substring(did.length - 6)}`;
}

export function getDateString(date: Date): string {
    return date.toLocaleDateString([...window.navigator.languages], {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

export function getTimeString(date: Date): string {
    return date.toLocaleTimeString([...window.navigator.languages], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

export const credentialDisplayMap = new Map<CredentialType, string>([
    [CredentialType.PERSONAL_INFO, "Personal Information"],
    [CredentialType.BLOOD_TEST, "Blood Test"],
    [CredentialType.HEALTH_TEST, "Health Test"],
    [CredentialType.DEVICE_ID, "Device ID"]
]);
