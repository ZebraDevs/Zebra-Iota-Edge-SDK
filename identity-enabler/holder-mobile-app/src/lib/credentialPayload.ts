import { get } from "svelte/store";
import { getRandomUserData } from "./helpers";
import { account } from "./store";

/**
 * Creates a schema.org `BloodTest` JSON-LD object.
 * Some information omitted to reduce size of generated VP
 * to fit in a DataMatrix.
 * @returns The `BloodTest`.
 */
export function generateBloodCredential() {
    return {
        "@context": "https://schema.org",
        "@type": "BloodTest",
        code: {
            "@type": "MedicalCode",
            codeValue: "26604007",
            codingSystem: "http://snomed.info/sct"
        },
        description: "Complete blood count",
        usedToDiagnose: {
            "@type": "MedicalCondition",
            code: {
                "@type": "MedicalCode",
                codeValue: "271737000",
                codingSystem: "http://snomed.info/sct"
            },
            description: "Anemia"
        }
    };
}

/**
 * Creates a schema.org `Person` JSON-LD object.
 * Some information omitted to reduce size of generated VP
 * to fit in a DataMatrix.
 * @returns The `Person`.
 */
export async function generatePersonalCredential() {
    const { location, name, email, phone, gender, dob } = await getRandomUserData();
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: get(account).name,
        givenName: name.first,
        familyName: name.last,
        gender,
        birthDate: dob.date.split("T")[0],
        address: {
            "@type": "PostalAddress",
            addressLocality: location.city,
            addressCountry: location.country,
            addressRegion: location.state,
            postalCode: location.postcode + "",
            streetAddress: `${location.street.number} ${location.street.name}`
        },
        email,
        telephone: phone
    };
}

/**
 * Creates a schema.org `MedicalTest` JSON-LD object.
 * Some information omitted to reduce size of generated VP
 * to fit in a DataMatrix.
 * @returns The `MedicalTest`.
 */
export function generateHealthCredential() {
    return {
        "@context": "https://schema.org",
        "@type": "MedicalTest",
        code: {
            "@type": "MedicalCode",
            codeValue: "275926002",
            codingSystem: "http://snomed.info/sct"
        },
        description: "Screening - health check",
        signDetected: {
            "@type": "MedicalSign",
            code: {
                "@type": "MedicalCode",
                codeValue: "102512003",
                codingSystem: "http://snomed.info/sct"
            },
            description: "Healthy adult"
        }
    };
}
