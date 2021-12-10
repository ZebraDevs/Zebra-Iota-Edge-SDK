import { Plugins } from '@capacitor/core';

export async function showAlert(title: string, message: string) {
    const { Modals } = Plugins;
    await Modals.alert({ title, message });
}
