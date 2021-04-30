import { writable } from 'svelte/store';
import { persistent } from './helpers';
import { enrichCredential, storeCredential, removeCredential, VerifiableCredentialEnrichment } from './identity';

/**
 * Determines if use has completed onboarding
 */
export const hasSetupAccount = persistent('hasSetupAccount', false);

export const listOfCredentials = persistent(
    'listOfCredentials',
    {
        init: false,
        values: [],
    },
    (value) => ({ ...value, init: false })
);

export const account = persistent('account', null);

/**
 * Modal status
 */

export const modalStatus = writable({ active: false, type: null, props: null });


export const socketConnectionState = writable({ state: 'disconnected', payload: null });

export const landingIndex = writable(0);

export const qrCode = writable('');

export const storedCredentials = writable([]);

storedCredentials.subscribe((value) => {
    listOfCredentials.update((prev) => {
        if (prev.init) {
            const idsToDelete = prev.values.filter((id) => !value.find((credential) => credential.id === id));
            idsToDelete.map((id) => removeCredential(id));
            return { ...prev, values: value.map((credential) => credential.id) };
        }
        return { ...prev, init: true };
    });
    value.map((credential) => {
        if (!credential.enrichment) {
            enrichCredential(credential.credentialDocument).then((enrichment) => {
                storedCredentials.update((prev) =>
                    prev.map((prevCredential) =>
                        prevCredential.id === credential.id
                            ? { ...prevCredential, enrichment }
                            : prevCredential
                    )
                );
            });
        }
        return storeCredential(credential.id, credential);
    });
});

export const currentPresentation = writable(null);

currentPresentation.subscribe((presentation) => {
    if (presentation && !presentation.enrichment) {
        // TODO: which document to use for enrichment
        enrichCredential(presentation.presentationDocument.verifiableCredential[0]).then((enrichment) => {
            currentPresentation.update((prev) => ({ ...prev, enrichment }));
        });
    }
});

export const currentCredentialToAccept = writable(null);

currentCredentialToAccept.subscribe((credential) => {
    if (credential && !credential.enrichment) {
        enrichCredential(credential.credentialDocument).then((enrichment) => {
            currentCredentialToAccept.update((prev) => ({ ...prev, enrichment }));
        });
    }
});

export const unconfirmedCredentials = writable([]);

export const unconfirmedRequests = writable([]);

/**
 * Error string
 */
export const error = writable(null);

let errorTimeout;

error.subscribe((item) => {
    clearTimeout(errorTimeout);
    if (item) {
        errorTimeout = setTimeout(() => {
            error.set(null);
        }, 3500);
    }
});
