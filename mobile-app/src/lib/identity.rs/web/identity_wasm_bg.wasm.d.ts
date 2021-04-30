/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function __wbg_did_free(a: number): void;
export function did_new(a: number, b: number, c: number, d: number, e: number): number;
export function did_fromBase58(a: number, b: number, c: number, d: number, e: number, f: number): number;
export function did_parse(a: number, b: number): number;
export function did_network(a: number, b: number): void;
export function did_shard(a: number, b: number): void;
export function did_tag(a: number, b: number): void;
export function did_toString(a: number, b: number): void;
export function __wbg_verifiablepresentation_free(a: number): void;
export function verifiablepresentation_new(a: number, b: number, c: number, d: number, e: number, f: number): number;
export function verifiablepresentation_toJSON(a: number): number;
export function verifiablepresentation_fromJSON(a: number): number;
export function __wbg_keycollection_free(a: number): void;
export function keycollection_new(a: number, b: number): number;
export function keycollection_length(a: number): number;
export function keycollection_isEmpty(a: number): number;
export function keycollection_keypair(a: number, b: number): number;
export function keycollection_public(a: number, b: number, c: number): void;
export function keycollection_secret(a: number, b: number, c: number): void;
export function keycollection_merkleRoot(a: number, b: number, c: number): void;
export function keycollection_merkleProof(a: number, b: number, c: number, d: number): void;
export function keycollection_toJSON(a: number): number;
export function keycollection_fromJSON(a: number): number;
export function __wbg_verifiablecredential_free(a: number): void;
export function verifiablecredential_extend(a: number): number;
export function verifiablecredential_issue(a: number, b: number, c: number, d: number, e: number, f: number): number;
export function verifiablecredential_toJSON(a: number): number;
export function verifiablecredential_fromJSON(a: number): number;
export function __wbg_newdocument_free(a: number): void;
export function newdocument_key(a: number): number;
export function newdocument_doc(a: number): number;
export function __wbg_document_free(a: number): void;
export function document_new(a: number, b: number, c: number): number;
export function document_fromKeyPair(a: number): number;
export function document_fromAuthentication(a: number): number;
export function document_id(a: number): number;
export function document_proof(a: number): number;
export function document_insertMethod(a: number, b: number, c: number, d: number): number;
export function document_removeMethod(a: number, b: number): void;
export function document_sign(a: number, b: number): void;
export function document_verify(a: number): number;
export function document_signCredential(a: number, b: number, c: number): number;
export function document_signPresentation(a: number, b: number, c: number): number;
export function document_signData(a: number, b: number, c: number): number;
export function document_verifyData(a: number, b: number): number;
export function document_resolveKey(a: number, b: number, c: number): number;
export function document_revokeMerkleKey(a: number, b: number, c: number, d: number): number;
export function document_diff(a: number, b: number, c: number, d: number, e: number): number;
export function document_merge(a: number, b: number, c: number): void;
export function document_toJSON(a: number): number;
export function document_fromJSON(a: number): number;
export function start(): void;
export function __wbg_keypair_free(a: number): void;
export function keypair_new(a: number): number;
export function keypair_fromBase58(a: number, b: number, c: number, d: number, e: number): number;
export function keypair_public(a: number, b: number): void;
export function keypair_secret(a: number, b: number): void;
export function keypair_toJSON(a: number): number;
export function keypair_fromJSON(a: number): number;
export function __wbg_method_free(a: number): void;
export function method_new(a: number, b: number, c: number): number;
export function method_fromDID(a: number, b: number, c: number, d: number): number;
export function method_createMerkleKey(a: number, b: number, c: number, d: number, e: number): number;
export function method_id(a: number): number;
export function method_controller(a: number): number;
export function method_type(a: number, b: number): void;
export function method_data(a: number): number;
export function method_toJSON(a: number): number;
export function method_fromJSON(a: number): number;
export function publish(a: number, b: number): number;
export function resolve(a: number, b: number, c: number): number;
export function checkCredential(a: number, b: number, c: number): number;
export function checkPresentation(a: number, b: number, c: number): number;
export function __wbindgen_malloc(a: number): number;
export function __wbindgen_realloc(a: number, b: number, c: number): number;
export const __wbindgen_export_2: WebAssembly.Table;
export function _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h417cc6641f1d23af(a: number, b: number, c: number): void;
export function __wbindgen_add_to_stack_pointer(a: number): number;
export function __wbindgen_free(a: number, b: number): void;
export function __wbindgen_exn_store(a: number): void;
export function wasm_bindgen__convert__closures__invoke2_mut__h6b41802e4949ba7e(a: number, b: number, c: number, d: number): void;
export function __wbindgen_start(): void;