import type * as IotaIdentity from '@iota/identity-wasm/web';

export type Identity = {
  didDoc: string;
  publicAuthKey: string;
  privateAuthKey: string;
  doc: typeof IotaIdentity.Document;
  key: typeof IotaIdentity.KeyPair;
  keys: typeof IotaIdentity.KeyCollection | any;
  method: typeof IotaIdentity.VerificationMethod | any;
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
