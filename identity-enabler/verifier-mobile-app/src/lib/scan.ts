import { Plugins } from "@capacitor/core";
import { navigate } from "svelte-routing";
import { ServiceFactory } from "../factories/serviceFactory";
import type { IdentityService } from "../services/identityService";
import { loadingScreen, updateStorage } from "./store";

/**
 * Handles data string captured by Camera, DataWedge or Image selection.
 * 
 * @param decodedText The decoded string to verify and persist.
 * @returns Promise.
 */
export async function handleScannerData(decodedText: string): Promise<void> {
    loadingScreen.set("Parsing credential...");
    let parsedData;

    try {
        parsedData = JSON.parse(decodedText);
    } catch(e) {
        loadingScreen.set();
        navigate('/invalid');
        return;
    }

    if (!parsedData) {
        loadingScreen.set();
        navigate('/invalid');
        return;
    }

    loadingScreen.set("Verifying credential...");
    const identityService = ServiceFactory.get<IdentityService>('identity');
    const verificationResult = await identityService.verifyVerifiablePresentation(parsedData);

    if (verificationResult) {
        await updateStorage('credentials', { [parsedData.verifiableCredential.type[1].split(/\b/)[0].toLowerCase()]: parsedData.verifiableCredential });
        loadingScreen.set();
        const { Toast } = Plugins;
        await Toast.show({
            text: 'Credential verified!',
            position: 'center'
        });
        navigate('/home');
    } else {
        loadingScreen.set();
        navigate('/invalid');
    }
}
