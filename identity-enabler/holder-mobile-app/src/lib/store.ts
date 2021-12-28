import { writable } from "svelte/store";
import { persistent } from "./helpers";

export const updateStorage = async (key, value) => {
    try {
        let stored = {};
        let updated = {};
        if (localStorage.getItem(key)) {
            stored = JSON.parse(await localStorage.getItem(key));
            updated = { ...stored, ...value };
        } else {
            updated = [value];
        }
        await localStorage.setItem(key, JSON.stringify(updated));
        return;
    } catch (err) {
        console.error(err);
    }
};

export const getFromStorage = async key => {
    try {
        const json = localStorage.getItem(key);
        if (json) {
            return JSON.parse(json);
        }
        return null;
    } catch (err) {
        console.error(err);
    }
};

const hasSetupAccountInitialState = false;
/**
 * Determines if user has completed onboarding
 */
export const hasSetupAccount = persistent<boolean>("hasSetupAccount", hasSetupAccountInitialState);

const credentialsInitialState = {
    personal: "",
    health: "",
    blood: ""
};
export const credentials = persistent<{ personal: string; health: string; blood: string }>(
    "credentials",
    credentialsInitialState
);

const accountInitialState = null;
export const account = persistent<{ name: string } | null>("account", accountInitialState);

/**
 * Modal status
 */
export type ModalStatus = {
    active: boolean;
    type: "share" | "code" | null;
    props?: any;
};

const modalStatusInitialState = { active: false, type: null, props: null };
export const modalStatus = writable<ModalStatus>(modalStatusInitialState);

const landingIndexInitialState = 0;
export const landingIndex = writable<number>(landingIndexInitialState);

export const loadingScreen = writable<string | void>();

export function resetAllStores() {
    hasSetupAccount.set(hasSetupAccountInitialState);
    credentials.set(credentialsInitialState);
    account.set(accountInitialState);
    modalStatus.set(modalStatusInitialState);
    landingIndex.set(landingIndexInitialState);
    loadingScreen.set();
}
