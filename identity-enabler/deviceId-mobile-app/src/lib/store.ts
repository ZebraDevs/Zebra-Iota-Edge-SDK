import { writable } from 'svelte/store';
import { persistent } from './helpers';
import init from './init';
import type { VerifiableCredentialEnrichment } from '../models/types/identity';

init();

export const updateStorage = async (key, value) => {
    try {
        let stored = {};
        let updated = {};
        if (localStorage.getItem(key)) {
            stored = JSON.parse(await localStorage.getItem(key));
            updated = {...stored, ...value};
        } else {
            updated = [value];
        }
        await localStorage.setItem(key, JSON.stringify(updated));
        return;
    } catch (err) {
        console.error(err);
    }
}

export const getFromStorage = async (key) => {
    try {
        const json = localStorage.getItem(key);
        if (json) {
            return JSON.parse(json);
        }
        return null;
    } catch (err) {
        console.error(err);
    }
}

const hasSetupAccountInitialState = false;
/**
 * Determines if use has completed onboarding
 */
export const hasSetupAccount = persistent<boolean>('hasSetupAccount', hasSetupAccountInitialState);

const credentialsInitialState = { organization: '' };
export const credentials = persistent<{ organization: string }>(
    'credentials',
    credentialsInitialState
);

const accountInitialState = null;
export const account = persistent<{ name: string } | null>('account', accountInitialState);

/**
 * Modal status
 */
 export type ModalStatus = {
    active: boolean;
    type: 'share' | null;
    props?: any;
};

const modalStatusInitialState = { active: false, type: null, props: null }
export const modalStatus = writable<ModalStatus>(modalStatusInitialState);

export interface InternalCredentialDataModel {
    id : string;
    metaInformation: {
        issuer: string;
        receivedAt: string;
    };
    enrichment: VerifiableCredentialEnrichment | null;
    credentialDocument: any;
}

const errorInitialState = null;
/**
 * Error string
 */
export const error = writable<string>(errorInitialState);

let errorTimeout: any;

error.subscribe((item) => {
    clearTimeout(errorTimeout);
    if (item) {
        errorTimeout = setTimeout(() => {
            error.set(null);
        }, 3500);
    }
});

export function resetAllStores() {
    hasSetupAccount.set(hasSetupAccountInitialState);
    credentials.set(credentialsInitialState);
    account.set(accountInitialState);
    modalStatus.set(modalStatusInitialState);
    error.set(errorInitialState);
}
