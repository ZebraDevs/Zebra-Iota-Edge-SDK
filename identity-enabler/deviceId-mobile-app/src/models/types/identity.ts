import type { Document, KeyPair, KeyCollection, VerificationMethod } from "@iota/identity-wasm/web";

export interface Identity {
    didDoc: string;
    publicAuthKey: string;
    privateAuthKey: string;
    doc: Document;
    key: KeyPair;
    keys: KeyCollection;
    method: VerificationMethod;
}

export interface IdentityConfig {
    node: string;
    network: string;
    permanode?: string;
}
