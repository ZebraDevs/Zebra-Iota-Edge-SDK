// TODO: check rule
// eslint-disable-next-line no-shadow
export enum CredentialType {
    PERSONAL_DATA = "Personal Information",
    HEALTH_TEST = "Health Test",
    BLOOD_TEST = "Blood Test",
    DEVICE_ID = "Device ID"
}

export const DIDMapping: { [DID: string]: { logo: string; issuerLabel: string; theme: string } } = {
    "did:IOTA:CQMOHTVOCNYQHTSUBSDPNLRBYTBBAHRTOQZZCN9DUWXCVGAYOYGFBEQJOCFXPSCKPPNAZPKALAVYMZICF": {
        issuerLabel: "Government",
        logo: "government",
        theme: "#00ffaa"
    }
};
