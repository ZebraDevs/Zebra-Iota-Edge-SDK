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

const landingIndexInitialState = () => 0;
export const landingIndex = writable<number>(landingIndexInitialState());

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
    landingIndex.set(landingIndexInitialState());
    loadingScreen.set();
    codeImageCache.set(codeImageCacheInitialState());
}
