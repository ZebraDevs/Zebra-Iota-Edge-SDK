// TODO: check rule
// eslint-disable-next-line no-shadow
export enum SchemaNames {
    PERSONAL_DATA = "Personal Information",
    HEALTH_TEST = "Health Test",
    BLOOD_TEST = "Blood Test",
    Organisation_ID = "Organisation ID"
}

export const OrganisationDataSchema = {
    type: "object",
    required: ["DID"],
    properties: {
        "Organisation name": {
            type: "string"
        },
        "Organisation number": {
            type: "number"
        },
        "Organization type": {
            type: "string"
        },
        Industry: {
            type: "string"
        },
        "Incorporated on": {
            type: "string"
        },
        "Registered office address": {
            type: "string"
        },
        DeviceData: {
            type: "object",
            properties: {
                id: {
                    type: "string"
                },
                "Device Name": {
                    type: "string"
                },
                Manufacturer: {
                    type: "string"
                },
                "Serial Number": {
                    type: "string"
                },
                "Operating System": {
                    type: "string"
                },
                Model: {
                    type: "string"
                },
                "OS Version": {
                    type: "string"
                }
            }
        }
    }
};

export const PersonalDataSchema = {
    type: "object",
    required: ["DID"],
    properties: {
        DID: {
            type: "string"
        },
        Language: {
            type: "string"
        },
        Locale: {
            type: "string"
        },
        TimezoneOffset: {
            type: "string"
        },
        UserPersonalData: {
            type: "object",
            properties: {
                UserName: {
                    type: "object",
                    properties: {
                        Title: {
                            type: "string"
                        },
                        FirstName: {
                            type: "string"
                        },
                        LastName: {
                            type: "string"
                        }
                    }
                },
                UserDOB: {
                    type: "object",
                    properties: {
                        "Date of Birth": {
                            type: "string"
                        },
                        Age: {
                            type: "number"
                        }
                    }
                },
                Birthplace: {
                    type: "string"
                },
                Nationality: {
                    type: "string"
                },
                Gender: {
                    type: "string"
                },
                "Identity Card Number": {
                    type: "string"
                },
                "Passport Number": {
                    type: "string"
                }
            }
        }
    }
};

export const HealthTestSchema = {
    type: "object",
    required: [],
    properties: {
        "Test ID": {
            type: "string"
        },
        "Test By": {
            type: "string"
        },
        "Test Timestamp": {
            type: "string"
        },
        "Test Kit": {
            type: "string"
        },
        "Test Result": {
            type: "string"
        },
        "Covid-19 Antibodies": {
            type: "number"
        },
        "% supressor cell (T8)": {
            type: "string"
        },
        "% B-cell": {
            type: "string"
        },
        "NK cell activity": {
            type: "number"
        },
        "Concanavalin A": {
            type: "string"
        }
    }
};

export const BloodTestSchema = {
    type: "object",
    required: [],
    properties: {
        "Test ID": {
            type: "string"
        },
        "Test By": {
            type: "string"
        },
        "Test Timestamp": {
            type: "string"
        },
        "TSH (sensitive)": {
            type: "string"
        },
        "LDL Cholesterol": {
            type: "string"
        },
        "Non-HDL Cholesterol": {
            type: "string"
        },
        Triglyceride: {
            type: "string"
        },
        "HbA 1c": {
            type: "string"
        },
        "MCH (HbE)": {
            type: "string"
        },
        "Gamma-GT (G-GT)": {
            type: "string"
        }
    }
};

export const Schemas = {
    [SchemaNames.PERSONAL_DATA]: PersonalDataSchema,
    [SchemaNames.HEALTH_TEST]: HealthTestSchema,
    [SchemaNames.BLOOD_TEST]: BloodTestSchema,
    [SchemaNames.Organisation_ID]: OrganisationDataSchema
};

export const DIDMapping: { [DID: string]: { logo: string; issuerLabel: string; theme: string } } = {
    "did:IOTA:CQMOHTVOCNYQHTSUBSDPNLRBYTBBAHRTOQZZCN9DUWXCVGAYOYGFBEQJOCFXPSCKPPNAZPKALAVYMZICF": {
        issuerLabel: "Government",
        logo: "government",
        theme: "#00ffaa"
    }
};
