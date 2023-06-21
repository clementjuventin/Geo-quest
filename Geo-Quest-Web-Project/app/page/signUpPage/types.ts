import { useRequestType } from "../../hooks/requestHook";
import { useStorageType } from "../../hooks/storageHook";
import { BaseProps } from "../../types/PageProps";

export type SignUpProps = {

} & BaseProps;

export type useSignUpHookProps = {
    navigate: (route: string) => void
    useRequest: useRequestType,
    useStorage: useStorageType,
}

export type useSignUpHookReturn = {
    login: string,
    setLogin: (login: string) => void,
    password: string,
    setPassword: (password: string) => void,
    loginMessage: string,
    passwordMessage: string,
    validLogin: boolean,
    validPassword: boolean,
    canSignUp: boolean,
    navigateToLogin: () => void,
    signUp: () => Promise<void>,
    isLoading: boolean,
}