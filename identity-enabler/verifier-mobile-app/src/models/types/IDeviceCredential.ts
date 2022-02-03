export interface IDeviceCredential {
    "@context": ["https://schema.org", "https://smartdatamodels.org/context.jsonld"];
    type: ["Product", "Device"];
    identifier: string;
    name: string;
    model: {
        type: "DeviceModel";
        modelName: string;
        manufacturerName: string;
    };
    osVersion: string;
}
