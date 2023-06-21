import { useStorageType } from "../../hooks/storageHook";
import { BaseProps } from "../../types/PageProps";

export type AddCodeProps = {

} & BaseProps;

export type useAddCodeProps = {
    useStorage: useStorageType,
    navigate: (page: string) => void;
}

export type useAddCodeType = (props: useAddCodeProps) => {
    label: string;
    setLabel: (label: string) => void;
    submit: () => void;
    error: string;
    showError: boolean;
}