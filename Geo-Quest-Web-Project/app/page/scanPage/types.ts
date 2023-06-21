import { useRequestType } from "../../hooks/requestHook";
import { useStorageType } from "../../hooks/storageHook";
import { BaseProps, NavigationType } from "../../types/PageProps";

export type ScanPageProps = {

} & BaseProps;

export type useScanHookType = {
    navigation: NavigationType,
    useRequest: useRequestType,
    useStorage: useStorageType
};

export type useScanHookReturn = {
    goBack: () => void;
    scanQrCode: (value: string) => Promise<string>;
}