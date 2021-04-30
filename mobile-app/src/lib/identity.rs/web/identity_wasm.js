
let wasm;

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_30(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h417cc6641f1d23af(arg0, arg1, addHeapObject(arg2));
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
/**
* Initializes the console error panic hook for better error messages
*/
export function start() {
    wasm.start();
}

/**
* Publishes a DID Document to the Tangle, params looks like { node: "http://localhost:14265", network: "main" }
* @param {any} document
* @param {any} params
* @returns {any}
*/
export function publish(document, params) {
    var ret = wasm.publish(addHeapObject(document), addHeapObject(params));
    return takeObject(ret);
}

/**
* Resolves the latest DID Document from the Tangle, params looks like { node: "http://localhost:14265", network: "main" }
* @param {string} did
* @param {any} params
* @returns {any}
*/
export function resolve(did, params) {
    var ptr0 = passStringToWasm0(did, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.resolve(ptr0, len0, addHeapObject(params));
    return takeObject(ret);
}

/**
* Validates a credential with the DID Document from the Tangle, params looks like { node: "http://localhost:14265", network: "main" }
* @param {string} data
* @param {any} params
* @returns {any}
*/
export function checkCredential(data, params) {
    var ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.checkCredential(ptr0, len0, addHeapObject(params));
    return takeObject(ret);
}

/**
* Validates a presentation with the DID Document from the Tangle, params looks like { node: "http://localhost:14265", network: "main" }
* @param {string} data
* @param {any} params
* @returns {any}
*/
export function checkPresentation(data, params) {
    var ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.checkPresentation(ptr0, len0, addHeapObject(params));
    return takeObject(ret);
}

function handleError(f) {
    return function () {
        try {
            return f.apply(this, arguments);

        } catch (e) {
            wasm.__wbindgen_exn_store(addHeapObject(e));
        }
    };
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
function __wbg_adapter_160(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h6b41802e4949ba7e(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

/**
*/
export const Digest = Object.freeze({ Sha256:1,"1":"Sha256", });
/**
*/
export const KeyType = Object.freeze({ Ed25519:1,"1":"Ed25519", });
/**
* @typicalname did
*/
export class DID {

    static __wrap(ptr) {
        const obj = Object.create(DID.prototype);
        obj.ptr = ptr;

        return obj;
    }

    toJSON() {
        return {
            network: this.network,
            shard: this.shard,
            tag: this.tag,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_did_free(ptr);
    }
    /**
    * Creates a new `DID` from a `KeyPair` object.
    * @param {KeyPair} key
    * @param {string | undefined} network
    * @param {string | undefined} shard
    */
    constructor(key, network, shard) {
        _assertClass(key, KeyPair);
        var ptr0 = isLikeNone(network) ? 0 : passStringToWasm0(network, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(shard) ? 0 : passStringToWasm0(shard, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.did_new(key.ptr, ptr0, len0, ptr1, len1);
        return DID.__wrap(ret);
    }
    /**
    * Creates a new `DID` from a base58-encoded public key.
    * @param {string} key
    * @param {string | undefined} network
    * @param {string | undefined} shard
    * @returns {DID}
    */
    static fromBase58(key, network, shard) {
        var ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(network) ? 0 : passStringToWasm0(network, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(shard) ? 0 : passStringToWasm0(shard, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        var ret = wasm.did_fromBase58(ptr0, len0, ptr1, len1, ptr2, len2);
        return DID.__wrap(ret);
    }
    /**
    * Parses a `DID` from the input string.
    * @param {string} input
    * @returns {DID}
    */
    static parse(input) {
        var ptr0 = passStringToWasm0(input, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.did_parse(ptr0, len0);
        return DID.__wrap(ret);
    }
    /**
    * Returns the IOTA tangle network of the `DID`.
    * @returns {string}
    */
    get network() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.did_network(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Returns the IOTA tangle shard of the `DID` (if any).
    * @returns {string | undefined}
    */
    get shard() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.did_shard(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Returns the unique tag of the `DID`.
    * @returns {string}
    */
    get tag() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.did_tag(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Returns the `DID` object as a string.
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.did_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
*/
export class Document {

    static __wrap(ptr) {
        const obj = Object.create(Document.prototype);
        obj.ptr = ptr;

        return obj;
    }

    toJSON() {
        return {
            id: this.id,
            proof: this.proof,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_document_free(ptr);
    }
    /**
    * Creates a new DID Document from the given KeyPair.
    * @param {number} type_
    * @param {string | undefined} tag
    */
    constructor(type_, tag) {
        var ptr0 = isLikeNone(tag) ? 0 : passStringToWasm0(tag, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.document_new(type_, ptr0, len0);
        return NewDocument.__wrap(ret);
    }
    /**
    * Creates a new DID Document from the given KeyPair.
    * @param {KeyPair} key
    * @returns {Document}
    */
    static fromKeyPair(key) {
        _assertClass(key, KeyPair);
        var ret = wasm.document_fromKeyPair(key.ptr);
        return Document.__wrap(ret);
    }
    /**
    * Creates a new DID Document from the given verification [`method`][`Method`].
    * @param {Method} method
    * @returns {Document}
    */
    static fromAuthentication(method) {
        _assertClass(method, Method);
        var ret = wasm.document_fromAuthentication(method.ptr);
        return Document.__wrap(ret);
    }
    /**
    * Returns the DID Document `id`.
    * @returns {DID}
    */
    get id() {
        var ret = wasm.document_id(this.ptr);
        return DID.__wrap(ret);
    }
    /**
    * Returns the DID Document `proof` object.
    * @returns {any}
    */
    get proof() {
        var ret = wasm.document_proof(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {Method} method
    * @param {string | undefined} scope
    * @returns {boolean}
    */
    insertMethod(method, scope) {
        _assertClass(method, Method);
        var ptr0 = isLikeNone(scope) ? 0 : passStringToWasm0(scope, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.document_insertMethod(this.ptr, method.ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
    * @param {DID} did
    */
    removeMethod(did) {
        _assertClass(did, DID);
        wasm.document_removeMethod(this.ptr, did.ptr);
    }
    /**
    * Signs the DID Document with the default authentication method.
    * @param {KeyPair} key
    */
    sign(key) {
        _assertClass(key, KeyPair);
        wasm.document_sign(this.ptr, key.ptr);
    }
    /**
    * Verify the signature with the authentication_key
    * @returns {boolean}
    */
    verify() {
        var ret = wasm.document_verify(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {any} data
    * @param {any} args
    * @returns {VerifiableCredential}
    */
    signCredential(data, args) {
        try {
            var ret = wasm.document_signCredential(this.ptr, addBorrowedObject(data), addBorrowedObject(args));
            return VerifiableCredential.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {any} data
    * @param {any} args
    * @returns {VerifiablePresentation}
    */
    signPresentation(data, args) {
        try {
            var ret = wasm.document_signPresentation(this.ptr, addBorrowedObject(data), addBorrowedObject(args));
            return VerifiablePresentation.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
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
    signData(data, args) {
        try {
            var ret = wasm.document_signData(this.ptr, addBorrowedObject(data), addBorrowedObject(args));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * Verifies the authenticity of `data` using the target verification method.
    * @param {any} data
    * @returns {boolean}
    */
    verifyData(data) {
        try {
            var ret = wasm.document_verifyData(this.ptr, addBorrowedObject(data));
            return ret !== 0;
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {string} query
    * @returns {Method}
    */
    resolveKey(query) {
        var ptr0 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.document_resolveKey(this.ptr, ptr0, len0);
        return Method.__wrap(ret);
    }
    /**
    * @param {string} query
    * @param {number} index
    * @returns {boolean}
    */
    revokeMerkleKey(query, index) {
        var ptr0 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.document_revokeMerkleKey(this.ptr, ptr0, len0, index);
        return ret !== 0;
    }
    /**
    * Generate the difference between two DID Documents and sign it
    * @param {Document} other
    * @param {string} message
    * @param {KeyPair} key
    * @returns {any}
    */
    diff(other, message, key) {
        _assertClass(other, Document);
        var ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        _assertClass(key, KeyPair);
        var ret = wasm.document_diff(this.ptr, other.ptr, ptr0, len0, key.ptr);
        return takeObject(ret);
    }
    /**
    * Verifies the `diff` signature and merges the changes into `self`.
    * @param {string} diff
    */
    merge(diff) {
        var ptr0 = passStringToWasm0(diff, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.document_merge(this.ptr, ptr0, len0);
    }
    /**
    * Serializes a `Document` object as a JSON object.
    * @returns {any}
    */
    toJSON() {
        var ret = wasm.document_toJSON(this.ptr);
        return takeObject(ret);
    }
    /**
    * Deserializes a `Document` object from a JSON object.
    * @param {any} json
    * @returns {Document}
    */
    static fromJSON(json) {
        try {
            var ret = wasm.document_fromJSON(addBorrowedObject(json));
            return Document.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
export class KeyCollection {

    static __wrap(ptr) {
        const obj = Object.create(KeyCollection.prototype);
        obj.ptr = ptr;

        return obj;
    }

    toJSON() {
        return {
            length: this.length,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_keycollection_free(ptr);
    }
    /**
    * Creates a new `KeyCollection` with the specified key type.
    * @param {number} type_
    * @param {number} count
    */
    constructor(type_, count) {
        var ret = wasm.keycollection_new(type_, count);
        return KeyCollection.__wrap(ret);
    }
    /**
    * Returns the number of keys in the collection.
    * @returns {number}
    */
    get length() {
        var ret = wasm.keycollection_length(this.ptr);
        return ret >>> 0;
    }
    /**
    * Returns `true` if the collection contains no keys.
    * @returns {boolean}
    */
    isEmpty() {
        var ret = wasm.keycollection_isEmpty(this.ptr);
        return ret !== 0;
    }
    /**
    * Returns the keypair at the specified `index`.
    * @param {number} index
    * @returns {KeyPair | undefined}
    */
    keypair(index) {
        var ret = wasm.keycollection_keypair(this.ptr, index);
        return ret === 0 ? undefined : KeyPair.__wrap(ret);
    }
    /**
    * Returns the public key at the specified `index` as a base58-encoded string.
    * @param {number} index
    * @returns {string | undefined}
    */
    public(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.keycollection_public(retptr, this.ptr, index);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Returns the secret key at the specified `index` as a base58-encoded string.
    * @param {number} index
    * @returns {string | undefined}
    */
    secret(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.keycollection_secret(retptr, this.ptr, index);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} digest
    * @returns {string}
    */
    merkleRoot(digest) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.keycollection_merkleRoot(retptr, this.ptr, digest);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {number} digest
    * @param {number} index
    * @returns {string | undefined}
    */
    merkleProof(digest, index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.keycollection_merkleProof(retptr, this.ptr, digest, index);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Serializes a `KeyCollection` object as a JSON object.
    * @returns {any}
    */
    toJSON() {
        var ret = wasm.keycollection_toJSON(this.ptr);
        return takeObject(ret);
    }
    /**
    * Deserializes a `KeyCollection` object from a JSON object.
    * @param {any} json
    * @returns {KeyCollection}
    */
    static fromJSON(json) {
        try {
            var ret = wasm.keycollection_fromJSON(addBorrowedObject(json));
            return KeyCollection.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
export class KeyPair {

    static __wrap(ptr) {
        const obj = Object.create(KeyPair.prototype);
        obj.ptr = ptr;

        return obj;
    }

    toJSON() {
        return {
            public: this.public,
            secret: this.secret,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_keypair_free(ptr);
    }
    /**
    * Generates a new `KeyPair` object.
    * @param {number} type_
    */
    constructor(type_) {
        var ret = wasm.keypair_new(type_);
        return KeyPair.__wrap(ret);
    }
    /**
    * Parses a `KeyPair` object from base58-encoded public/secret keys.
    * @param {number} type_
    * @param {string} public_key
    * @param {string} secret_key
    * @returns {KeyPair}
    */
    static fromBase58(type_, public_key, secret_key) {
        var ptr0 = passStringToWasm0(public_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passStringToWasm0(secret_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.keypair_fromBase58(type_, ptr0, len0, ptr1, len1);
        return KeyPair.__wrap(ret);
    }
    /**
    * Returns the public key as a base58-encoded string.
    * @returns {string}
    */
    get public() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.keypair_public(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Returns the secret key as a base58-encoded string.
    * @returns {string}
    */
    get secret() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.keypair_secret(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Serializes a `KeyPair` object as a JSON object.
    * @returns {any}
    */
    toJSON() {
        var ret = wasm.keypair_toJSON(this.ptr);
        return takeObject(ret);
    }
    /**
    * Deserializes a `KeyPair` object from a JSON object.
    * @param {any} json
    * @returns {KeyPair}
    */
    static fromJSON(json) {
        try {
            var ret = wasm.keypair_fromJSON(addBorrowedObject(json));
            return KeyPair.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
export class Method {

    static __wrap(ptr) {
        const obj = Object.create(Method.prototype);
        obj.ptr = ptr;

        return obj;
    }

    toJSON() {
        return {
            id: this.id,
            controller: this.controller,
            type: this.type,
            data: this.data,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_method_free(ptr);
    }
    /**
    * Creates a new `Method` object from the given `key`.
    * @param {KeyPair} key
    * @param {string | undefined} tag
    */
    constructor(key, tag) {
        _assertClass(key, KeyPair);
        var ptr0 = isLikeNone(tag) ? 0 : passStringToWasm0(tag, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.method_new(key.ptr, ptr0, len0);
        return Method.__wrap(ret);
    }
    /**
    * Creates a new `Method` object from the given `did` and `key`.
    * @param {DID} did
    * @param {KeyPair} key
    * @param {string | undefined} tag
    * @returns {Method}
    */
    static fromDID(did, key, tag) {
        _assertClass(did, DID);
        _assertClass(key, KeyPair);
        var ptr0 = isLikeNone(tag) ? 0 : passStringToWasm0(tag, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.method_fromDID(did.ptr, key.ptr, ptr0, len0);
        return Method.__wrap(ret);
    }
    /**
    * Creates a new Merkle Key Collection Method from the given key collection.
    * @param {number} digest
    * @param {DID} did
    * @param {KeyCollection} keys
    * @param {string | undefined} tag
    * @returns {Method}
    */
    static createMerkleKey(digest, did, keys, tag) {
        _assertClass(did, DID);
        _assertClass(keys, KeyCollection);
        var ptr0 = isLikeNone(tag) ? 0 : passStringToWasm0(tag, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.method_createMerkleKey(digest, did.ptr, keys.ptr, ptr0, len0);
        return Method.__wrap(ret);
    }
    /**
    * Returns the `id` DID of the `Method` object.
    * @returns {DID}
    */
    get id() {
        var ret = wasm.method_id(this.ptr);
        return DID.__wrap(ret);
    }
    /**
    * Returns the `controller` DID of the `Method` object.
    * @returns {DID}
    */
    get controller() {
        var ret = wasm.method_controller(this.ptr);
        return DID.__wrap(ret);
    }
    /**
    * Returns the `Method` type.
    * @returns {string}
    */
    get type() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.method_type(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Returns the `Method` public key data.
    * @returns {any}
    */
    get data() {
        var ret = wasm.method_data(this.ptr);
        return takeObject(ret);
    }
    /**
    * Serializes a `Method` object as a JSON object.
    * @returns {any}
    */
    toJSON() {
        var ret = wasm.method_toJSON(this.ptr);
        return takeObject(ret);
    }
    /**
    * Deserializes a `Method` object from a JSON object.
    * @param {any} value
    * @returns {Method}
    */
    static fromJSON(value) {
        try {
            var ret = wasm.method_fromJSON(addBorrowedObject(value));
            return Method.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
export class NewDocument {

    static __wrap(ptr) {
        const obj = Object.create(NewDocument.prototype);
        obj.ptr = ptr;

        return obj;
    }

    toJSON() {
        return {
            key: this.key,
            doc: this.doc,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_newdocument_free(ptr);
    }
    /**
    * @returns {KeyPair}
    */
    get key() {
        var ret = wasm.newdocument_key(this.ptr);
        return KeyPair.__wrap(ret);
    }
    /**
    * @returns {Document}
    */
    get doc() {
        var ret = wasm.newdocument_doc(this.ptr);
        return Document.__wrap(ret);
    }
}
/**
*/
export class VerifiableCredential {

    static __wrap(ptr) {
        const obj = Object.create(VerifiableCredential.prototype);
        obj.ptr = ptr;

        return obj;
    }

    toJSON() {
        return {
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifiablecredential_free(ptr);
    }
    /**
    * @param {any} value
    * @returns {VerifiableCredential}
    */
    static extend(value) {
        try {
            var ret = wasm.verifiablecredential_extend(addBorrowedObject(value));
            return VerifiableCredential.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {Document} issuer_doc
    * @param {any} subject_data
    * @param {string | undefined} credential_type
    * @param {string | undefined} credential_id
    * @returns {VerifiableCredential}
    */
    static issue(issuer_doc, subject_data, credential_type, credential_id) {
        try {
            _assertClass(issuer_doc, Document);
            var ptr0 = isLikeNone(credential_type) ? 0 : passStringToWasm0(credential_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            var ptr1 = isLikeNone(credential_id) ? 0 : passStringToWasm0(credential_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            var ret = wasm.verifiablecredential_issue(issuer_doc.ptr, addBorrowedObject(subject_data), ptr0, len0, ptr1, len1);
            return VerifiableCredential.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * Serializes a `VerifiableCredential` object as a JSON object.
    * @returns {any}
    */
    toJSON() {
        var ret = wasm.verifiablecredential_toJSON(this.ptr);
        return takeObject(ret);
    }
    /**
    * Deserializes a `VerifiableCredential` object from a JSON object.
    * @param {any} json
    * @returns {VerifiableCredential}
    */
    static fromJSON(json) {
        try {
            var ret = wasm.verifiablecredential_fromJSON(addBorrowedObject(json));
            return VerifiableCredential.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
export class VerifiablePresentation {

    static __wrap(ptr) {
        const obj = Object.create(VerifiablePresentation.prototype);
        obj.ptr = ptr;

        return obj;
    }

    toJSON() {
        return {
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifiablepresentation_free(ptr);
    }
    /**
    * @param {Document} holder_doc
    * @param {any} credential_data
    * @param {string | undefined} presentation_type
    * @param {string | undefined} presentation_id
    */
    constructor(holder_doc, credential_data, presentation_type, presentation_id) {
        _assertClass(holder_doc, Document);
        var ptr0 = isLikeNone(presentation_type) ? 0 : passStringToWasm0(presentation_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(presentation_id) ? 0 : passStringToWasm0(presentation_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.verifiablepresentation_new(holder_doc.ptr, addHeapObject(credential_data), ptr0, len0, ptr1, len1);
        return VerifiablePresentation.__wrap(ret);
    }
    /**
    * Serializes a `VerifiablePresentation` object as a JSON object.
    * @returns {any}
    */
    toJSON() {
        var ret = wasm.verifiablepresentation_toJSON(this.ptr);
        return takeObject(ret);
    }
    /**
    * Deserializes a `VerifiablePresentation` object from a JSON object.
    * @param {any} json
    * @returns {VerifiablePresentation}
    */
    static fromJSON(json) {
        try {
            var ret = wasm.verifiablepresentation_fromJSON(addBorrowedObject(json));
            return VerifiablePresentation.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function initWasm(input) {
    if (typeof input === 'undefined') {
        // input = new URL('identity_wasm_bg.wasm', import.meta.url);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_json_parse = function(arg0, arg1) {
        var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_json_serialize = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = JSON.stringify(obj === undefined ? null : obj);
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        var ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        var ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        var ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbg_new_59cb74e423758ede = function() {
        var ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_558ba5917b466edd = function(arg0, arg1) {
        var ret = getObject(arg1).stack;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_4bb6c2a97407129a = function(arg0, arg1) {
        try {
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        var ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_fetch_01d048dd000bcda1 = function(arg0) {
        var ret = fetch(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_292b80706a9c24b1 = handleError(function() {
        var ret = new Headers();
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_append_f8160687f3d187c8 = handleError(function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    });
    imports.wbg.__wbg_fetch_b45fb8bac0b4bf9a = function(arg0, arg1) {
        var ret = getObject(arg0).fetch(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_instanceof_Response_8295bf7aacde3233 = function(arg0) {
        var ret = getObject(arg0) instanceof Response;
        return ret;
    };
    imports.wbg.__wbg_url_0d028e72d84a1b8b = function(arg0, arg1) {
        var ret = getObject(arg1).url;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_status_5580a898717a7097 = function(arg0) {
        var ret = getObject(arg0).status;
        return ret;
    };
    imports.wbg.__wbg_headers_f36154094992b8f5 = function(arg0) {
        var ret = getObject(arg0).headers;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_arrayBuffer_a98df6d58bb5ea26 = handleError(function(arg0) {
        var ret = getObject(arg0).arrayBuffer();
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_text_b2095448993eb3f0 = handleError(function(arg0) {
        var ret = getObject(arg0).text();
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_newwithstrandinit_a58924208f457f33 = handleError(function(arg0, arg1, arg2) {
        var ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_getRandomValues_57e4008f45f0e105 = handleError(function(arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    });
    imports.wbg.__wbg_randomFillSync_d90848a552cbd666 = handleError(function(arg0, arg1, arg2) {
        getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
    });
    imports.wbg.__wbg_self_f865985e662246aa = handleError(function() {
        var ret = self.self;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_static_accessor_MODULE_39947eb3fe77895f = function() {
        var ret = module;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_require_c59851dfa0dc7e78 = handleError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_crypto_bfb05100db79193b = function(arg0) {
        var ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_msCrypto_f6dddc6ae048b7e2 = function(arg0) {
        var ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        var ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        var ret = typeof(getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbg_next_af8c20b8c0d81345 = function(arg0) {
        var ret = getObject(arg0).next;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_next_9d10ccb28a5fd327 = handleError(function(arg0) {
        var ret = getObject(arg0).next();
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_done_faa42c8d1dd8ca9e = function(arg0) {
        var ret = getObject(arg0).done;
        return ret;
    };
    imports.wbg.__wbg_value_9befa7ab4a7326bf = function(arg0) {
        var ret = getObject(arg0).value;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_iterator_de2adb40693c8c47 = function() {
        var ret = Symbol.iterator;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_get_0c6963cbab34fbb6 = handleError(function(arg0, arg1) {
        var ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_call_cb478d88f3068c91 = handleError(function(arg0, arg1) {
        var ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_newnoargs_3efc7bfa69a681f9 = function(arg0, arg1) {
        var ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_f5e0576f61ee7461 = handleError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_getTime_135e6afc6013ba72 = function(arg0) {
        var ret = getObject(arg0).getTime();
        return ret;
    };
    imports.wbg.__wbg_new0_8e8ab0e7714cf1dd = function() {
        var ret = new Date();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_d14bf16e62c6b3d5 = function() {
        var ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_3ea8490cd276c848 = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_160(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            var ret = new Promise(cb0);
            return addHeapObject(ret);
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_resolve_778af3f90b8e2b59 = function(arg0) {
        var ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_367b3e718069cfb9 = function(arg0, arg1) {
        var ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_ac66ca61394bfd21 = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_05c54dcacb623b9a = handleError(function() {
        var ret = self.self;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_window_9777ce446d12989f = handleError(function() {
        var ret = window.window;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_globalThis_f0ca0bbb0149cf3d = handleError(function() {
        var ret = globalThis.globalThis;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_global_c3c8325ae8c7f1a9 = handleError(function() {
        var ret = global.global;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_buffer_ebc6c8e75510eae3 = function(arg0) {
        var ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_ca3d3d8811ecb569 = function(arg0, arg1, arg2) {
        var ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_length_317f0dd77f7a6673 = function(arg0) {
        var ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_new_135e963dedf67b22 = function(arg0) {
        var ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_4a5072a31008e0cb = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_newwithlength_78dc302d31527318 = function(arg0) {
        var ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_subarray_34c228a45c72d146 = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_has_02d2073e8210eefc = handleError(function(arg0, arg1) {
        var ret = Reflect.has(getObject(arg0), getObject(arg1));
        return ret;
    });
    imports.wbg.__wbg_set_61642586f7156f4a = handleError(function(arg0, arg1, arg2) {
        var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
    });
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        var ret = debugString(getObject(arg1));
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_rethrow = function(arg0) {
        throw takeObject(arg0);
    };
    imports.wbg.__wbindgen_memory = function() {
        var ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper2375 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 406, __wbg_adapter_30);
        return addHeapObject(ret);
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }



    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    initWasm.__wbindgen_wasm_module = module;
    wasm.__wbindgen_start();
    return wasm;
}

let __initializedIotaWasm = false

export function init(path) {
    if (__initializedIotaWasm) {
        return Promise.resolve(wasm)
    }
    return initWasm(path || 'identity_wasm_bg.wasm').then(() => {
        __initializedIotaWasm = true
        return wasm
    })
}


