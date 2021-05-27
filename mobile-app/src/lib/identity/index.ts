import { IOTA_NODE_URL, DEVNET } from '../config';
import Keychain from '../keychain';
import { SchemaNames, DIDMapping } from './schemas';
import { parse } from '../helpers';
import type { InternalCredentialDataModel } from '../store';
import * as IotaIdentity from '@iota/identity-wasm/web';

/**
 *  Identity object
 */
 export type Identity = {
    didDoc: string;
    publicAuthKey: string;
    privateAuthKey: string;
    doc: typeof IotaIdentity.Document;
    key: typeof IotaIdentity.KeyPair;
    keys: typeof IotaIdentity.KeyCollection;
    method: typeof IotaIdentity.VerificationMethod;
};

const CLIENT_CONFIG = {
    node: IOTA_NODE_URL,
    network: DEVNET ? 'dev' : 'main',
};

const {
    Digest,
    Document,
    KeyCollection,
    KeyType,
    KeyPair,
    VerificationMethod,
    VerifiableCredential,
    VerifiablePresentation,
} = IotaIdentity;

/**
 * Creates new identity
 *
 * @method createIdentity
 *
 * @returns {Promise}
 */
export async function createIdentity(): Promise<Identity> {
    // Initialize the Library - Is cached after first initialization
    await IotaIdentity.init();

    // Generate a new keypair
    const { key, doc }: any = new Document(KeyType.Ed25519);

    // Add a Merkle Key Collection method for Bob, so compromised keys can be revoked.
    const keys = new KeyCollection(KeyType.Ed25519, 8);
    const method = VerificationMethod.createMerkleKey(Digest.Sha256, doc.id, keys, 'key-collection');

    // Add to the DID Document as a general-purpose verification method
    doc.insertMethod(method, 'VerificationMethod');

    // Signing
    doc.sign(key);

    // Publish
    await IotaIdentity.publish(doc.toJSON(), CLIENT_CONFIG);
    return {
        didDoc: JSON.stringify(doc.toJSON()),
        publicAuthKey: key.public,
        privateAuthKey: key.secret,
        doc,
        key,
        keys,
        method,
    };
};

/**
 * Stores identity in keychain
 *
 * @method storeIdentity
 *
 * @param {string} identifier
 * @param {Identity} identity
 *
 * @returns {Promise}
 */
export function storeIdentity(identifier: string, identity: Identity): Promise<{ value: boolean }> {
    return Keychain.set(identifier, JSON.stringify(identity));
};

/**
 * Stores identity in keychain
 *
 * @method retrieveIdentity
 *
 * @param {string} identifier
 *
 * @returns {Promise}
 */
export function retrieveIdentity(identifier = 'did'): Promise<Identity> {
    return Keychain.get(identifier)
        .then((data) => parse(data.value))
        .catch(() => null);
};

export function retrieveCredentials(ids: string[]): Promise<InternalCredentialDataModel[]> {
    return Promise.all(ids.map((id) => Keychain.get(id) ))
        .then((data) => data.map((entry) => parse(entry.value) ))
        .catch((e) => {
            console.error(e);
            return [];
        });
};

/**
 * Creates credential
 *
 * @method createSelfSignedCredential
 *
 * @param {Identity} issuer
 * @param {SchemaNames} schemaName
 * @param {any} data
 *
 * @returns {Promise}
 */
 export async function createSelfSignedCredential(
    issuer: Identity,
    schemaName: SchemaNames,
    data: any
): Promise<IotaIdentity.VerifiableCredential> {
    // Initialize the Library - Is cached after first initialization
    await IotaIdentity.init();

    // Prepare credential Data
    const IssuerDidDoc = Document.fromJSON(JSON.parse(issuer.didDoc));
    const IssuerKeys = KeyCollection.fromJSON(issuer.keys);
    const IssuerDoc = Document.fromJSON(issuer.doc);
    const IssuerMethod = VerificationMethod.fromJSON(issuer.method);

    // Prepare a credential subject
    const credentialSubject = {
        id: IssuerDidDoc.id.toString(),
        ...data,
    };

    // Issue an unsigned credential
    const unsignedVc = VerifiableCredential.extend({
        id: 'http://example.com/credentials/3732',
        type: schemaName,
        issuer: IssuerDidDoc.id.toString(),
        credentialSubject,
    });

    // Sign the credential with User's Merkle Key Collection method
    const signedVc = IssuerDoc.signCredential(unsignedVc, {
        method: IssuerMethod.id.toString(),
        public: IssuerKeys.public(0),
        secret: IssuerKeys.secret(0),
        proof: IssuerKeys.merkleProof(Digest.Sha256, 0),
    });

    // Ensure the credential signature is valid
    console.log("Verifiable Credential JSON", signedVc.toJSON())
    console.log("Verified (credential)", IssuerDoc.verifyData(signedVc))

    // Check the validation status of the Verifiable Credential
    const validation = await IotaIdentity.checkCredential(signedVc.toString(), CLIENT_CONFIG);
    console.log("Credential Validation", validation.verified);

    if (validation.verified && IssuerDoc.verifyData(signedVc)) {
        return signedVc.toJSON();
    } else {
        return null;
    }
};

/**
 * Stores credential in keychain
 *
 * @method storeCredential
 *
 * @param {string} credentialId
 * @param {VerifiableCredentialDataModel} credential
 *
 * @returns {Promise}
 */
export function storeCredential(credentialId: string, credential: InternalCredentialDataModel): Promise<{ value: boolean }> {
    return Keychain.set(credentialId, JSON.stringify(credential));
};

/**
 * Remove credential from keychain
 *
 * @method removeCredential
 *
 * @param {string} credentialId
 *
 * @returns {Promise}
 */
export function removeCredential(credentialId: string): Promise<{ value: boolean }> {
    return Keychain.remove(credentialId);
};

/**
 * Retrieves credential from keychain
 *
 * @method retrieveCredential
 *
 * @param {string} credentialId
 *
 * @returns {Promise}
 */
export function retrieveCredential(credentialId: string): Promise<IotaIdentity.VerifiableCredential> {
    return Keychain.get(credentialId)
        .then( async (data) =>
            parse(data.value)
        )
        .catch(() => null);
};

/**
 * Creates verifiable presentations for provided schema names
 *
 * @method createVerifiablePresentations
 *
 * @param {Identity} issuer
 * @param {SchemaNamesWithCredentials} schemaNamesWithCredentials
 * @param {string} challengeNonce
 *
 * @returns {Promise}
 */
 export async function createVerifiablePresentation(
    issuer: Identity,
    signedVc : IotaIdentity.VerifiableCredential,
): Promise<IotaIdentity.VerifiablePresentation> {
    //Initialize the Library - Is cached after first initialization
    await IotaIdentity.init();

    // Prepare presentation Data
    const IssuerKey = KeyPair.fromJSON(issuer.key);
    const IssuerDoc = Document.fromJSON(issuer.doc);

    // Create a Verifiable Presentation from the Credential - signed by user's key
    const unsignedVp = new VerifiablePresentation(IssuerDoc, signedVc)

    const signedVp = IssuerDoc.signPresentation(unsignedVp, {
        method: "#key",
        secret: IssuerKey.secret,
    })

    return signedVp.toJSON();
};

export async function verifyVerifiablePresentation(
    presentation: IotaIdentity.VerifiablePresentation
): Promise<boolean> {
    //Initialize the Library - Is cached after first initialization
    await IotaIdentity.init();
    try {
        //Create from VP
        const verifiablePresentation = VerifiablePresentation.fromJSON(presentation);
        const result = await IotaIdentity.checkPresentation(verifiablePresentation.toString(), CLIENT_CONFIG);
        return result?.verified;
    } catch (err) {
        console.error("Error during VP Check: " + err);
        return false;
    }
};

export type VerifiableCredentialEnrichment = {
    issuerLabel: string;
    logo: string;
    credentialLabel: string;
    theme: string;
};

export function enrichCredential(credential: any): VerifiableCredentialEnrichment {
    const override = DIDMapping[credential.issuer];
    const enrichment = {
        issuerLabel: override?.issuerLabel ?? 'selv', // credential.issuer
        logo: override?.logo ?? 'personal',
        credentialLabel: credential?.type[1],
        theme: override?.theme ?? '#550000',
    };
    return enrichment;
};

export function prepareCredentialForDisplay(credential: any): any {
    // TODO: deep copy
    const copy = { ...credential, credentialSubject: { ...credential.credentialSubject } };
    // TODO: typing
    if ((copy.credentialSubject).DID) {
        delete (copy.credentialSubject).DID;
    }
    return copy;
};
export function preparePresentationForDisplay(presentation: any): any {
    // TODO: deep copy
    const copy = { ...presentation, verifiableCredential: presentation.verifiableCredential };

    // removes DID entry of presentation array
    copy.verifiableCredential = copy.verifiableCredential.filter(
        (credential) => !(Object.keys(credential.credentialSubject).length === 1 && credential.credentialSubject)
    );
    return copy;
};
