import { writable } from "svelte/store";
import { persistent } from "./helpers";

const hasSetupAccountInitialState = false;
/**
 * Determines if use has completed onboarding
 */
export const hasSetupAccount = persistent<boolean>("hasSetupAccount", hasSetupAccountInitialState);

const credentialsInitialState = { device: "" };
export const credentials = persistent<{ device: string }>("credentials", credentialsInitialState);

const accountInitialState = null;
export const account = persistent<{ name: string } | null>("account", accountInitialState);

/**
 * Modal status
 */
export type ModalStatus = {
    active: boolean;
    type: "share" | "json" | null;
    props?: any;
};

const modalStatusInitialState = { active: false, type: null, props: null };
export const modalStatus = writable<ModalStatus>(modalStatusInitialState);

export const loadingScreen = writable<string | void>();

export function resetAllStores() {
    hasSetupAccount.set(hasSetupAccountInitialState);
    credentials.set(credentialsInitialState);
    account.set(accountInitialState);
    modalStatus.set(modalStatusInitialState);
    loadingScreen.set();
}
