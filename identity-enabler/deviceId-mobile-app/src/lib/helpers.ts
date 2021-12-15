import { v4 as uuidv4 } from "uuid";
import { writable, Writable } from "svelte/store";

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

export function isVerifiablePresentation(
    payload: VerifiablePresentationDataModel | unknown
): payload is VerifiablePresentationDataModel {
    return !!(payload as VerifiablePresentationDataModel).verifiableCredential?.length;
}

export function isVerifiableCredential(
    payload: VerifiableCredentialDataModel | unknown
): payload is VerifiableCredentialDataModel {
    return !!(payload as VerifiableCredentialDataModel).credentialSubject;
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
export function isExpired(date: Date): Boolean {
    const expiryDate = addDaysToDate(date, 30);
    const today = new Date();

    if (today.getTime() > expiryDate.getTime()) {
        return true;
    } else {
        return false;
    }
}

/**
 * add number of days to a date
 */
export function addDaysToDate(date: Date, days: number): Date {
    let res = new Date(date);
    res.setDate(res.getDate() + days);
    return res;
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
export function wait(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
