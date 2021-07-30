export const vp = {
  "@context": "https://www.w3.org/2018/credentials/v1",
  "type": "VerifiablePresentation",
  "verifiableCredential": {
    "@context": "https://www.w3.org/2018/credentials/v1",
    "id": "http://example.com/credentials/3732",
    "type": [
      "VerifiableCredential",
      "Personal Information"
    ],
    "credentialSubject": {
      "id": "did:iota:4QzkF2bd6VXMXXHAVujUNtxn9nFzPFZWRTwyHujWBoWh",
      "UserPersonalData": {
        "UserName": {
          "FirstName": "Karim",
          "LastName": "Schmidt"
        },
        "UserDOB": {
          "Date of Birth": "Tue Apr 22 1975"
        },
        "Birthplace": "Geraldton",
        "Nationality": "Australia",
        "Identity Card Number": "029885804",
        "Passport Number": "NNK7Y"
      }
    },
    "issuer": "did:iota:4QzkF2bd6VXMXXHAVujUNtxn9nFzPFZWRTwyHujWBoWh",
    "issuanceDate": "2021-07-29T15:26:54Z",
    "proof": {
      "type": "MerkleKeySignature2021",
      "verificationMethod": "#key-collection",
      "signatureValue": "75XiygzowNYS9WDntuL39p6V92kDAVnjmcGbsN3Xr67o.1117tyMBjCpxBM3ax5srrru1Dbsner7KaDBfouocbMcr9BgLT1WED91aDBbPVdb24YetgNkoDpE5cDUsMy15GFuebRaZ6Q97ceACjZMpsp17ms4CY5AwLYweFKEPSuxK8ECWyxJ2j9e.wBVSek3S1fCZoM79QeoucRJp1bqdfTzGzCHd3jMZbMCAcW5Y26PH2M7i7bM9miHABJb4ZcquPtjtW2Sy3EpwmJ2"
    }
  },
  "holder": "did:iota:4QzkF2bd6VXMXXHAVujUNtxn9nFzPFZWRTwyHujWBoWh",
  "proof": {
    "type": "JcsEd25519Signature2020",
    "verificationMethod": "#key",
    "signatureValue": "2E8J2sXN9GaZ7XRpBwsNdGm1drniSp95LTio1znVRXmSRokXRw8ADABpuK1istqjdh9xzJ1DCf7kYYtsBmd6ADPj"
  }
}