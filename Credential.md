1. Retrieve stored **Identity** by invoking the **`retrieveIdentity()`** function from the **`identityService`**.

```js
import { ServiceFactory } from '../factories/serviceFactory';  

const identityService = ServiceFactory.get('identity');
const storedIdentity = await identityService.retrieveIdentity();
```

2. Prepare **credential payload** as JSON object.

```js
const credentialPayload = {
      UserContacts: {
        Email: 'email@company.com',
        Phone: '111-222-3333'
      }
};
```

3. Generate a new self signed credential by invoking the **createSelfSignedCredential(identiy, schema, credentialPayload)** function from the **`identityService`** 

You can use pre-defined schemas from the `src/schemas` folder or create a custom schema

If you decide to use a pre-defined schema, please import `SchemaNames` from the `src/schemas` folder.

Please use the `storedIdentity` from the **Step 1** 

```js
import { SchemaNames } from '../schemas';

const credential = await identityService.createSelfSignedCredential(storedIdentity, SchemaNames.CONTACT_DETAILS, credentialPayload);
```

4. Optionally enrich the credential with any custom data specific to your application or use-case

```js
const enrichment = identityService.enrichCredential({ ...credential });
```

5. Create credential object and store it in a secure storage for later use

```js
import { updateStorage } from '../lib/store';

const credentialObject = {
      credentialDocument: { ...credential },
      metaInformation: { issuer: 'iota' },
      id: credentialId,
      enrichment
};

await updateStorage('credentials', { [credentialType]: credentialObject });
```
