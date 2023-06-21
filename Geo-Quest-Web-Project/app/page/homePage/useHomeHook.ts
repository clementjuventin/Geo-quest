import { useEffect, useState } from "react";
import { StorageKeys } from "../../hooks/storageHook";
import { User } from "../../types/User";
import { Quest } from "../../types/Quest";
import { QuestMapperDTO } from "../../mappers/Quest";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useHomeProps, useHomeType } from "./types";

export const useHome: useHomeType = (props: useHomeProps) => {
    const {
        useStorage,
        useRequest
    } = props;

    const {
        getItem,
    } = useStorage();

    const {
        request
    } = useRequest();

    const [user, setUser] = useState<User>();
    const [quest, setRunningQuest] = useState<Quest>();
    const [rank, setRank] = useState<number>();
    const [score, setScore] = useState<number>();
    const [ranking, setRanking] = useState<{
        id: number,
        username: string,
        score: number
    }[]>([]);
    const [history, setHistory] = useState<{
        id: number,
        title: string,
        img: string,
        claimDate: string
    }[]>([]);
    const [loadingRanking, setLoadingRanking] = useState<boolean>(true);
    const [loadingHistory, setLoadingHistory] = useState<boolean>(true);

    async function loadRanking() {
        if (user) {
            await request(
                "get",
                `getranking/15`,
                {},
                user.token,
                async (data: any) => {
                    setRanking(data.ranking);
                },
                async (error: any) => {
                    console.log(error);
                }
            );
            setLoadingRanking(false);
        }
    }

    async function loadUserScore() {
        if (user)
            request(
                "get",
                `getrank/${user.id}`,
                {},
                user.token,
                async (data: any) => {
                    setRank(data.rank)
                },
                async (error: any) => {
                    console.log(error);
                }
            );
    }
    async function loadUserRank() {
        if (user)
            request(
                "get",
                `getscore/${user.id}`,
                {},
                user.token,
                async (data: any) => {
                    setScore(data.score as number)
                },
                async (error: any) => {
                    console.log(error);
                }
            );
    }

    async function loadHistory() {
        if (user) {
            request(
                "get",
                `getlocationhistory/${user.id}`,
                {},
                user.token,
                async (data: any) => {
                    const history = data.history.map((item: any) => {
                        return {
                            id: item.locationId,
                            title: item.locationName,
                            img: item.img ?? "https://cdn-icons-png.flaticon.com/512/3503/3503694.png",
                            claimDate: item.claimDate
                        }
                    }
                    );
                    setHistory(history);
                },
                async (error: any) => {
                    console.log(error);
                }
            );
            setLoadingHistory(false);
        }
    }

    async function loadRunningQuest() {
        const code = await getItem(StorageKeys.LAST_RUNNING_QUEST);
        if (code) {
            request(
                "post",
                "getquests",
                {
                    codes: [code]
                },
                user?.token,
                async (data: any) => {
                    if (Array.isArray(data) && data.length > 0) {
                        setRunningQuest(QuestMapperDTO(data[0]));
                    }
                },
                async (error: any) => {
                    console.log(error);
                }
            );
        }
        else {
            setRunningQuest(undefined);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            // Load user
            getItem(StorageKeys.USER).then((user: User) => {
                setUser(user);
            });

            return () => { /* Unfocus */ };
        }, [])
    );

    useEffect(() => {
        loadRunningQuest()
        loadHistory()
        loadUserRank()
        loadUserScore()
        loadRanking()
    }, [user])

    return {
        user,
        quest,
        rank,
        score,
        ranking,
        loadingRanking,
        loadingHistory,
        history
    }
}

