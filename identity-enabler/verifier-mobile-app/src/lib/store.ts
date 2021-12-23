import { writable } from "svelte/store";
import { persistent } from "./helpers";

export const updateStorage = async (key, value) => {
    try {
        let stored = {};
        let updated = {};
        if (localStorage.getItem(key)) {
            stored = JSON.parse(await localStorage.getItem(key));
            updated = { ...stored, ...value };
        } else {
            updated = [value];
        }
        await localStorage.setItem(key, JSON.stringify(updated));
        return;
    } catch (err) {
        console.error(err);
    }
};

export const getFromStorage = async key => {
    try {
        const json = localStorage.getItem(key);
        if (json) {
            return JSON.parse(json);
        }
        return null;
    } catch (err) {
        console.error(err);
    }
};

export const credentials = persistent<{ personal: string; health: string; blood: string }>("credentials", {
    personal: "",
    health: "",
    blood: ""
});

export const loadingScreen = writable<string | void>();

/**
 * Error string
 */
export const error = writable<string>(null);

let errorTimeout: any;

error.subscribe(item => {
    clearTimeout(errorTimeout);
    if (item) {
        errorTimeout = setTimeout(() => {
            error.set(null);
        }, 3500);
    }
});

export const firstLaunch = persistent<boolean>("firstLaunch", true);
