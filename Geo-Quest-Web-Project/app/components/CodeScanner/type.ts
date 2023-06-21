export type CodeScannerProps = {
    goBack: () => void;
    scanQrCode: (value: string) => Promise<string>;
}