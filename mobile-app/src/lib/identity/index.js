/* tslint:disable */
/* eslint-disable */

import { IOTA_NODE_URL, DEVNET } from '../config';
import Keychain from '../keychain';
import { SchemaNames, DIDMapping } from './schemas';
import { parse } from '../helpers';
import * as IotaIdentity from '../identity.rs/web';

const CLIENT_CONFIG = {
    node: IOTA_NODE_URL,
    network: DEVNET ? 'dev' : 'main',
};

const {
    Digest,
    Document,
    KeyCollection,
    KeyType,
    Method,
    VerifiableCredential,
    // VerifiablePresentation,
} = IotaIdentity;

/**
 * Creates new identity
 *
 * @method createIdentity
 *
 * @returns {Promise}
 */
export const createIdentity = () => {
    return new Promise(async (resolve, reject) => {
        // Initialize the Library - Is cached after first initialization
        await IotaIdentity.init();

        // Generate a new keypair
        const { key, doc } = new Document(KeyType.Ed25519);

        // Add a Merkle Key Collection method for Bob, so compromised keys can be revoked.
        const keys = new KeyCollection(KeyType.Ed25519, 8);
        const method = Method.createMerkleKey(Digest.Sha256, doc.id, keys, 'key-collection');

        // Add to the DID Document as a general-purpose verification method
        doc.insertMethod(method, 'VerificationMethod');

        // Signing
        doc.sign(key);

        // Publish
        await IotaIdentity.publish(doc.toJSON(), CLIENT_CONFIG);
        resolve({
            didDoc: JSON.stringify(doc.toJSON()),
            publicAuthKey: key.public,
            privateAuthKey: key.private,
            doc,
            keys,
            method,
        });
    });
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
export const storeIdentity = (identifier, identity) => {
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
export const retrieveIdentity = (identifier = 'did') => {
    return Keychain.get(identifier)
        .then((data) => parse(data.value))
        .catch(() => null);
};

export const retrieveCredentials = (ids) => {
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
export const createSelfSignedCredential = async (issuer, schemaName, data) => {
    return new Promise(async (resolve, reject) => {
        // Initialize the Library - Is cached after first initialization
        await IotaIdentity.init();

        // Prepare credential Data
        const IssuerDidDoc = Document.fromJSON(JSON.parse(issuer.didDoc));

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
        const signedVc = issuer.doc.signCredential(unsignedVc, {
            method: issuer.method.id.toString(),
            public: issuer.keys.public(0),
            secret: issuer.keys.secret(0),
            proof: issuer.keys.merkleProof(Digest.Sha256, 0),
        });

        // Ensure the credential signature is valid
        console.log("Verifiable Credential JSON", signedVc.toJSON())
        console.log("Verified (credential)", issuer.doc.verify(signedVc))

        // Check the validation status of the Verifiable Credential
        console.log("Credential Validation", await IotaIdentity.checkCredential(signedVc.toString(), CLIENT_CONFIG))

        resolve(signedVc.toJSON());
    });
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
export const storeCredential = (credentialId, credential) => {
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
export const removeCredential = (credentialId) => {
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
export const retrieveCredential = (credentialId) => {
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
export const createVerifiablePresentation = (issuer, credentials, challengeNonce) => {
    return new Promise( async (resolve, reject) => {
        //Initialize the Library - Is cached after first initialization
        await IotaIdentity.init();

        //Prepare some variables
        let issuerDid = Document.fromJSON(JSON.parse(issuer.didDoc));
        let issuerKeypair = IotaIdentity.Key.fromBase58(issuer.publicAuthKey, issuer.privateAuthKey);

        //Create a DID Authentication Credential
        let didAuthCred = new IotaIdentity.VerifiableCredential(
            issuerDid,
            issuerKeypair,
            { DID: issuerDid.id, challengeNonce: challengeNonce},
            "DIDAuthenticationCredential"
        );

        //Add the credentials
        let vcs = [didAuthCred];
        for(let i=0; i < credentials.length; i++) {
            vcs.push(IotaIdentity.VerifiableCredential.fromJSON(credentials[i]));
        }

        //Create the Presentation
        let vp = new IotaIdentity.VerifiablePresentation(issuerDid, issuerKeypair, vcs);
        resolve(vp);
    });
};

export const verifyVerifiablePresentation = (presentation, challenge) => {
    return new Promise(async (resolve, reject) => {
        //Initialize the Library - Is cached after first initialization
        await IotaIdentity.init();
        try {
            //Create from VP
            let vp = IotaIdentity.VerifiablePresentation.fromJSON(presentation);

            let result = IotaIdentity.checkPresentation(vp.toString(), CLIENT_CONFIG);
            let challengeNonce = vp.toJSON()["verifiableCredential"][0]["credentialSubject"]["challengeNonce"];
            //Nonce Challenge
            let challengeResult = false;
            if(typeof challenge === "string") {
                challengeResult = (challenge == challengeNonce);
            } else { //Time Challenge
                challengeResult = (parseInt(challengeNonce) > challenge);
            }
            resolve(result && challengeResult);
        } catch (err) {
            reject("Error during VP Check: " + err);
        }
    });
};

export const enrichCredential = (credential) => {
    const override = DIDMapping[credential.issuer];
    return new Promise((resolve, reject) => {
        const enrichment = {
            issuerLabel: override?.issuerLabel ?? 'selv', // credential.issuer
            logo: override?.logo ?? 'personal',
            credentialLabel: credential?.type[1],
            theme: override?.theme ?? '#550000',
        };
        resolve(enrichment);
    });
};

export const prepareCredentialForDisplay = (credential) => {
    // TODO: deep copy
    const copy = { ...credential, credentialSubject: { ...credential.credentialSubject } };
    // TODO: typing
    if ((copy.credentialSubject).DID) {
        delete (copy.credentialSubject).DID;
    }
    return copy;
};
export const preparePresentationForDisplay = (presentation) => {
    // TODO: deep copy
    const copy = { ...presentation, verifiableCredential: presentation.verifiableCredential };

    // removes DID entry of presentation array
    copy.verifiableCredential = copy.verifiableCredential.filter(
        (credential) => !(Object.keys(credential.credentialSubject).length === 1 && credential.credentialSubject)
    );
    return copy;
};
