import { writable } from "svelte/store";
import { persistent } from "./helpers";
import { CredentialType } from "../models/types/CredentialType";

const hasSetupAccountInitialState = () => false;
/**
 * Determines if use has completed onboarding
 */
export const hasSetupAccount = persistent<boolean>("hasSetupAccount", hasSetupAccountInitialState());

const credentialsInitialState = () => ({ [CredentialType.DEVICE_ID]: null });
export const credentials = persistent<Record<string, unknown | null>>("credentials", credentialsInitialState());

const accountInitialState = () => null;
export const account = persistent<{ name: string } | null>("account", accountInitialState());

/**
 * Modal status
 */
export type ModalStatus = {
    active: boolean;
    type: "share" | "code" | null;
    props?: any;
};

const modalStatusInitialState = () => ({ active: false, type: null, props: null });
export const modalStatus = writable<ModalStatus>(modalStatusInitialState());

export const loadingScreen = writable<string | void>();

export function resetAllStores() {
    hasSetupAccount.set(hasSetupAccountInitialState());
    credentials.set(credentialsInitialState());
    account.set(accountInitialState());
    modalStatus.set(modalStatusInitialState());
    loadingScreen.set();
}
