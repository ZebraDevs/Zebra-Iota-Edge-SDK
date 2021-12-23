import { writable } from "svelte/store";
import { persistent } from "./helpers";
import init from "./init";
import type { VerifiableCredentialEnrichment } from "../models/types/identity";

init();

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
    type: "share" | null;
    props?: any;
};

const modalStatusInitialState = { active: false, type: null, props: null };
export const modalStatus = writable<ModalStatus>(modalStatusInitialState);

export interface InternalCredentialDataModel {
    id: string;
    metaInformation: {
        issuer: string;
        receivedAt: string;
    };
    enrichment: VerifiableCredentialEnrichment | null;
    credentialDocument: any;
}

export const loadingScreen = writable<string | void>();

export function resetAllStores() {
    hasSetupAccount.set(hasSetupAccountInitialState);
    credentials.set(credentialsInitialState);
    account.set(accountInitialState);
    modalStatus.set(modalStatusInitialState);
    loadingScreen.set();
}
