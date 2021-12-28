The below tutorial demonstrates the use of the IOTA Identity library to produce a Verifiable Credential issued by a manufacturer for one of its devices.

```js
import {
    init,
    Client,
    Config,
    Digest,
    Document,
    KeyCollection,
    KeyPair,
    KeyType,
    Network,
    VerifiableCredential,
    VerificationMethod
} from "@iota/identity-wasm/web";

// Run the tutorial
run()
    .then(() => console.log("Complete!"))
    .catch(() => console.error(err));

async function run() {
    // Ensure the WASM library is initialized. 
    // Note: the library is cached after first initialization.
    await init("/wasm/identity_wasm_bg.wasm");

    const client = await createClient();
    const device = await createIdentity(client);
    const manufacturer = await createIdentity(client);

    // Make up some information about the device.
    const claims = {
        uuid: "d8c9934a-1d6a-4c92-ad6b-5bd2f255dc42",
        name: "Zebra TC21",
        platform: "Android",
        manufacturer: "Zebra Technologies"
    };

    // Turn this information into a Verifiable Credential.
    const vc = await createVerifiableCredential(claims, manufacturer, device);

    console.log(vc.toJSON());
}

async function createClient() {
    // Configure IOTA Identity client to connect to the IOTA mainnet.
    const cfg = Config.fromNetwork(Network.try_from_name("main"));
    cfg.setNode("https://chrysalis-nodes.iota.org");
    cfg.setPermanode("https://chrysalis-chronicle.iota.org/api/mainnet/");
    
    // Return the client.
    return Client.fromConfig(cfg);
}

async function createIdentity(client) {
    // Generate a new key pair and DID document for the new identity.
    const authKeyPair = new KeyPair(KeyType.Ed25519);
    const doc = new Document(authKeyPair, client.network().toString());

    // Add a Merkle Key Collection method for the identity, so compromised keys can be revoked.
    const keys = new KeyCollection(KeyType.Ed25519, 8);
    const method = VerificationMethod.createMerkleKey(Digest.Sha256, doc.id, keys, "key-collection");

    // Add to the DID Document as a general-purpose verification method.
    doc.insertMethod(method, "VerificationMethod");

    // Sign the DID document with the auth key.
    doc.sign(authKeyPair);

    // Publish the document to the Tangle.
    await client.publishDocument(doc);

    // Return the new identity data
    return { authKeyPair, doc, keys, method };
}

async function createVerifiableCredential(claims, issuer, subject) {
    // Create an unsigned credential.
    const unsignedVc = VerifiableCredential.extend({
        id: `http://example.org/zebra-iota-sdk/1234`,
        type: "Device ID",
        issuer: {
            id: issuer.doc.id.toString(),
            name: "Example Issuer"
        },
        credentialSubject: {
            id: subject.doc.id.toString(),
            ...claims
        }
    });

    // Sign the credential with issuer's Merkle Key Collection method.
    const signedVc = issuer.doc.signCredential(unsignedVc, {
        method: issuer.method.id.toString(),
        public: issuer.keys.public(0),
        private: issuer.keys.private(0),
        proof: issuer.keys.merkleProof(Digest.Sha256, 0)
    });

    // Return the signed VC.
    return signedVc;
}
```
