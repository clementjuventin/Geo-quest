import { Item } from "../../components/List";
import { useRequestType } from "../../hooks/requestHook";
import { useStorageType } from "../../hooks/storageHook";
import { BaseProps, NavigationType } from "../../types/PageProps";
import { User } from "../../types/User";

export type NavigationProps = {

} & BaseProps;

export type useNavigationProps = {
    useStorage: useStorageType,
    useRequest: useRequestType,
    navigation: NavigationType,
    params: any;
}

export type useNavigationType = (props: useNavigationProps) => {
    user?: User,
    createQuestClick: () => void;
    runningQuests: Item[];
    userQuests: Item[];
    loading: boolean;
    rank?: number;
    score?: number;
}