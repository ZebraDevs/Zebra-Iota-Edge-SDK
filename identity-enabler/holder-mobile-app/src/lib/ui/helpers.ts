import { Plugins } from "@capacitor/core";
import { SchemaNames } from "../../schemas";

export async function showAlert(title: string, message: string) {
    const { Modals } = Plugins;
    await Modals.alert({ title, message });
}

export async function playAudio(sound: string) {
    const audio = new Audio();
    audio.onerror = () => {
        console.error("Audio Play Error", audio.error);
    };

    audio.src = `/audio/${sound}.wav`;

    await audio.play();
}

export const credentialIcon = {
    [SchemaNames.BLOOD_TEST]: "credential",
    [SchemaNames.HEALTH_TEST]: "credential",
    [SchemaNames.PERSONAL_DATA]: "credential",
    [SchemaNames.Organisation_ID]: "zebra"
};
