import type { CredentialType } from "./CredentialType";
import type { ICredentialSubject } from "./ICredentialSubject";
import type { IProof } from "./IProof";

type ZebraSDKCredentialType = ["VerifiableCredential", CredentialType];

interface IssuerObject {
    id: string;
    name?: string;
}

/**
 * Minimum model for VC as used by this SDK.
 * See https://www.w3.org/TR/vc-data-model/ for full data model.
 */
export interface IVerifiableCredential {
    "@context": string | string[];
    type: ZebraSDKCredentialType;
    issuer: string | IssuerObject;
    issuanceDate: string;
    expirationDate: string;
    credentialSubject: ICredentialSubject;
    proof: IProof;
}
