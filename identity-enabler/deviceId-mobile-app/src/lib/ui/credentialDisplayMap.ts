import { CredentialType } from "../../models/types/CredentialType";

export const credentialDisplayMap: { [key in CredentialType]: string } = {
    [CredentialType.PERSONAL_INFO]: "Personal Information",
    [CredentialType.BLOOD_TEST]: "Blood Test",
    [CredentialType.HEALTH_TEST]: "Health Test",
    [CredentialType.DEVICE_ID]: "Device ID"
};
