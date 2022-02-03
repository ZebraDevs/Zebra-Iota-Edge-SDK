/**
 * Minimum model for credential subject claims as used by this SDK.
 * See https://www.w3.org/TR/vc-data-model/ for full data model.
 */
export interface ICredentialSubject {
    id: string;
    [key: string]: unknown;
}
