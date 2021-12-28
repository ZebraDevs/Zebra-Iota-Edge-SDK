The below tutorial demonstrates the use of the IOTA Identity library to produce a DID document and publish it to the Tangle.

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

    console.log(device.doc.toJSON());
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
```
