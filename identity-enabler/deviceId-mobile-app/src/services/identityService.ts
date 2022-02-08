import * as IotaIdentity from "@iota/identity-wasm/web";
import { IDENTITY_WASM_PATH } from "../config";
import Keychain from "../lib/keychain";
import type { Identity, IdentityConfig } from "../models/types/identity";

const { Client, Config, Digest, Document, KeyCollection, KeyType, KeyPair, Network, VerificationMethod } = IotaIdentity;

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

    public async verifyVerifiablePresentation(presentation: string): Promise<boolean> {
        // Initialize the Library - Is cached after first initialization
        await IotaIdentity.init(IDENTITY_WASM_PATH);
        const result = await this.getClient().checkPresentation(presentation);
        return Boolean(result?.verified);
    }
}
