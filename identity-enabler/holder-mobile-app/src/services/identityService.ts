import * as IotaIdentity from "@iota/identity-wasm/web";
import { get } from "svelte/store";
import { CREDENTIAL_EXPIRY_DAYS, IDENTITY_WASM_PATH } from "../config";
import { generateRandomNumericString } from "../lib/helpers";
import Keychain from "../lib/keychain";
import { account } from "../lib/store";
import type { CredentialType } from "../models/types/CredentialType";
import type { Identity, IdentityConfig } from "../models/types/identity";

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
     * Get existing or create the IOTA Identity client.
     *
     * @returns The client.
     */
     public getClient(): IotaIdentity.Client {
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
     * Creates new identity.
     *
     * @returns A new identity.
     */
     public async createIdentity(): Promise<Identity> {
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
     * Stores identity in keychain.
     *
     * @param identifier Key from which to retrieve identity.
     * @param identity The identity information to store.
     * @returns Success/failure.
     */
     public async storeIdentity(identifier: string, identity: Identity): Promise<{ value: boolean }> {
        return Keychain.set(identifier, JSON.stringify(identity));
    }

    /**
     * Stores identity in keychain.
     *
     * @param identifier Key from which to retrieve identity.
     * @returns The identity information.
     */
     public async retrieveIdentity(identifier = "did"): Promise<Identity> {
        const result = await Keychain.get(identifier);
        return JSON.parse(result.value) as Identity;
    }

    /**
     * Clears identity and credentials stored in keychain.
     */
     public async clearIdentityAndCredentials(): Promise<void> {
        const { value: success } = await Keychain.clear();
        if (!success) {
            throw new Error("Failed to clear secure storage");
        }
    }

    /**
     * Creates a signed credential.
     *
     * @param subjectId DID of the subject.
     * @param issuer Issuer identity information.
     * @param credentialType The type of credential.
     * @param data The claims to add to the credentialSubject.
     * @returns The new Verifiable Credential.
     */
    public async createSignedCredential(
        subjectId: string,
        issuer: Identity,
        credentialType: CredentialType,
        data: Record<string, unknown>
    ): Promise<IotaIdentity.VerifiableCredential> {
        // Initialize the Library - Is cached after first initialization
        await IotaIdentity.init(IDENTITY_WASM_PATH);

        // Prepare credential Data
        const issuerDidDoc = Document.fromJSON(JSON.parse(issuer.didDoc));
        const issuerKeys = KeyCollection.fromJSON(issuer.keys);
        const issuerDoc = Document.fromJSON(issuer.doc);
        const issuerMethod = VerificationMethod.fromJSON(issuer.method);

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
                id: issuerDidDoc.id.toString(),
                name: get(account).name
            },
            credentialSubject,
            expirationDate: expiry.toISOString()
        });

        // Sign the credential with User's Merkle Key Collection method
        const signedVc = issuerDoc.signCredential(unsignedVc, {
            method: issuerMethod.id.toString(),
            public: issuerKeys.public(0),
            private: issuerKeys.private(0),
            proof: issuerKeys.merkleProof(Digest.Sha256, 0)
        });

        // Ensure the credential signature is valid
        const svcJson = signedVc.toJSON();

        // Check the validation status of the Verifiable Credential
        const validation = await this.getClient().checkCredential(JSON.stringify(svcJson));

        if (!validation.verified || !issuerDoc.verifyData(signedVc)) {
            throw new Error("Created credential was not valid.");
        }

        return signedVc;
    }

    /**
     * Creates verifiable presentation from a VC.
     *
     * @param issuer Issuer identity information.
     * @param signedVc The signed VC to encapsulate in a VP.
     * @returns The Verifiable Presentation.
     */
    public async createVerifiablePresentation(
        issuer: Identity,
        signedVc: IotaIdentity.VerifiableCredential
    ): Promise<IotaIdentity.VerifiablePresentation> {
        // Initialize the Library - Is cached after first initialization
        await IotaIdentity.init(IDENTITY_WASM_PATH);

        // Prepare presentation Data
        const issuerKeys = KeyCollection.fromJSON(issuer.keys);
        const issuerDoc = Document.fromJSON(issuer.doc);
        const issuerMethod = VerificationMethod.fromJSON(issuer.method);

        // Create a Verifiable Presentation from the Credential - signed by user's key
        const unsignedVp = new VerifiablePresentation(issuerDoc, signedVc);

        const signedVp = issuerDoc.signPresentation(unsignedVp, {
            method: issuerMethod.id.toString(),
            public: issuerKeys.public(0),
            private: issuerKeys.private(0),
            proof: issuerKeys.merkleProof(Digest.Sha256, 0)
        });

        return signedVp;
    }
}
