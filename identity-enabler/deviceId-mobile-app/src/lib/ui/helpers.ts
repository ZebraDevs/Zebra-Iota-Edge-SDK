import { Plugins } from "@capacitor/core";
import { CredentialType } from "../../models/types/CredentialType";
import { flattenObj, wait } from "../helpers";

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

/**
 * Dispatch a custom multiClick event on an element when user clicks element multiple times in succession.
 * @param node The node to which this is attached.
 * @param opts Parameters to configure the multiClick event.
 */
export function multiClick(node: HTMLElement, opts?: { numClicks?: number; maxDelay?: number }): void {
    let clicks = 0;

    const handleClick = async (_: MouseEvent) => {
        const thisClicks = ++clicks;

        if (thisClicks === (opts?.numClicks ?? 2)) {
            node.dispatchEvent(new CustomEvent<void>("multiClick"));
            clicks = 0;
            return;
        }

        await wait(opts?.maxDelay ?? 500);

        if (thisClicks === clicks) {
            clicks = 0;
        }
    };

    node.addEventListener("click", handleClick);
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

/**
 * Transforms a credential into a list of key-value entries for display.
 * @param credential A VC object.
 */
export function flattenCredential(object: Record<string, any>): [string, string][] {
    if (typeof object !== "object") {
        return [];
    }

    if (!object.credentialSubject || !Array.isArray(object.type) || object.type[0] !== "VerifiableCredential") {
        // Arbitrary objects get flattened
        console.log(flattenObj(object));
        return Object.entries(flattenObj(object));
    }

    const sub = object.credentialSubject;

    switch (object.type[1]) {
        case CredentialType.HEALTH_TEST:
            return [
                ["Subject", sub.id],
                ["Test Description", sub.description],
                ["Test Code", `${sub.code.codingSystem}|${sub.code.codeValue}`],
                ["Result Description", sub.signDetected.description],
                ["Result Code", `${sub.signDetected.code.codingSystem}|${sub.signDetected.code.codeValue}`]
            ];
        case CredentialType.BLOOD_TEST:
            return [
                ["Subject", sub.id],
                ["Test Description", sub.description],
                ["Test Code", `${sub.code.codingSystem}|${sub.code.codeValue}`],
                ["Diagnosis Description", sub.usedToDiagnose.description],
                ["Diagnosis Code", `${sub.usedToDiagnose.code.codingSystem}|${sub.usedToDiagnose.code.codeValue}`]
            ];
        case CredentialType.PERSONAL_INFO:
            return [
                ["Subject", sub.id],
                ["Name", `${sub.givenName} "${sub.name}" ${sub.familyName}`],
                ["Gender", `${sub.gender[0].toUpperCase()}${sub.gender.substring(1)}`],
                ["Birth date", getDateString(new Date(sub.birthDate))],
                [
                    "Address",
                    `${sub.address.streetAddress}\n${sub.address.addressLocality}\n${sub.address.addressRegion} ${sub.address.postalCode}\n${sub.address.addressCountry}`
                ],
                ["Email", sub.email],
                ["Telephone", sub.telephone]
            ];
        case CredentialType.DEVICE_ID:
            return [
                ["Subject", sub.id],
                ["Name", sub.name],
                ["Identifier", sub.identifier],
                ["Manufacturer", sub.model.manufacturerName],
                ["Model", sub.model.modelName],
                ["OS Version", sub.osVersion]
            ];
        default:
            return Object.entries(flattenObj(sub));
    }
}
