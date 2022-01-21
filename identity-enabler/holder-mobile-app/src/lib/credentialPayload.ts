import { get } from "svelte/store";
import { getRandomUserData } from "./helpers";
import { account } from "./store";

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
