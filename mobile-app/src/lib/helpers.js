import { v4 as uuidv4 } from 'uuid';
import { writable } from 'svelte/store';
import { RANDOM_USER_DATA_API_URL } from './config';

/**
 * Parses serialised data
 *
 * @method parse
 *
 * @param {string} data
 * @returns {object}
 */
export const parse = (data) => {
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
};

/**
 * Gets random user data
 *
 * @method getRandomUserData
 *
 * @returns {Promise}
 */
export const getRandomUserData = () => {
    return fetch(RANDOM_USER_DATA_API_URL)
        .then((response) => response.json())
        .then((result) => {
            const randomData = result.results[0];

            return randomData;
        });
};

/**
 * Converts byte array to hex
 *
 * @method convertByteArrayToHex
 *
 * @param {Uint8Array} bytes
 *
 * @return {string}
 */
export const convertByteArrayToHex = (bytes) => {
    const hex = [];

    /* eslint-disable no-plusplus,no-bitwise */
    for (let i = 0; i < bytes.length; i++) {
        const current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xf).toString(16));
    }

    /* eslint-enable no-plusplus,no-bitwise */
    return hex.join('');
};

export const isVerifiablePresentation = (payload) => {
    return !!(payload).verifiableCredential?.length;
};

export const isVerifiableCredential = (payload) => {
    return !!(payload).credentialSubject;
};

/**
 * Updates application path
 *
 * @method goto
 *
 * @param {string} path
 *
 * @returns {void}
 */
export const goto = (path, params = null) => {
    window.location.hash = `${path}${params ? `?${new URLSearchParams(params).toString()}` : ''}`;
};

/**
 * Synchronous timeout
 *
 * @method delay
 *
 * @param {number} ms
 *
 * @returns {void}
 */
export const delay = (ms) => {
    const startPoint = new Date().getTime();
    while (new Date().getTime() - startPoint <= ms);
};


/**
 * Persist a writable Svelte store to local storage
 */
export const persistent = (key, initialValue, saveTransformation = null) => {
    let value = initialValue;

    try {
        const json = localStorage.getItem(key);
        if (json) {
            value = JSON.parse(json);
        }
    } catch (err) {
        console.error(err);
    }

    const state = writable(value);

    state.subscribe(($value) => {
        localStorage.setItem(key, JSON.stringify(saveTransformation ? saveTransformation($value) : $value));
    });

    return state;
};

export const generateRandomId = () => uuidv4();
