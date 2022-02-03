export interface IHealthCredential {
    "@context": "https://schema.org";
    type: "MedicalTest";
    code: {
        type: "MedicalCode";
        codeValue: string;
        codingSystem: string;
    };
    description: string;
    signDetected: {
        type: "MedicalSign";
        code: {
            type: "MedicalCode";
            codeValue: string;
            codingSystem: string;
        };
        description: string;
    };
}
