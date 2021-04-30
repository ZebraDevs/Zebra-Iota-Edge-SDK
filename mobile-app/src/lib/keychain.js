import 'capacitor-secure-storage-plugin';
import { Plugins } from '@capacitor/core';

const { SecureStoragePlugin } = Plugins;

/**
 * Keychain adapter
 */
export default {
    get(key) {
        return SecureStoragePlugin.get({ key });
    },
    set(key, value) {
        return SecureStoragePlugin.set({ key, value });
    },
    remove(key) {
        return SecureStoragePlugin.remove({ key });
    },
    clear() {
        return SecureStoragePlugin.clear();
    },
};
