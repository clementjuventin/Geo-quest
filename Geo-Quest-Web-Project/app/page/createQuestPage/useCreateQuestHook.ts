import { useEffect, useState } from "react";
import { useCreateQuestProps, useCreateQuestType } from "./types";
import { StorageKeys } from "../../hooks/storageHook";
import { useRequest } from "../../hooks/requestHook";
import { Pages } from "../../types/PageProps";
import { User } from "../../types/User";
import { Location } from "../../types/Location";
import { LocationMapperDTO } from "../../mappers/Location";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

export const useCreateQuest: useCreateQuestType = (props: useCreateQuestProps) => {
    const {
        useStorage,
        navigation,
        quest
    } = props;

    const {
        getItem,
        setItem,
        removeItem,
    } = useStorage();

    const {
        request,
    } = useRequest();

    const goBack = () => {
        removeItem(StorageKeys.DRAFT_QUESTS);
        navigation.goBack();
    }

    const isCreationMode = quest === undefined;
    const originalDate = isCreationMode ? new Date() : new Date();

    const [label, setLabel] = useState<string>(isCreationMode ? '' : quest.name);
    const [description, setDescription] = useState<string>(isCreationMode ? '' : quest.description);
    const [descriptionMessage, setDescriptionMessage] = useState<string>('');
    const [datePickerDate, setDatePickerDate] = useState<Date>(originalDate);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [locations, setLocations] = useState<Location[]>(isCreationMode ? [] : quest.locations);
    const [isActive, setIsActive] = useState(quest?.active || false);
    const [user, setUser] = useState<User>();

    const descriptionLength = 512;

    useEffect(() => {
        setDescriptionMessage(`Description (${description.length}/512 characters)`);
    }, [description]);

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

    //LOCATIONS
    const questLocationsCallback = async (data: any) => {
        const locations = data.map((location: any) => LocationMapperDTO(location)) as Location[];
        quest.locations = locations;
        setLocations(locations);
    }

    const loadQuestLocations = async () => {
        if (quest) {
            request(
                "get",
                `getlocations/${quest.id}`,
                {},
                user?.token,
                questLocationsCallback,
                async (error: any) => {
                    console.log(error);
                }
            );
        }
    }

    useEffect(() => {
        if (!isCreationMode) {
            loadQuestLocations();
        } else {
            getItem(StorageKeys.DRAFT_QUESTS, undefined).then((draftQuest: any) => {
                if (!draftQuest) setItem(StorageKeys.DRAFT_QUESTS, {
                    name: label,
                    description: description,
                    locations: locations,
                    active: isActive,
                    endDate: datePickerDate,
                });
                else {
                    setLabel(draftQuest.name);
                    setDescription(draftQuest.description);
                    // setDatePickerDate(draftQuest.endDate ?? new Date()); TODO: Parse this
                    setIsActive(draftQuest.active);
                    setLocations(draftQuest.locations);
                }
            });
        }
    }, [user]);
    //END LOCATIONS

    useEffect(() => {
        getItem(StorageKeys.USER).then((user: User) => {
            setUser(user);
        });
    }, []);

    const submitQuest = () => {
        if (isCreationMode) {
            addNewQuest();
        }
        else {
            editQuest();
        }
    }

    const editQuest = () => {
        setLoading(true);
        const dateChanged = originalDate !== datePickerDate;

        request("put", "editquest", {
            userId: user?.id,
            questId: quest?.id,
            name: label,
            description: description,
            enddate: dateChanged ? datePickerDate.getUTCDate() : undefined,
            active: isActive,
        }, user?.token,
            async () => {
                removeItem(StorageKeys.DRAFT_QUESTS);
                navigation.navigate(Pages.Navigation);
            },
            errorHandler);
    }

    const errorHandler = async (err: any) => {
        setError(err.message);
        setAlertVisible(true);
        setTimeout(() => {
            setAlertVisible(false);
        }, 3000);
        setLoading(false);
    }

    const addNewQuest = () => {
        setLoading(true);
        const dateChanged = originalDate !== datePickerDate

        request("post", "addquest", {
            userId: user?.id,
            name: label,
            description: description,
            enddate: dateChanged ? datePickerDate.getUTCDate() : undefined,
        }, user?.token,
            async (data: any) => {
                const questsCodes = await getItem(StorageKeys.MY_QUESTS_CODES, []);
                questsCodes.push(data.code);
                await setItem(StorageKeys.MY_QUESTS_CODES, questsCodes);
                locations.forEach((location: Location) => {
                    addLocation(location, data.id);
                });
                removeItem(StorageKeys.DRAFT_QUESTS);
                navigation.navigate(Pages.Navigation);
            },
            errorHandler);
    }

    const addLocation = async (location: any, questId: number) => {
        await request("post", "addlocation", {
            questId: questId,
            name: location.name,
            description: location.description,
            latitude: location.latitude,
            longitude: location.longitude,
        },
            user?.token,
            undefined,
            errorHandler);
    }


    const locationClick = async () => {
        await setItem(StorageKeys.DRAFT_QUESTS, {
            name: label,
            description: description,
            locations: locations,
            active: isActive,
            endDate: datePickerDate,
        });
        navigation.push(Pages.ViewLocations, { quest });
    }

    return {
        goBack,
        label,
        setLabel,
        datePickerDate,
        setDatePickerDate,
        description,
        setDescription,
        descriptionMessage,
        descriptionLength,
        submitQuest,
        locationClick,
        loading,
        error,
        alertVisible,
        locations,
        isActive,
        setIsActive,
        isCreationMode,
    }
}

