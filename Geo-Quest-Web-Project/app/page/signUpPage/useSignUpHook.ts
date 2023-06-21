import { useEffect, useState } from "react";
import { Pages } from "../../types/PageProps";
import { useSignUpHookProps } from "./types";
import { StorageKeys } from "../../hooks/storageHook";
import { User } from "../../types/User";
import { set } from "cypress/types/lodash";

export const useSignUpHook = (props: useSignUpHookProps) => {
    const { navigate, useRequest, useStorage } = props;

    const {
        request,
    } = useRequest();

    const {
        setItem,
    } = useStorage();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [loginMessage, setLoginMessage] = useState<string>("");
    const [passwordMessage, setPasswordMessage] = useState<string>("");

    const [validLogin, setValidLogin] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const [canSignUp, setCanSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (login === "") {
            setLoginMessage("Login should not be empty");
        }
        else {
            setLoginMessage("");
            setValidLogin(true);
        }
    }, [login]);

    useEffect(() => {
        if (password === "") {
            setPasswordMessage("Password should not be empty");
        }
        else {
            setPasswordMessage("");
            setValidPassword(true);
        }
    }, [password]);

    useEffect(() => {
        setCanSignUp(validLogin && validPassword && login !== "" && password !== "")
    }, [validLogin, validPassword, login, password]);

    const navigateToLogin = () => {
        navigate(Pages.Login);
    }
    const signUp = async () => {
        if (login === "" || password === "") {
            setValidLogin(false);
            setValidPassword(false);
            return;
        }
        else {
            setIsLoading(true);
            request("post", "signUp", { username: login, password: password }, undefined, async (data) => {
                const user: User = {
                    id: data.id,
                    username: data.username,
                    password: password,
                    creationDate: data.creationDate,
                    claims: [],
                    quests: [],
                    token: data.token,
                }
                setItem(StorageKeys.USER, user);
                navigate(Pages.Home);
                setIsLoading(false);
            }, async (error) => {
                console.log(error);
                setLoginMessage(error.message);
                setValidLogin(false);
                setIsLoading(false);
            }
            );
        }
    }

    return {
        login,
        setLogin,
        password,
        setPassword,
        loginMessage,
        passwordMessage,
        validLogin,
        validPassword,
        canSignUp,
        navigateToLogin,
        signUp,
        isLoading,
    }
}