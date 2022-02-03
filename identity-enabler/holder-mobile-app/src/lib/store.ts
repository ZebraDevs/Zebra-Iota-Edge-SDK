import type { IVerifiableCredential } from "src/models/types/IVerifiableCredential";
import { writable } from "svelte/store";
import { CredentialType } from "../models/types/CredentialType";
import { persistent } from "./helpers";

const hasSetupAccountInitialState = () => false;
/**
 * Determines if user has completed onboarding
 */
export const hasSetupAccount = persistent<boolean>("hasSetupAccount", hasSetupAccountInitialState());

const credentialsInitialState = () => ({
    [CredentialType.PERSONAL_INFO]: null,
    [CredentialType.HEALTH_TEST]: null,
    [CredentialType.BLOOD_TEST]: null
});
type PersistedCredentials = Record<Exclude<CredentialType, CredentialType.DEVICE_ID>, IVerifiableCredential | null>;
export const credentials = persistent<PersistedCredentials>("credentials", credentialsInitialState());

const accountInitialState = () => null;
export const account = persistent<{ name: string } | null>("account", accountInitialState());

/**
 * Modal status
 */
export type ModalStatus = {
    active: boolean;
    type: "share" | null;
    props?: any;
};

const modalStatusInitialState = () => ({ active: false, type: null, props: null });
export const modalStatus = writable<ModalStatus>(modalStatusInitialState());

const landingIndexInitialState = () => 0;
export const landingIndex = writable<number>(landingIndexInitialState());

export const loadingScreen = writable<string | void>();

export function resetAllStores() {
    hasSetupAccount.set(hasSetupAccountInitialState());
    credentials.set(credentialsInitialState());
    account.set(accountInitialState());
    modalStatus.set(modalStatusInitialState());
    landingIndex.set(landingIndexInitialState());
    loadingScreen.set();
}
