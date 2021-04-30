/* tslint:disable */
/* eslint-disable */
/**
* Initializes the console error panic hook for better error messages
*/
export function start(): void;
/**
* Publishes a DID Document to the Tangle, params looks like { node: "http://localhost:14265", network: "main" }
* @param {any} document
* @param {any} params
* @returns {any}
*/
export function publish(document: any, params: any): any;
/**
* Resolves the latest DID Document from the Tangle, params looks like { node: "http://localhost:14265", network: "main" }
* @param {string} did
* @param {any} params
* @returns {any}
*/
export function resolve(did: string, params: any): any;
/**
* Validates a credential with the DID Document from the Tangle, params looks like { node: "http://localhost:14265", network: "main" }
* @param {string} data
* @param {any} params
* @returns {any}
*/
export function checkCredential(data: string, params: any): any;
/**
* Validates a presentation with the DID Document from the Tangle, params looks like { node: "http://localhost:14265", network: "main" }
* @param {string} data
* @param {any} params
* @returns {any}
*/
export function checkPresentation(data: string, params: any): any;
/**
*/
export enum Digest {
  Sha256,
}
/**
*/
export enum KeyType {
  Ed25519,
}
/**
* @typicalname did
*/
export class DID {
  free(): void;
/**
* Creates a new `DID` from a `KeyPair` object.
* @param {KeyPair} key
* @param {string | undefined} network
* @param {string | undefined} shard
*/
  constructor(key: KeyPair, network?: string, shard?: string);
/**
* Creates a new `DID` from a base58-encoded public key.
* @param {string} key
* @param {string | undefined} network
* @param {string | undefined} shard
* @returns {DID}
*/
  static fromBase58(key: string, network?: string, shard?: string): DID;
/**
* Parses a `DID` from the input string.
* @param {string} input
* @returns {DID}
*/
  static parse(input: string): DID;
/**
* Returns the `DID` object as a string.
* @returns {string}
*/
  toString(): string;
/**
* Returns the IOTA tangle network of the `DID`.
* @returns {string}
*/
  readonly network: string;
/**
* Returns the IOTA tangle shard of the `DID` (if any).
* @returns {string | undefined}
*/
  readonly shard: string | undefined;
/**
* Returns the unique tag of the `DID`.
* @returns {string}
*/
  readonly tag: string;
}
/**
*/
export class Document {
  free(): void;
/**
* Creates a new DID Document from the given KeyPair.
* @param {number} type_
* @param {string | undefined} tag
*/
  constructor(type_: number, tag?: string);
/**
* Creates a new DID Document from the given KeyPair.
* @param {KeyPair} key
* @returns {Document}
*/
  static fromKeyPair(key: KeyPair): Document;
/**
* Creates a new DID Document from the given verification [`method`][`Method`].
* @param {Method} method
* @returns {Document}
*/
  static fromAuthentication(method: Method): Document;
/**
* @param {Method} method
* @param {string | undefined} scope
* @returns {boolean}
*/
  insertMethod(method: Method, scope?: string): boolean;
/**
* @param {DID} did
*/
  removeMethod(did: DID): void;
/**
* Signs the DID Document with the default authentication method.
* @param {KeyPair} key
*/
  sign(key: KeyPair): void;
/**
* Verify the signature with the authentication_key
* @returns {boolean}
*/
  verify(): boolean;
/**
* @param {any} data
* @param {any} args
* @returns {VerifiableCredential}
*/
  signCredential(data: any, args: any): VerifiableCredential;
/**
* @param {any} data
* @param {any} args
* @returns {VerifiablePresentation}
*/
  signPresentation(data: any, args: any): VerifiablePresentation;
/**
* Creates a signature for the given `data` with the specified DID Document
* Verification Method.
*
* An additional `proof` property is required if using a Merkle Key
* Collection verification Method.
* @param {any} data
* @param {any} args
* @returns {any}
*/
  signData(data: any, args: any): any;
/**
* Verifies the authenticity of `data` using the target verification method.
* @param {any} data
* @returns {boolean}
*/
  verifyData(data: any): boolean;
/**
* @param {string} query
* @returns {Method}
*/
  resolveKey(query: string): Method;
/**
* @param {string} query
* @param {number} index
* @returns {boolean}
*/
  revokeMerkleKey(query: string, index: number): boolean;
/**
* Generate the difference between two DID Documents and sign it
* @param {Document} other
* @param {string} message
* @param {KeyPair} key
* @returns {any}
*/
  diff(other: Document, message: string, key: KeyPair): any;
/**
* Verifies the `diff` signature and merges the changes into `self`.
* @param {string} diff
*/
  merge(diff: string): void;
/**
* Serializes a `Document` object as a JSON object.
* @returns {any}
*/
  toJSON(): any;
/**
* Deserializes a `Document` object from a JSON object.
* @param {any} json
* @returns {Document}
*/
  static fromJSON(json: any): Document;
/**
* Returns the DID Document `id`.
* @returns {DID}
*/
  readonly id: DID;
/**
* Returns the DID Document `proof` object.
* @returns {any}
*/
  readonly proof: any;
}
/**
*/
export class KeyCollection {
  free(): void;
/**
* Creates a new `KeyCollection` with the specified key type.
* @param {number} type_
* @param {number} count
*/
  constructor(type_: number, count: number);
/**
* Returns `true` if the collection contains no keys.
* @returns {boolean}
*/
  isEmpty(): boolean;
/**
* Returns the keypair at the specified `index`.
* @param {number} index
* @returns {KeyPair | undefined}
*/
  keypair(index: number): KeyPair | undefined;
/**
* Returns the public key at the specified `index` as a base58-encoded string.
* @param {number} index
* @returns {string | undefined}
*/
  public(index: number): string | undefined;
/**
* Returns the secret key at the specified `index` as a base58-encoded string.
* @param {number} index
* @returns {string | undefined}
*/
  secret(index: number): string | undefined;
/**
* @param {number} digest
* @returns {string}
*/
  merkleRoot(digest: number): string;
/**
* @param {number} digest
* @param {number} index
* @returns {string | undefined}
*/
  merkleProof(digest: number, index: number): string | undefined;
/**
* Serializes a `KeyCollection` object as a JSON object.
* @returns {any}
*/
  toJSON(): any;
/**
* Deserializes a `KeyCollection` object from a JSON object.
* @param {any} json
* @returns {KeyCollection}
*/
  static fromJSON(json: any): KeyCollection;
/**
* Returns the number of keys in the collection.
* @returns {number}
*/
  readonly length: number;
}
/**
*/
export class KeyPair {
  free(): void;
/**
* Generates a new `KeyPair` object.
* @param {number} type_
*/
  constructor(type_: number);
/**
* Parses a `KeyPair` object from base58-encoded public/secret keys.
* @param {number} type_
* @param {string} public_key
* @param {string} secret_key
* @returns {KeyPair}
*/
  static fromBase58(type_: number, public_key: string, secret_key: string): KeyPair;
/**
* Serializes a `KeyPair` object as a JSON object.
* @returns {any}
*/
  toJSON(): any;
/**
* Deserializes a `KeyPair` object from a JSON object.
* @param {any} json
* @returns {KeyPair}
*/
  static fromJSON(json: any): KeyPair;
/**
* Returns the public key as a base58-encoded string.
* @returns {string}
*/
  readonly public: string;
/**
* Returns the secret key as a base58-encoded string.
* @returns {string}
*/
  readonly secret: string;
}
/**
*/
export class Method {
  free(): void;
/**
* Creates a new `Method` object from the given `key`.
* @param {KeyPair} key
* @param {string | undefined} tag
*/
  constructor(key: KeyPair, tag?: string);
/**
* Creates a new `Method` object from the given `did` and `key`.
* @param {DID} did
* @param {KeyPair} key
* @param {string | undefined} tag
* @returns {Method}
*/
  static fromDID(did: DID, key: KeyPair, tag?: string): Method;
/**
* Creates a new Merkle Key Collection Method from the given key collection.
* @param {number} digest
* @param {DID} did
* @param {KeyCollection} keys
* @param {string | undefined} tag
* @returns {Method}
*/
  static createMerkleKey(digest: number, did: DID, keys: KeyCollection, tag?: string): Method;
/**
* Serializes a `Method` object as a JSON object.
* @returns {any}
*/
  toJSON(): any;
/**
* Deserializes a `Method` object from a JSON object.
* @param {any} value
* @returns {Method}
*/
  static fromJSON(value: any): Method;
/**
* Returns the `controller` DID of the `Method` object.
* @returns {DID}
*/
  readonly controller: DID;
/**
* Returns the `Method` public key data.
* @returns {any}
*/
  readonly data: any;
/**
* Returns the `id` DID of the `Method` object.
* @returns {DID}
*/
  readonly id: DID;
/**
* Returns the `Method` type.
* @returns {string}
*/
  readonly type: string;
}
/**
*/
export class NewDocument {
  free(): void;
/**
* @returns {Document}
*/
  readonly doc: Document;
/**
* @returns {KeyPair}
*/
  readonly key: KeyPair;
}
/**
*/
export class VerifiableCredential {
  free(): void;
/**
* @param {any} value
* @returns {VerifiableCredential}
*/
  static extend(value: any): VerifiableCredential;
/**
* @param {Document} issuer_doc
* @param {any} subject_data
* @param {string | undefined} credential_type
* @param {string | undefined} credential_id
* @returns {VerifiableCredential}
*/
  static issue(issuer_doc: Document, subject_data: any, credential_type?: string, credential_id?: string): VerifiableCredential;
/**
* Serializes a `VerifiableCredential` object as a JSON object.
* @returns {any}
*/
  toJSON(): any;
/**
* Deserializes a `VerifiableCredential` object from a JSON object.
* @param {any} json
* @returns {VerifiableCredential}
*/
  static fromJSON(json: any): VerifiableCredential;
}
/**
*/
export class VerifiablePresentation {
  free(): void;
/**
* @param {Document} holder_doc
* @param {any} credential_data
* @param {string | undefined} presentation_type
* @param {string | undefined} presentation_id
*/
  constructor(holder_doc: Document, credential_data: any, presentation_type?: string, presentation_id?: string);
/**
* Serializes a `VerifiablePresentation` object as a JSON object.
* @returns {any}
*/
  toJSON(): any;
/**
* Deserializes a `VerifiablePresentation` object from a JSON object.
* @param {any} json
* @returns {VerifiablePresentation}
*/
  static fromJSON(json: any): VerifiablePresentation;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_did_free: (a: number) => void;
  readonly did_new: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly did_fromBase58: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly did_parse: (a: number, b: number) => number;
  readonly did_network: (a: number, b: number) => void;
  readonly did_shard: (a: number, b: number) => void;
  readonly did_tag: (a: number, b: number) => void;
  readonly did_toString: (a: number, b: number) => void;
  readonly __wbg_verifiablepresentation_free: (a: number) => void;
  readonly verifiablepresentation_new: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly verifiablepresentation_toJSON: (a: number) => number;
  readonly verifiablepresentation_fromJSON: (a: number) => number;
  readonly __wbg_keycollection_free: (a: number) => void;
  readonly keycollection_new: (a: number, b: number) => number;
  readonly keycollection_length: (a: number) => number;
  readonly keycollection_isEmpty: (a: number) => number;
  readonly keycollection_keypair: (a: number, b: number) => number;
  readonly keycollection_public: (a: number, b: number, c: number) => void;
  readonly keycollection_secret: (a: number, b: number, c: number) => void;
  readonly keycollection_merkleRoot: (a: number, b: number, c: number) => void;
  readonly keycollection_merkleProof: (a: number, b: number, c: number, d: number) => void;
  readonly keycollection_toJSON: (a: number) => number;
  readonly keycollection_fromJSON: (a: number) => number;
  readonly __wbg_verifiablecredential_free: (a: number) => void;
  readonly verifiablecredential_extend: (a: number) => number;
  readonly verifiablecredential_issue: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly verifiablecredential_toJSON: (a: number) => number;
  readonly verifiablecredential_fromJSON: (a: number) => number;
  readonly __wbg_newdocument_free: (a: number) => void;
  readonly newdocument_key: (a: number) => number;
  readonly newdocument_doc: (a: number) => number;
  readonly __wbg_document_free: (a: number) => void;
  readonly document_new: (a: number, b: number, c: number) => number;
  readonly document_fromKeyPair: (a: number) => number;
  readonly document_fromAuthentication: (a: number) => number;
  readonly document_id: (a: number) => number;
  readonly document_proof: (a: number) => number;
  readonly document_insertMethod: (a: number, b: number, c: number, d: number) => number;
  readonly document_removeMethod: (a: number, b: number) => void;
  readonly document_sign: (a: number, b: number) => void;
  readonly document_verify: (a: number) => number;
  readonly document_signCredential: (a: number, b: number, c: number) => number;
  readonly document_signPresentation: (a: number, b: number, c: number) => number;
  readonly document_signData: (a: number, b: number, c: number) => number;
  readonly document_verifyData: (a: number, b: number) => number;
  readonly document_resolveKey: (a: number, b: number, c: number) => number;
  readonly document_revokeMerkleKey: (a: number, b: number, c: number, d: number) => number;
  readonly document_diff: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly document_merge: (a: number, b: number, c: number) => void;
  readonly document_toJSON: (a: number) => number;
  readonly document_fromJSON: (a: number) => number;
  readonly start: () => void;
  readonly __wbg_keypair_free: (a: number) => void;
  readonly keypair_new: (a: number) => number;
  readonly keypair_fromBase58: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly keypair_public: (a: number, b: number) => void;
  readonly keypair_secret: (a: number, b: number) => void;
  readonly keypair_toJSON: (a: number) => number;
  readonly keypair_fromJSON: (a: number) => number;
  readonly __wbg_method_free: (a: number) => void;
  readonly method_new: (a: number, b: number, c: number) => number;
  readonly method_fromDID: (a: number, b: number, c: number, d: number) => number;
  readonly method_createMerkleKey: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly method_id: (a: number) => number;
  readonly method_controller: (a: number) => number;
  readonly method_type: (a: number, b: number) => void;
  readonly method_data: (a: number) => number;
  readonly method_toJSON: (a: number) => number;
  readonly method_fromJSON: (a: number) => number;
  readonly publish: (a: number, b: number) => number;
  readonly resolve: (a: number, b: number, c: number) => number;
  readonly checkCredential: (a: number, b: number, c: number) => number;
  readonly checkPresentation: (a: number, b: number, c: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h417cc6641f1d23af: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__h6b41802e4949ba7e: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_start: () => void;
}

/**
* Loads the Wasm file so the lib can be used, relative path to Wasm file
* @param {string | undefined} path
*/
export function init (path?: string): Promise<void>;
