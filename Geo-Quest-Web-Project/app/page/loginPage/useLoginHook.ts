import { useEffect, useState } from "react";
import { useLoginHookProps } from "./types";
import { StorageKeys } from "../../hooks/storageHook";
import { Pages } from "../../types/PageProps";
import { User } from "../../types/User";

export const useLoginHook = (props: useLoginHookProps) => {
    const { navigation, useRequest, useStorage } = props;

    const {
        request,
    } = useRequest();

    const {
        setItem,
        getItem,
        removeItem
    } = useStorage();

    removeItem(StorageKeys.USER);
    removeItem(StorageKeys.DRAFT_QUESTS);
    removeItem(StorageKeys.MY_QUESTS_CODES)
    removeItem(StorageKeys.RUNNING_QUESTS_CODES)
    removeItem(StorageKeys.LAST_RUNNING_QUEST)

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState<string>("");
    const [valid, setValid] = useState(true);

    const navigateToSignUp = () => {
        navigation.push(Pages.SignUp, {});
    }

    useEffect(() => {
        setValid(true);
    }, [login, password]);

    const tryLogin = async () => {
        requestLogin(login, password);
    }

    const requestLogin = async (username: string, password: string) => {
        request("post", "signIn", { username, password }, undefined, async (data) => {
            const user: User = {
                id: data.id,
                username: data.username,
                password: password,
                creationDate: data.creationDate,
                claims: data.claims,
                quests: data.quests,
                token: data.token,
            }
            setItem(StorageKeys.USER, user);
            navigation.navigate(Pages.Home);
        }, async (error) => {
            console.log(error);
            setMessage("Login or password is incorrect");
            setValid(false);
        }
        );
    }

    useEffect(() => {
        getItem(StorageKeys.USER).then((user: User) => {
            if (user && user.username && user.password) {
                requestLogin(user.username, user.password);
            }
        });
    }, []);

    return {
        login,
        setLogin,
        password,
        setPassword,
        message,
        valid,
        navigateToSignUp,
        tryLogin,
    }
}