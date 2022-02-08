import { writable } from "svelte/store";
import { CredentialType } from "../models/types/CredentialType";
import { persistent } from "./helpers";

const credentialsInitialState = () => ({
    [CredentialType.PersonalInfo]: null,
    [CredentialType.HealthTest]: null,
    [CredentialType.BloodTest]: null,
    [CredentialType.DeviceID]: null
});
export const credentials = persistent<Record<string, unknown | null>>("credentials", credentialsInitialState());

export const loadingScreen = writable<string | null>();

const firstLaunchInitialState = () => true;
export const firstLaunch = persistent<boolean>("firstLaunch", firstLaunchInitialState());

export function resetAllStores() {
    credentials.set(credentialsInitialState());
    loadingScreen.set(null);
    firstLaunch.set(firstLaunchInitialState());
}
