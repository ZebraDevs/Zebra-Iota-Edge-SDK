import type * as IotaIdentity from '@iota/identity-wasm/web';

export type Identity = {
  didDoc: string;
  publicAuthKey: string;
  privateAuthKey: string;
  doc: typeof IotaIdentity.Document;
  key: typeof IotaIdentity.KeyPair;
  keys: typeof IotaIdentity.KeyCollection;
  method: typeof IotaIdentity.VerificationMethod;
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
