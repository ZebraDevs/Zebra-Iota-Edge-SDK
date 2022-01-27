import { Plugins } from "@capacitor/core";
import { CredentialType } from "../../models/types/CredentialType";
import { flattenObj } from "../helpers";

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

/**
 * Transforms a credential into an object of key-value entries for display.
 * @param object A VC object.
 */
export function flattenCredential(object: Record<string, any>): { [key: string]: string } {
    if (typeof object !== "object") {
        return {};
    }

    const { credentialSubject, type } = object;

    if (!credentialSubject || !Array.isArray(type) || type.length < 2 || !type.includes("VerifiableCredential")) {
        // Arbitrary objects get flattened
        return flattenObj(object);
    }

    switch (type[1]) {
        case CredentialType.HEALTH_TEST:
            return {
                Subject: credentialSubject.id,
                "Test Description": credentialSubject.description,
                "Test Code": `${credentialSubject.code.codingSystem}|${credentialSubject.code.codeValue}`,
                "Result Description": credentialSubject.signDetected.description,
                "Result Code": `${credentialSubject.signDetected.code.codingSystem}|${credentialSubject.signDetected.code.codeValue}`
            };
        case CredentialType.BLOOD_TEST:
            return {
                Subject: credentialSubject.id,
                "Test Description": credentialSubject.description,
                "Test Code": `${credentialSubject.code.codingSystem}|${credentialSubject.code.codeValue}`,
                "Diagnosis Description": credentialSubject.usedToDiagnose.description,
                "Diagnosis Code": `${credentialSubject.usedToDiagnose.code.codingSystem}|${credentialSubject.usedToDiagnose.code.codeValue}`
            };
        case CredentialType.PERSONAL_INFO:
            return {
                Subject: credentialSubject.id,
                Name: `${credentialSubject.givenName} "${credentialSubject.name}" ${credentialSubject.familyName}`,
                Gender: `${credentialSubject.gender[0].toUpperCase()}${credentialSubject.gender.substring(1)}`,
                "Birth date": getDateString(new Date(credentialSubject.birthDate)),
                Address: `${credentialSubject.address.streetAddress}\n${credentialSubject.address.addressLocality}\n${credentialSubject.address.addressRegion} ${credentialSubject.address.postalCode}\n${credentialSubject.address.addressCountry}`,
                Email: credentialSubject.email,
                Telephone: credentialSubject.telephone
            };
        case CredentialType.DEVICE_ID:
            return {
                Subject: credentialSubject.id,
                Name: credentialSubject.name,
                Identifier: credentialSubject.identifier,
                Manufacturer: credentialSubject.model.manufacturerName,
                Model: credentialSubject.model.modelName,
                "OS Version": credentialSubject.osVersion
            };
        default:
            return flattenObj(credentialSubject);
    }
}
