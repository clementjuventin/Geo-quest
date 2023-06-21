import { useEffect, useState } from "react";
import { useEditLocationProps, useEditLocationType } from "./types";
import { StorageKeys, useStorage } from "../../hooks/storageHook";
import { useRequest } from "../../hooks/requestHook";
import { User } from "../../types/User";
import { LatLng } from "react-native-maps";
import { get } from "cypress/types/lodash";

export const useEditLocation: useEditLocationType = (props: useEditLocationProps) => {
    const {
        navigation,
        quest,
        location
    } = props;

    const isCreationMode = quest === undefined;
    const isLocationCreationMode = location === undefined;

    const [label, setLabel] = useState<string>('');
    const [labelError, setLabelError] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [descriptionMessage, setDescriptionMessage] = useState<string>('');
    const [coordinates, setCoordinates] = useState<LatLng>();
    const [coordinatesError, setCoordinatesError] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState<User>();

    const descriptionLength = 512;

    useEffect(() => {
        setDescriptionMessage(`Description (${description.length}/512 characters)`);
    }, [description]);

    const {
        getItem,
        setItem
    } = useStorage();
    const {
        request,
    } = useRequest();

    const validateLabel = () => {
        let valid = true;
        if (label.length === 0) {
            setLabelError('Label is required');
            valid = false;
        }
        else {
            setLabelError('');
        }
        return valid;
    }

    const validateCoordinates = () => {
        let valid = true;
        if (coordinates === undefined) {
            setCoordinatesError('Coordinates are required');
            valid = false;
        }
        else {
            setCoordinatesError('');
        }
        return valid;
    }

    const goBack = () => {
        navigation.goBack();
    }

    const submitLocation = async () => {
        setIsTyping(false);
        setLoading(true);
        const validLabel = validateLabel();
        const validCoordinates = validateCoordinates();
        if (validLabel && validCoordinates) {
            if (isCreationMode) {
                const quest = await getItem(StorageKeys.DRAFT_QUESTS, {
                    locations: []
                });
                if (isLocationCreationMode) { // (create the location object and add it to the draft quest)
                    quest.locations.push({
                        id: quest.locations.reduce((max: number, location: any) => location.key > max ? location.key : max, 0) + 1,
                        name: label,
                        description: description,
                        latitude: coordinates?.latitude,
                        longitude: coordinates?.longitude,
                    });
                }
                else { // Update the location object (stored in the draft quest)
                    const location = quest.locations.find((location: any) => location.key === location?.key);
                    if (location) {
                        location.name = label;
                        location.description = description;
                        location.latitude = coordinates?.latitude;
                        location.longitude = coordinates?.longitude;
                    }
                    quest.locations = quest.locations.map((location: any) => location.key === location?.key ? location : location);
                }
                await setItem(StorageKeys.DRAFT_QUESTS, quest);
                successHandler();
            }
            else {
                if (isLocationCreationMode) { // (create the location object and add it to the quest online)
                    request("post", "addlocation", {
                        questId: quest?.id,
                        name: label,
                        description: description,
                        latitude: coordinates?.latitude,
                        longitude: coordinates?.longitude,
                    },
                        user?.token,
                        successHandler,
                        errorHandler);
                }
                else { // (update the location object online)
                    request("put", "editlocation", {
                        userId: user?.id,
                        locationId: location?.key,
                        name: label,
                        description: description,
                        latitude: coordinates?.latitude,
                        longitude: coordinates?.longitude,
                    },
                        user?.token,
                        successHandler,
                        errorHandler);
                }
            }
        }
        else {
            setLoading(false);
        }
    }

    const successHandler = async () => {
        setLoading(false);
        navigation.goBack();
    };

    const errorHandler = async (error: any) => {
        setError(error.message);
        setAlertVisible(true);
        // Set alert invisible after 3 seconds
        setTimeout(() => {
            setAlertVisible(false);
        }, 3000);
        setLoading(false);
    };

    // LOAD USER
    useEffect(() => {
        getItem(StorageKeys.USER, []).then((user: User) => {
            setUser(user);
        });
    }, []);

    // VALIDATION
    useEffect(() => {
        if (!isTyping) {
            validateLabel();
        }
    }, [label]);
    useEffect(() => {
        if (!isTyping) {
            validateCoordinates();
        }
    }, [coordinates]);

    useEffect(() => {
        if (!isLocationCreationMode) {
            setLabel(location?.title || '');
            setDescription(location?.description || '');
            setCoordinates({
                latitude: location?.xCoordinate || 0,
                longitude: location?.yCoordinate || 0,
            });
        }
    }, []);

    return {
        goBack,
        label,
        setLabel,
        labelError,
        description,
        setDescription,
        descriptionMessage,
        descriptionLength,
        coordinates,
        coordinatesError,
        submitLocation,
        setCoordinates,
        error,
        alertVisible,
        loading,
    }
}

