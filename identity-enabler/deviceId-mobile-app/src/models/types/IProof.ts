/**
 * Minimum model for verifiable proofs as used by this SDK.
 * See https://www.w3.org/TR/vc-data-model/ for full data model.
 */
export interface IProof {
    type: string;
    verificationMethod: string;
    signatureValue: string;
}
