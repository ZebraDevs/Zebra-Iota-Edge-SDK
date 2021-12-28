import { Plugins } from "@capacitor/core";
import { wait } from "../helpers";

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

/**
 * Shorten a DID for display.
 *
 * @param did DID
 * @returns Short DID with ellipsis.
 */
export function shortenDID(did: string): string {
    return `${did.substring(0, 15)}...${did.substring(did.length - 6)}`;
}

/**
 * Dispatch a custom multiClick event on an element when user clicks element multiple times in succession.
 * @param node The node to which this is attached.
 * @param opts Parameters to configure the multiClick event.
 */
export function multiClick(node: HTMLElement, opts?: { numClicks?: number; maxDelay?: number }): void {
    let clicks = 0;

    const handleClick = async (_: MouseEvent) => {
        const thisClicks = ++clicks;

        if (thisClicks === (opts?.numClicks ?? 2)) {
            node.dispatchEvent(new CustomEvent<void>("multiClick"));
            clicks = 0;
            return;
        }

        await wait(opts?.maxDelay ?? 500);

        if (thisClicks === clicks) {
            clicks = 0;
        }
    };

    node.addEventListener("click", handleClick);
}
