import { Plugins } from "@capacitor/core";
import type { IBloodCredential } from "src/models/types/IBloodCredential";
import type { ICredentialSubject } from "src/models/types/ICredentialSubject";
import type { IDeviceCredential } from "src/models/types/IDeviceCredential";
import type { IHealthCredential } from "src/models/types/IHealthCredential";
import type { IPersonalCredential } from "src/models/types/IPersonalCredential";
import type { IVerifiableCredential } from "src/models/types/IVerifiableCredential";
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

/**
 * Transforms a credential into an object of key-value entries for display.
 * @param vc A VC object.
 */
export function flattenCredential(vc: IVerifiableCredential): { [key: string]: string } {
    switch (vc.type[1]) {
        case CredentialType.HEALTH_TEST: {
            const credentialSubject = vc.credentialSubject as ICredentialSubject & IHealthCredential;
            return {
                Subject: credentialSubject.id,
                "Test Description": credentialSubject.description,
                "Test Code": `${credentialSubject.code.codingSystem}|${credentialSubject.code.codeValue}`,
                "Result Description": credentialSubject.signDetected.description,
                "Result Code": `${credentialSubject.signDetected.code.codingSystem}|${credentialSubject.signDetected.code.codeValue}`
            };
        }
        case CredentialType.BLOOD_TEST: {
            const credentialSubject = vc.credentialSubject as ICredentialSubject & IBloodCredential;
            return {
                Subject: credentialSubject.id,
                "Test Description": credentialSubject.description,
                "Test Code": `${credentialSubject.code.codingSystem}|${credentialSubject.code.codeValue}`,
                "Diagnosis Description": credentialSubject.usedToDiagnose.description,
                "Diagnosis Code": `${credentialSubject.usedToDiagnose.code.codingSystem}|${credentialSubject.usedToDiagnose.code.codeValue}`
            };
        }
        case CredentialType.PERSONAL_INFO: {
            const credentialSubject = vc.credentialSubject as ICredentialSubject & IPersonalCredential;
            return {
                Subject: credentialSubject.id,
                Name: `${credentialSubject.givenName} "${credentialSubject.name}" ${credentialSubject.familyName}`,
                Gender: `${credentialSubject.gender[0].toUpperCase()}${credentialSubject.gender.substring(1)}`,
                "Birth date": getDateString(new Date(credentialSubject.birthDate)),
                Address: `${credentialSubject.address.streetAddress}\n${credentialSubject.address.addressLocality}\n${credentialSubject.address.addressRegion} ${credentialSubject.address.postalCode}\n${credentialSubject.address.addressCountry}`,
                Email: credentialSubject.email,
                Telephone: credentialSubject.telephone
            };
        }
        case CredentialType.DEVICE_ID: {
            const credentialSubject = vc.credentialSubject as ICredentialSubject & IDeviceCredential;
            return {
                Subject: credentialSubject.id,
                Name: credentialSubject.name,
                Identifier: credentialSubject.identifier,
                Manufacturer: credentialSubject.model.manufacturerName,
                Model: credentialSubject.model.modelName,
                "OS Version": credentialSubject.osVersion
            };
        }
        default:
            return flattenObj(vc.credentialSubject);
    }
}

/**
 * Transforms a claim into an object of key-value entries for display.
 * @param object An object.
 */
export function flattenClaim(claim: ICredentialSubject & IDeviceCredential): { [key: string]: string } {
    return {
        Subject: claim.id,
        Name: claim.name,
        Identifier: claim.identifier,
        Manufacturer: claim.model.manufacturerName,
        Model: claim.model.modelName,
        "OS Version": claim.osVersion
    };
}
