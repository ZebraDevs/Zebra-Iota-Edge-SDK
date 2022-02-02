declare interface Window {
    onScan: (decodedText: string) => Promise<void>;
}
