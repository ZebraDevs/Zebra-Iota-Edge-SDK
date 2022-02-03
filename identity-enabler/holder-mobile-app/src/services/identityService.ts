import Keychain from "../lib/keychain";
import { generateRandomNumericString, parse } from "../lib/helpers";
import { account } from "../lib/store";
import type { Identity, IdentityConfig } from "../models/types/identity";
import * as IotaIdentity from "@iota/identity-wasm/web";
import { CREDENTIAL_EXPIRY_DAYS, IDENTITY_WASM_PATH } from "../config";
import { get } from "svelte/store";
import type { CredentialType } from "../models/types/CredentialType";
import type { IVerifiableCredential } from "src/models/types/IVerifiableCredential";

const {
    Client,
    Config,
    Digest,
    Document,
    KeyCollection,
    KeyType,
    KeyPair,
    Network,
    VerificationMethod,
    VerifiableCredential,
    VerifiablePresentation
} = IotaIdentity;

export class IdentityService {
    private client?: IotaIdentity.Client;
    private readonly config: IdentityConfig;

    constructor(config: IdentityConfig) {
        this.config = config;
    }

    /**
     * Get or create the IOTA Identity client
     *
     * @method getClient
     *
     * @returns {IotaIdentity.Client}
     */
    getClient(): IotaIdentity.Client {
        // Client singleton
        if (!this.client) {
            const cfg = Config.fromNetwork(Network.try_from_name(this.config.network));
            cfg.setNode(this.config.node);
            if (this.config.permanode) {
                cfg.setPermanode(this.config.permanode);
            }
            this.client = Client.fromConfig(cfg);
        }

        return this.client;
    }

    /**
     * Creates new identity
     *
     * @method createIdentity
     *
     * @returns {Promise}
     */
    async createIdentity(): Promise<Identity> {
        // Initialize the Library - Is cached after first initialization
        await IotaIdentity.init(IDENTITY_WASM_PATH);
        const client = this.getClient();

        // Generate a new keypair and DID document
        const key = new KeyPair(KeyType.Ed25519);
        const doc = new Document(key, client.network().toString());

        // Add a Merkle Key Collection method for Bob, so compromised keys can be revoked.
        const keys = new KeyCollection(KeyType.Ed25519, 8);
        const method = VerificationMethod.createMerkleKey(Digest.Sha256, doc.id, keys, "key-collection");

        // Add to the DID Document as a general-purpose verification method
        doc.insertMethod(method, "VerificationMethod");

        // Signing
        doc.sign(key);

        // Publish
        await client.publishDocument(doc);
        return {
            didDoc: JSON.stringify(doc.toJSON()),
            publicAuthKey: key.public,
            privateAuthKey: key.private,
            doc,
            key,
            keys,
            method
        };
    }

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
    storeIdentity(identifier: string, identity: Identity): Promise<{ value: boolean }> {
        return Keychain.set(identifier, JSON.stringify(identity));
    }

    /**
     * Stores identity in keychain
     *
     * @method retrieveIdentity
     *
     * @param {string} identifier
     *
     * @returns {Promise}
     */
    retrieveIdentity(identifier = "did"): Promise<Identity> {
        return Keychain.get(identifier)
            .then(data => parse(data.value))
            .catch(() => null);
    }

    /**
     * Clears identity and credentials stored in keychain
     *
     * @method clearIdentityAndCredentials
     *
     * @returns {Promise}
     */
    async clearIdentityAndCredentials(): Promise<void> {
        const { value: success } = await Keychain.clear();
        if (!success) {
            throw new Error("Failed to clear secure storage");
        }
    }

    /**
     * Creates a signed credential
     *
     * @method createSignedCredential
     *
     * @param {string} subjectId
     * @param {Identity} issuer
     * @param {CredentialType} credentialType
     * @param {any} data
     *
     * @returns {Promise}
     */
    async createSignedCredential(
        subjectId: string,
        issuer: Identity,
        credentialType: CredentialType,
        data: any
    ): Promise<IotaIdentity.VerifiableCredential> {
        // Initialize the Library - Is cached after first initialization
        await IotaIdentity.init(IDENTITY_WASM_PATH);

        // Prepare credential Data
        const IssuerDidDoc = Document.fromJSON(JSON.parse(issuer.didDoc));
        const IssuerKeys = KeyCollection.fromJSON(issuer.keys);
        const IssuerDoc = Document.fromJSON(issuer.doc);
        const IssuerMethod = VerificationMethod.fromJSON(issuer.method);

        // Prepare a credential subject
        const credentialSubject = {
            id: subjectId,
            ...data
        };

        // Issue an unsigned credential with expiry midnight in CREDENTIAL_EXPIRY_DAYS days
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + CREDENTIAL_EXPIRY_DAYS);
        expiry.setHours(24, 0, 0, 0);
        const unsignedVc = VerifiableCredential.extend({
            id: `http://example.org/zebra-iota-sdk/${generateRandomNumericString(4)}`,
            type: credentialType,
            issuer: {
                id: IssuerDidDoc.id.toString(),
                name: get(account).name
            },
            credentialSubject,
            expirationDate: expiry.toISOString()
        });

        // Sign the credential with User's Merkle Key Collection method
        const signedVc = IssuerDoc.signCredential(unsignedVc, {
            method: IssuerMethod.id.toString(),
            public: IssuerKeys.public(0),
            private: IssuerKeys.private(0),
            proof: IssuerKeys.merkleProof(Digest.Sha256, 0)
        });

        // Ensure the credential signature is valid
        const svcJson = signedVc.toJSON();

        // Check the validation status of the Verifiable Credential
        const validation = await this.getClient().checkCredential(JSON.stringify(svcJson));

        if (!validation.verified || !IssuerDoc.verifyData(signedVc)) {
            throw new Error("Created credential is invalid.");
        }

        return signedVc;
    }

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
    async createVerifiablePresentation(
        issuer: Identity,
        signedVc: IVerifiableCredential
    ): Promise<IotaIdentity.VerifiablePresentation> {
        //Initialize the Library - Is cached after first initialization
        await IotaIdentity.init(IDENTITY_WASM_PATH);

        // Prepare presentation Data
        const IssuerKeys = KeyCollection.fromJSON(issuer.keys);
        const IssuerDoc = Document.fromJSON(issuer.doc);
        const IssuerMethod = VerificationMethod.fromJSON(issuer.method);

        // Create a Verifiable Presentation from the Credential - signed by user's key
        const unsignedVp = new VerifiablePresentation(IssuerDoc, signedVc);

        const signedVp = IssuerDoc.signPresentation(unsignedVp, {
            method: IssuerMethod.id.toString(),
            public: IssuerKeys.public(0),
            private: IssuerKeys.private(0),
            proof: IssuerKeys.merkleProof(Digest.Sha256, 0)
        });

        return signedVp;
    }
}
