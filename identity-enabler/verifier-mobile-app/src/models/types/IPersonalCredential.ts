export interface IPersonalCredential {
    "@context": "https://schema.org";
    type: "Person";
    name: string;
    givenName: string;
    familyName: string;
    gender: string;
    birthDate: string;
    address: {
        type: "PostalAddress";
        addressLocality: string;
        addressCountry: string;
        addressRegion: string;
        postalCode: string;
        streetAddress: string;
    };
    email: string;
    telephone: string;
}
