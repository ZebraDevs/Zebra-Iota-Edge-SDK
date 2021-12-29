import { writable } from "svelte/store";
import { persistent } from "./helpers";

const credentialsInitialState = {
    personal: "",
    health: "",
    blood: "",
    device: ""
};
export const credentials = persistent<{ personal: string; health: string; blood: string; device: string }>(
    "credentials",
    credentialsInitialState
);

export const loadingScreen = writable<string | void>();

const firstLaunchInitialState = true;
export const firstLaunch = persistent<boolean>("firstLaunch", firstLaunchInitialState);

export function resetAllStores() {
    credentials.set(credentialsInitialState);
    loadingScreen.set();
    firstLaunch.set(firstLaunchInitialState);
}
