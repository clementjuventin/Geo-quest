import { useEffect, useState } from "react";
import { Pages } from "../../types/PageProps";
import { useViewLocationsType, useViewLocationsProps, ActionLocation } from "./types";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { User } from "../../types/User";
import { StorageKeys, useStorage } from "../../hooks/storageHook";
import { Location } from "../../types/Location";
import { LocationMapperDTO } from "../../mappers/Location";

export const useViewLocations: useViewLocationsType = (props: useViewLocationsProps) => {
    const {
        navigation,
        quest,
        useRequest,
        useStorage
    } = props;

    const {
        request
    } = useRequest();

    const {
        getItem,
        setItem,
    } = useStorage();

    const isCreationMode = quest === undefined;

    const [error, setError] = useState<string>('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [locations, setLocations] = useState<ActionLocation[]>([]);
    const [user, setUser] = useState<User>();
    const [showQRCode, setShowQRCode] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            // Load user
            getItem(StorageKeys.USER, []).then((user: User) => {
                setUser(user);
            });
            return () => { /* Unfocus */ };
        }, [])
    );

    useEffect(() => {
        loadQuestLocations();
    }, [user]);

    const loadQuestLocations = async () => {
        if (isCreationMode) {
            const draftQuest = await getItem(StorageKeys.DRAFT_QUESTS, {
                locations: [],
            });
            questLocationsCallback(draftQuest.locations);
        }
        else {
            console.log("user", user?.id);
            request(
                "get",
                `getlocations/${quest.id}`,
                {
                    userId: user?.id,
                },
                user?.token,
                questLocationsCallback,
                async (error: any) => {
                    console.log(error);
                }
            );
        }
    }

    const questLocationsCallback = async (data: any) => {
        console.log("data", data)
        const locations = data.map((location: any) => LocationMapperDTO(location)) as Location[];
        const actionLocations = locations.map((location: Location) => {
            return {
                ...location,
                actions: {
                    "Edit": {
                        onClick: () => {
                            navigation.push(Pages.EditLocation, { quest, location });
                        },
                        type: "text" as "text",
                    },
                    "View QR Code": {
                        onClick: () => {
                            setShowQRCode(true);
                        },
                        type: (isCreationMode ? "disabled" : "text") as "text" | "disabled",
                    },
                    "Delete": {
                        onClick: async () => {
                            if (isCreationMode) {
                                const draftQuest = await getItem(StorageKeys.DRAFT_QUESTS, {
                                    locations: [],
                                });
                                draftQuest.locations.splice(locations.indexOf(location), 1);
                                setLocations(actionLocations.filter((actionLocation: ActionLocation) => actionLocation.key !== location.key));
                                setItem(StorageKeys.DRAFT_QUESTS, draftQuest);
                            } else {
                                request("delete", "removelocation", {
                                    userId: user?.id,
                                    locationId: location.key,
                                },
                                    user?.token,
                                    () => loadQuestLocations(),
                                    async (error: any) => {
                                        setError(error.message);
                                        setAlertVisible(true);
                                        // Set alert invisible after 3 seconds
                                        setTimeout(() => {
                                            setAlertVisible(false);
                                        }, 3000);
                                    });
                            }
                        },
                        type: "danger" as "danger"
                    }
                }
            }
        });
        setLocations(actionLocations);
    }

    const createLocationClick = () => {
        navigation.push(Pages.EditLocation, { quest: quest });
    }

    const goBack = () => {
        navigation.goBack();
    }

    return {
        createLocationClick,
        goBack,
        locations,
        error,
        alertVisible,
        showQRCode,
        setShowQRCode
    }
}