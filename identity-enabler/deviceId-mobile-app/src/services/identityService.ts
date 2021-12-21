import Keychain from "../lib/keychain";
import { DIDMapping } from "../schemas";
import { parse } from "../lib/helpers";
import type { InternalCredentialDataModel } from "../lib/store";
import type { Identity, IdentityConfig, VerifiableCredentialEnrichment } from "../models/types/identity";
import * as IotaIdentity from "@iota/identity-wasm/web";
import { IDENTITY_WASM_PATH } from "../config";

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

    retrieveCredentials(ids: string[]): Promise<InternalCredentialDataModel[]> {
        return Promise.all(ids.map(id => Keychain.get(id)))
            .then(data => data.map(entry => parse(entry.value)))
            .catch(e => {
                console.error(e);
                return [];
            });
    }

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
    storeCredential(credentialId: string, credential: InternalCredentialDataModel): Promise<{ value: boolean }> {
        return Keychain.set(credentialId, JSON.stringify(credential));
    }

    /**
     * Remove credential from keychain
     *
     * @method removeCredential
     *
     * @param {string} credentialId
     *
     * @returns {Promise}
     */
    removeCredential(credentialId: string): Promise<{ value: boolean }> {
        return Keychain.remove(credentialId);
    }

    /**
     * Retrieves credential from keychain
     *
     * @method retrieveCredential
     *
     * @param {string} credentialId
     *
     * @returns {Promise}
     */
    retrieveCredential(credentialId: string): Promise<IotaIdentity.VerifiableCredential> {
        return Keychain.get(credentialId)
            .then(async data => parse(data.value))
            .catch(() => null);
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
        signedVc: IotaIdentity.VerifiableCredential
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

        return signedVp.toJSON();
    }

    async verifyVerifiablePresentation(presentation: IotaIdentity.VerifiablePresentation): Promise<boolean> {
        //Initialize the Library - Is cached after first initialization
        await IotaIdentity.init(IDENTITY_WASM_PATH);
        try {
            //Create from VP
            const verifiablePresentation = VerifiablePresentation.fromJSON(presentation);
            const result = await this.getClient().checkPresentation(JSON.stringify(verifiablePresentation.toJSON()));
            return result?.verified;
        } catch (err) {
            console.error("Error during VP Check: " + err);
            return false;
        }
    }

    enrichCredential(credential: any): VerifiableCredentialEnrichment {
        const override = DIDMapping[credential.issuer];
        const enrichment = {
            issuerLabel: override?.issuerLabel ?? "iota", // credential.issuer
            logo: override?.logo ?? "personal",
            credentialLabel: credential?.type?.[1],
            theme: override?.theme ?? "#550000"
        };
        return enrichment;
    }

    prepareCredentialForDisplay(credential: any): any {
        // TODO: deep copy
        const copy = { ...credential, credentialSubject: { ...credential.credentialSubject } };
        // TODO: typing
        if (copy.credentialSubject.DID) {
            delete copy.credentialSubject.DID;
        }
        return copy;
    }
    preparePresentationForDisplay(presentation: any): any {
        // TODO: deep copy
        const copy = { ...presentation, verifiableCredential: presentation.verifiableCredential };

        // removes DID entry of presentation array
        copy.verifiableCredential = copy.verifiableCredential.filter(
            credential => !(Object.keys(credential.credentialSubject).length === 1 && credential.credentialSubject)
        );
        return copy;
    }
}
