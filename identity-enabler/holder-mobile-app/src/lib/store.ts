import { writable } from 'svelte/store';
import { persistent } from './helpers';
import init from './init';
import { ServiceFactory } from '../factories/serviceFactory';
import type { VerifiableCredentialEnrichment } from '../models/types/identity';
import type { IdentityService } from '../services/identityService';

init();
const identityService = ServiceFactory.get<IdentityService>('identity');

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
 * Determines if user has completed onboarding
 */
export const hasSetupAccount = persistent<boolean>('hasSetupAccount', hasSetupAccountInitialState);

const listOfCredentialsInitialState = {
    init: false,
    values: [],
};
export const listOfCredentials = persistent<{ init: boolean; values: string[] }>(
    'listOfCredentials',
    listOfCredentialsInitialState,
    (value) => ({ ...value, init: false })
);

const credentialsInitialState = {
    personal: '',
    health: '',
    blood: '',
    organization: ''
};
export const credentials = persistent<{ personal: string, health: string, blood: string, organization: string }>('credentials', credentialsInitialState);

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

const modalStatusInitialState = { active: false, type: null, props: null };
export const modalStatus = writable<ModalStatus>(modalStatusInitialState);

const landingIndexInitialState = 0;
export const landingIndex = writable<number>(landingIndexInitialState);

export interface InternalCredentialDataModel {
    id : string;
    metaInformation: {
        issuer: string;
        receivedAt: string;
    };
    enrichment: VerifiableCredentialEnrichment | null;
    credentialDocument: any;
}

const storedCredentialsInitialState = []
export const storedCredentials = writable<InternalCredentialDataModel[]>(storedCredentialsInitialState);

storedCredentials.subscribe((value) => {
    listOfCredentials.update((prev) => {
        if (prev.init) {
            const idsToDelete = prev.values.filter((id) => !value.find((credential) => credential.id === id));
            idsToDelete.map((id) => identityService.removeCredential(id));
            return { ...prev, values: value.map((credential) => credential.id) };
        }
        return { ...prev, init: true };
    });
    value.map((credential) => {
        if (!credential.enrichment) {
            const enrichment = identityService.enrichCredential(credential.credentialDocument)
            storedCredentials.update((prev) =>
                prev.map((prevCredential) =>
                    prevCredential.id === credential.id
                        ? { ...prevCredential, enrichment }
                        : prevCredential
                )
            );
        }
        return identityService.storeCredential(credential.id, credential);
    });
});

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
    listOfCredentials.set(listOfCredentialsInitialState);
    credentials.set(credentialsInitialState);
    account.set(accountInitialState);
    modalStatus.set(modalStatusInitialState);
    landingIndex.set(landingIndexInitialState);
    storedCredentials.set(storedCredentialsInitialState);
    error.set(errorInitialState);
}
