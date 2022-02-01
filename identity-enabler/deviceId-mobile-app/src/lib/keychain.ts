import "capacitor-secure-storage-plugin";
import { Plugins } from "@capacitor/core";

const { SecureStoragePlugin } = Plugins;

/**
 * Keychain adapter.
 */
export default {
    async get(key: string): Promise<{ value: string }> {
        return SecureStoragePlugin.get({ key });
    },
    async set(key: string, value: string): Promise<{ value: boolean }> {
        return SecureStoragePlugin.set({ key, value });
    },
    async remove(key: string): Promise<{ value: boolean }> {
        return SecureStoragePlugin.remove({ key });
    },
    async clear(): Promise<{ value: boolean }> {
        return SecureStoragePlugin.clear();
    }
};
