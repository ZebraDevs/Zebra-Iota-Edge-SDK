import type { IProof } from "./IProof";
import type { IVerifiableCredential } from "./IVerifiableCredential";

/**
 * Minimum model for VP as used by this SDK.
 * See https://www.w3.org/TR/vc-data-model/ for full data model.
 */
export interface IVerifiablePresentation {
    "@context": string | string[];
    type: "VerifiablePresentation";
    holder: string;
    verifiableCredential: IVerifiableCredential;
    proof: IProof;
}
