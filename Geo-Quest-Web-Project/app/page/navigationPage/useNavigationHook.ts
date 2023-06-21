import { useEffect, useState } from "react";
import { User } from "../../types/User";
import { useNavigationProps, useNavigationType } from "./types";
import { Pages } from "../../types/PageProps";
import { StorageKeys } from "../../hooks/storageHook";
import { Quest } from "../../types/Quest";
import { QuestMapperDTO } from "../../mappers/Quest";
import { Action, Item } from "../../components/List";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import * as Clipboard from 'expo-clipboard';

export const useNavigation: useNavigationType = (props: useNavigationProps) => {
    const {
        useStorage,
        navigation,
        useRequest,
        params
    } = props;

    const {
        getItem,
        removeItem,
    } = useStorage();

    const {
        request
    } = useRequest();

    const [user, setUser] = useState<User>();
    const [runningQuests, setRunningQuests] = useState<Item[]>([]);
    const [userQuests, setUserQuests] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [rank, setRank] = useState<number>();
    const [score, setScore] = useState<number>();

    const createQuestClick = () => {
        navigation.navigate(Pages.CreateQuest);
    }
    const runningQuestResultCallback = async (data: any) => {
        setRunningQuests(await dtoToViewObject(data));
    }
    const myQuestResultCallback = async (data: any) => {
        setUserQuests(await dtoToViewObject(data));
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

    const loadPage = async () => {
        // Load running quests and user's quests
        const runningQuestCodes = await getItem(StorageKeys.RUNNING_QUESTS_CODES, []) as string[];
        const myQuestCodes = await getItem(StorageKeys.MY_QUESTS_CODES, []) as string[];

        // Await both of the promises to resolve
        const runningQuestPromise = request(
            "post",
            "getquests",
            {
                codes: runningQuestCodes
            },
            user?.token,
            runningQuestResultCallback,
            async (error: any) => {
                console.log(error);
            }
        );
        const userQuestPromise = request(
            "post",
            "getquests",
            {
                codes: myQuestCodes
            },
            user?.token,
            myQuestResultCallback,
            async (error: any) => {
                console.log(error);
            }
        );
        await Promise.all([runningQuestPromise, userQuestPromise]);
        setLoading(false);
    }

    // LOADING
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
        if (user) {
            loadUserScore();
            loadUserRank();
            loadPage();
        }
    }, [user]);

    // UTILS
    const dtoToViewObject = async (data: any) => {
        const quests = data.map((quest: any) => {
            return QuestMapperDTO(quest);
        });
        return quests.map((quest: Quest) => {
            return modelObjectToViewObject(quest);
        });
    }
    const modelObjectToViewObject = (quest: Quest) => {
        const isUserQuest = user?.id === quest.creatorId;
        const deleteAction: Action = {
            onClick: async () => {
                if (isUserQuest) {
                    const codes = await getItem(StorageKeys.MY_QUESTS_CODES, []) as string[];
                    const newCodes = codes.filter((code: string) => {
                        return code !== quest.code;
                    });
                    await useStorage().setItem(StorageKeys.MY_QUESTS_CODES, newCodes);
                    setUserQuests(userQuests.filter((item: Item) => {
                        return item.id !== quest.id;
                    }));
                    loadPage()
                }
                else {
                    const codes = await getItem(StorageKeys.RUNNING_QUESTS_CODES, []) as string[];
                    const lastRunningQuest = await getItem(StorageKeys.LAST_RUNNING_QUEST, "") as string;
                    const newCodes = codes.filter((code: string) => {
                        return code !== quest.code;
                    });
                    await useStorage().setItem(StorageKeys.RUNNING_QUESTS_CODES, newCodes);
                    if (lastRunningQuest === quest.code) {
                        removeItem(StorageKeys.LAST_RUNNING_QUEST);
                    }
                    setRunningQuests(runningQuests.filter((item: Item) => {
                        return item.id !== quest.id;
                    }));
                }
            },
            type: "danger"
        }
        const editAction: Action = {
            onClick: () => {
                navigation.navigate(Pages.CreateQuest, {
                    quest
                });
            },
            type: "text",
        }
        const shareAction: Action = {
            onClick: () => {
                Clipboard.setStringAsync(quest.code);
            },
            type: "text",
        }
        const mapAction: Action = {
            onClick: () => {
                useStorage().setItem(StorageKeys.LAST_RUNNING_QUEST, quest.code);
                navigation.push(
                    Pages.Map, {
                    quest
                });
            },
            type: "text",
        }
        const actions : {
            [label: string]: Action
        }= isUserQuest ? {
            "Edit": editAction,
            "Map": mapAction,
            "Share": shareAction,
            "Delete": deleteAction,
        } : {
            "Map": mapAction,
            "Share": shareAction,
            "Delete": deleteAction,
        };

        return {
            id: quest.id,
            label: quest.name,
            description: quest.description,
            info: "",
            img: quest.img ?? "",
            actions: actions
        };
    }

    return {
        user,
        createQuestClick,
        runningQuests,
        userQuests,
        loading,
        rank,
        score
    }
}

