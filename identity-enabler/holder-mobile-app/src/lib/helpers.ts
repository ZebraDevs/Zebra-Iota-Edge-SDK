import { writable, Writable } from "svelte/store";
import { RANDOM_USER_DATA_API_URL } from "../config";

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
 * Random user data.
 */
export interface RandomUserData {
    location: {
        street: {
            number: number;
            name: string;
        };
        city: string;
        state: string;
        country: string;
        postcode: number;
    };
    name: {
        first: string;
        last: string;
    };
    phone: string;
    dob: {
        date: string;
        age: string;
    };
    email: string;
    id: {
        value: string;
    };
    gender: string;
}

/**
 * Random user data response.
 */
export interface RandomUserDataResponse {
    results: RandomUserData[];
}

/**
 * Gets random user data.
 *
 * @returns Random user data.
 */
export async function getRandomUserData(): Promise<RandomUserData> {
    const res = await fetch(RANDOM_USER_DATA_API_URL);
    const userDataRes: RandomUserDataResponse = await res.json();
    return userDataRes.results[0];
}

export function isVerifiablePresentation(
    payload: VerifiablePresentationDataModel | unknown
): payload is VerifiablePresentationDataModel {
    return Boolean((payload as VerifiablePresentationDataModel).verifiableCredential?.length);
}

export function isVerifiableCredential(
    payload: VerifiableCredentialDataModel | unknown
): payload is VerifiableCredentialDataModel {
    return Boolean((payload as VerifiableCredentialDataModel).credentialSubject);
}

/**
 * Persist a writable Svelte store to local storage.
 *
 * @param key The key at which to store the value.
 * @param initialValue The initial value of the store.
 * @param saveTransformation A transformation to apply prior to every write.
 * @returns A writable Svelte store.
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

export function flattenObj(ob) {
    // The object which contains the
    // final result
    const result = {};

    // loop through the object "ob"
    for (const i in ob) {
        // We check the type of the i using
        // typeof() function and recursively
        // call the function again
        if (typeof ob[i] === "object") {
            const temp = flattenObj(ob[i]);
            for (const j in temp) {
                // Store temp in result
                result[`${i}.${j}`] = temp[j];
            }
        } else {
            // Else store ob[i] in result directly
            result[i] = ob[i];
        }
    }
    return result;
}

/**
 * Waits for a certain number of milliseconds.
 *
 * @param milliseconds Milliseconds to wait.
 * @returns Promise that resolves after the wait duration.
 */
export async function wait(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export function generateRandomNumericString(charLength: number): string {
    const alphabet = "0123456789";
    let str = "";
    for (let i = 0; i < charLength; i++) {
        const chIdx = Math.floor(Math.random() * alphabet.length);
        str += alphabet[chIdx];
    }
    return str;
}
