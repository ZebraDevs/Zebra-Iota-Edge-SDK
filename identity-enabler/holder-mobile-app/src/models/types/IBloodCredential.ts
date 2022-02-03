export interface IBloodCredential {
    "@context": "https://schema.org";
    type: "BloodTest";
    code: {
        type: "MedicalCode";
        codeValue: string;
        codingSystem: string;
    };
    description: string;
    usedToDiagnose: {
        type: "MedicalCondition";
        code: {
            type: "MedicalCode";
            codeValue: string;
            codingSystem: string;
        };
        description: string;
    };
}
