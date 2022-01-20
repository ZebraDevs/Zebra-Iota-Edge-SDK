import { get } from "svelte/store";
import { getRandomUserData } from "./helpers";
import { account } from "./store";

export function generateBloodCredential() {
    return {
        "Test ID": "91736458",
        "Test By": "Labor 28 GmbH",
        "Test Timestamp": new Date(1621507920000).toDateString(),
        "TSH (sensitive)": "3.36 mU/l",
        "LDL Cholesterol": "168 mg/dl",
        "Non-HDL Cholesterol": "175.8 mg/dl",
        Triglyceride: "120 mg/dl",
        "HbA 1c": "5.1 %",
        "MCH (HbE)": "31.5 pg",
        "Gamma-GT (G-GT)": "11 U/l"
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
        "Test ID": "01745562",
        "Test By": "Lab services Ltd",
        "Test Timestamp": new Date(1583407920000).toDateString(),
        "Test Kit": "PowerChek MERS-CoV",
        "Test Result": "Negative",
        "Covid-19 Antibodies": 0,
        "% supressor cell (T8)": "20 %",
        "% B-cell": "12 %",
        "NK cell activity": 45,
        "Concanavalin A": "93 %"
    };
}
