import { v4 as uuidv4 } from "uuid";
import { writable, Writable } from "svelte/store";
import type { ICredentialSubject } from "src/models/types/ICredentialSubject";
import { CredentialType } from "src/models/types/CredentialType";
import type { IVerifiableCredential } from "src/models/types/IVerifiableCredential";
import type { IVerifiablePresentation } from "src/models/types/IVerifiablePresentation";
import type { IProof } from "src/models/types/IProof";

interface ExtendedProofDocument {
    created: string;
    creator: string;
    nonce: string;
    type: string;
    verificationMethod: string;
}

interface ProofDataModel {
    proof?: ExtendedProofDocument;
}

interface CredentialDataModel {
    "@context": string[];
    type: string[];
    issuer: string;
    issuanceDate: string;
    credentialSubject: object;
}

interface PresentationDataModel {
    "@context": string[];
    type: string[];
    holder?: string;
    verifiableCredential: VerifiableCredentialDataModel[];
}

type VerifiableCredentialDataModel = CredentialDataModel & ProofDataModel;
type VerifiablePresentationDataModel = PresentationDataModel & ProofDataModel;

/**
 * Parses serialised data
 *
 * @method parse
 *
 * @param {string} data
 * @returns {object}
 */
export function parse(data: string): any {
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
}

/**
 * Converts byte array to hex
 *
 * @method convertByteArrayToHex
 *
 * @param {Uint8Array} bytes
 *
 * @return {string}
 */
export function convertByteArrayToHex(bytes: Uint8Array): string {
    const hex = [];

    /* eslint-disable no-plusplus,no-bitwise */
    for (let i = 0; i < bytes.length; i++) {
        const current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xf).toString(16));
    }

    /* eslint-enable no-plusplus,no-bitwise */
    return hex.join("");
}

/**
 * Check whether an unknown value meets the proof format used in the identity enabler apps.
 *
 * @param payload The value to validate.
 * @returns Boolean type guard.
 */
export function isProof(payload: unknown): payload is IProof {
    const p = payload as IProof;

    return (
        typeof p === "object" &&
        typeof p.signatureValue === "string" &&
        typeof p.type === "string" &&
        typeof p.verificationMethod === "string"
    );
}

/**
 * Check whether an unknown value meets the VP format used in the identity enabler apps.
 *
 * @param payload The value to validate.
 * @returns Boolean type guard.
 */
export function isVerifiablePresentation(payload: unknown): payload is IVerifiablePresentation {
    const vp = payload as IVerifiablePresentation;

    return (
        typeof vp === "object" &&
        vp.type === "VerifiablePresentation" &&
        isVerifiableCredential(vp.verifiableCredential) &&
        isProof(vp.proof) &&
        typeof vp.holder === "string"
    );
}

/**
 * Check whether an unknown value meets the VC format used in the identity enabler apps.
 *
 * @param payload The value to validate.
 * @returns Boolean type guard.
 */
export function isVerifiableCredential(payload: unknown): payload is IVerifiableCredential {
    const vc = payload as IVerifiableCredential;

    return (
        typeof vc === "object" &&
        isProof(vc.proof) &&
        Array.isArray(vc.type) &&
        vc.type.length === 2 &&
        vc.type[0] === "VerifiableCredential" &&
        Object.values(CredentialType).includes(vc.type[1]) &&
        isCredentialSubject(vc.credentialSubject) &&
        typeof vc.issuanceDate === "string" &&
        typeof vc.expirationDate === "string" &&
        (typeof vc.issuer === "string" ||
            (typeof vc.issuer === "object" && typeof vc.issuer.id === "string" && typeof vc.issuer.name === "string"))
    );
}

/**
 * Check whether an unknown value meets the credentialSubject format used in the identity enabler apps.
 *
 * @param payload The value to validate.
 * @returns Boolean type guard.
 */
export function isCredentialSubject(payload: unknown): payload is ICredentialSubject {
    const cs = payload as ICredentialSubject;

    return typeof cs === "object" && typeof cs.id === "string";
}

/**
 * Updates application path
 *
 * @method goto
 *
 * @param {string} path
 *
 * @returns {void}
 */
export function goto(path: string, params?: { [key: string]: string }): void {
    window.location.hash = `${path}${params ? `?${new URLSearchParams(params).toString()}` : ""}`;
}

/**
 * Synchronous timeout
 *
 * @method delay
 *
 * @param {number} ms
 *
 * @returns {void}
 */
export function delay(ms: number): void {
    const startPoint = new Date().getTime();
    while (new Date().getTime() - startPoint <= ms);
}

/**
 * Persist a writable Svelte store to local storage
 */
export function persistent<T>(key: string, initialValue: T, saveTransformation?: (value: T) => T): Writable<T> {
    let value = initialValue;

    try {
        const json = localStorage.getItem(key);
        if (json) {
            value = JSON.parse(json);
        }
    } catch (err) {
        console.error(err);
    }

    const state = writable(value);

    state.subscribe(($value): void => {
        localStorage.setItem(key, JSON.stringify(saveTransformation ? saveTransformation($value) : $value));
    });

    return state;
}

export function generateRandomId(): string {
    return uuidv4();
}

export function flattenObj(ob) {
    // The object which contains the
    // final result
    let result = {};

    // loop through the object "ob"
    for (const i in ob) {
        // We check the type of the i using
        // typeof() function and recursively
        // call the function again
        if (typeof ob[i] === "object") {
            const temp = flattenObj(ob[i]);
            for (const j in temp) {
                // Store temp in result
                result[i + "." + j] = temp[j];
            }
        }

        // Else store ob[i] in result directly
        else {
            result[i] = ob[i];
        }
    }
    return result;
}

/**
 * fetch markdown text
 */
export async function getMarkdownContent(url): Promise<any> {
    return fetch(url).then(res => res.text());
}

/**
 * check if Credential is expired
 */
export function isExpired(credential: IVerifiableCredential): boolean {
    if (!credential.expirationDate) {
        return false;
    }

    return new Date(credential.expirationDate) < new Date();
}

/**
 * Waits for a certain number of milliseconds
 *
 * @method delay
 *
 * @param {number} milliseconds
 *
 * @returns {void}
 */
export async function wait(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
