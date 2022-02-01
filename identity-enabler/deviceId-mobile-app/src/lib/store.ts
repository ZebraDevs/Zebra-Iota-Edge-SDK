import { writable } from "svelte/store";
import { CredentialType } from "../models/types/CredentialType";
import { persistent } from "./helpers";

const hasSetupAccountInitialState = () => false;
/**
 * Determines if use has completed onboarding.
 */
export const hasSetupAccount = persistent<boolean>("hasSetupAccount", hasSetupAccountInitialState());

const credentialsInitialState = () => ({ [CredentialType.DeviceID]: null });
export const credentials = persistent<Record<string, unknown | null>>("credentials", credentialsInitialState());

const accountInitialState = () => null;
export const account = persistent<{ name: string } | null>("account", accountInitialState());

/**
 * Modal status.
 */
export interface ModalStatus<T = unknown> {
    active: boolean;
    type: "share" | null;
    props?: T;
}

const modalStatusInitialState = () => ({ active: false, type: null, props: null });
export const modalStatus = writable<ModalStatus>(modalStatusInitialState());

export const loadingScreen = writable<string | null>();

export function resetAllStores() {
    hasSetupAccount.set(hasSetupAccountInitialState());
    credentials.set(credentialsInitialState());
    account.set(accountInitialState());
    modalStatus.set(modalStatusInitialState());
    loadingScreen.set(null);
}
