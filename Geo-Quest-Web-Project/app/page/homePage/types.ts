import { useRequestType } from "../../hooks/requestHook";
import { useStorageType } from "../../hooks/storageHook";
import { BaseProps } from "../../types/PageProps";
import { Quest } from "../../types/Quest";
import { User } from "../../types/User";

export type HomeProps = {

} & BaseProps;

export type useHomeProps = {
    useStorage: useStorageType,
    useRequest: useRequestType
}

export type useHomeType = (props: useHomeProps) => {
    user?: User,
    quest?: Quest,
    rank?: number,
    score?: number,
    ranking: {
        id: number,
        username: string,
        score: number
    }[],
    loadingRanking: boolean,
    loadingHistory: boolean,
    history: {
        id: number,
        title: string,
        claimDate: string,
        img: string,
    }[],
}