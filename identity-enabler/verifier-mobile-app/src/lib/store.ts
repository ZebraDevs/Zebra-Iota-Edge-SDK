import type { IVerifiableCredential } from "src/models/types/IVerifiableCredential";
import { writable } from "svelte/store";
import { CredentialType } from "../models/types/CredentialType";
import { persistent } from "./helpers";

const credentialsInitialState = () => ({
    [CredentialType.PERSONAL_INFO]: null,
    [CredentialType.HEALTH_TEST]: null,
    [CredentialType.BLOOD_TEST]: null,
    [CredentialType.DEVICE_ID]: null
});
type PersistedCredentials = Record<CredentialType, IVerifiableCredential | null>;
export const credentials = persistent<PersistedCredentials>("credentials", credentialsInitialState());

export const loadingScreen = writable<string | void>();

const firstLaunchInitialState = () => true;
export const firstLaunch = persistent<boolean>("firstLaunch", firstLaunchInitialState());

export function resetAllStores() {
    credentials.set(credentialsInitialState());
    loadingScreen.set();
    firstLaunch.set(firstLaunchInitialState());
}
