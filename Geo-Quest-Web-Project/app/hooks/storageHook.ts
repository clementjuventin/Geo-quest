import AsyncStorage from "@react-native-async-storage/async-storage";

export enum StorageKeys {
    USER = "user",
    RUNNING_QUESTS_CODES = "runningQuests",
    MY_QUESTS_CODES = "myQuests",
    LAST_RUNNING_QUEST = "lastRunningQuest",
    DRAFT_QUESTS = "draftQuests",
}

export const useStorage = () => {
    const setItem = async (key: StorageKeys, value: any) => {
        AsyncStorage.setItem(key, JSON.stringify(value));
    }

    const getItem = async (key: StorageKeys, defaultValue: any) => {
        const item = await AsyncStorage.getItem(key);
        if (item) return JSON.parse(item);
        else if (defaultValue) return defaultValue;
        else return undefined;
    }

    const removeItem = async (key: StorageKeys) => {
        AsyncStorage.removeItem(key);
    }

    return {
        setItem,
        getItem,
        removeItem,
    }
}

export type useStorageType = () => {
    setItem: (key: StorageKeys, value: any) => Promise<void>;
    getItem: (key: StorageKeys, defaultValue?: any) => Promise<any>;
    removeItem: (key: StorageKeys) => void;
};