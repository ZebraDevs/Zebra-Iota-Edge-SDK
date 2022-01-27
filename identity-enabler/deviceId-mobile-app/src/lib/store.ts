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
    type: "share" | null;
    props?: any;
};

const modalStatusInitialState = () => ({ active: false, type: null, props: null });
export const modalStatus = writable<ModalStatus>(modalStatusInitialState());

export const loadingScreen = writable<string | void>();

const codeImageCacheInitialState = () => ({});
export const codeImageCache = writable<Record<string, { dataUrl: string; hits: number }>>(codeImageCacheInitialState());
codeImageCache.subscribe(cache => {
    // Apply an LFU eviction policy.
    const keys = Object.keys(cache);
    if (keys.length <= 10) {
        return;
    }

    keys.sort((a: string, b: string) => cache[a].hits - cache[b].hits);

    delete cache[keys[0]];
    codeImageCache.set(cache);
});

export function resetAllStores() {
    hasSetupAccount.set(hasSetupAccountInitialState());
    credentials.set(credentialsInitialState());
    account.set(accountInitialState());
    modalStatus.set(modalStatusInitialState());
    loadingScreen.set();
    codeImageCache.set(codeImageCacheInitialState());
}
