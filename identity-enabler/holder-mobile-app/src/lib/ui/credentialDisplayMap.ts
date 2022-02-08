import { CredentialType } from "../../models/types/CredentialType";

export const credentialDisplayMap: { [key in CredentialType]: string } = {
    [CredentialType.PersonalInfo]: "Personal Information",
    [CredentialType.BloodTest]: "Blood Test",
    [CredentialType.HealthTest]: "Health Test",
    [CredentialType.DeviceID]: "Device ID"
};
