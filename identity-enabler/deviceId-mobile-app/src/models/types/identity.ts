import type { Document, KeyPair, KeyCollection, VerificationMethod } from '@iota/identity-wasm/web';

export type Identity = {
  didDoc: string;
  publicAuthKey: string;
  privateAuthKey: string;
  doc: Document;
  key: KeyPair;
  keys: KeyCollection | any;
  method: VerificationMethod | any;
};

export type IdentityConfig = {
  node: string;
  network: string;
};

export type VerifiableCredentialEnrichment = {
  issuerLabel: string;
  logo: string;
  credentialLabel: string;
  theme: string;
};
