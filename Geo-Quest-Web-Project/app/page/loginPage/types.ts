import { BaseProps, NavigationType } from "../../types/PageProps";
import { useRequestType } from "../../hooks/requestHook";
import { useStorageType } from "../../hooks/storageHook";

export type LoginProps = {

} & BaseProps;

export type useLoginHookProps = {
    navigation: NavigationType,
    useRequest: useRequestType;
    useStorage: useStorageType;
}

export type useLoginHookReturn = {
    login: string;
    setLogin: (login: string) => void;
    password: string;
    setPassword: (password: string) => void;
    message: string;
    valid: boolean;
    navigateToSignUp: () => void;
    tryLogin: () => void;
}