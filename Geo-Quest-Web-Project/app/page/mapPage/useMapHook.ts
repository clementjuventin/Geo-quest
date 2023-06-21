import { useEffect, useState } from "react";
import { Pages } from "../../types/PageProps";
import { User } from "../../types/User";
import { useMapHookProps, useMapHookReturn } from "./types";
import { StorageKeys } from "../../hooks/storageHook";
import { LocationMapperDTO } from "../../mappers/Location";
import { Location } from "../../types/Location";
import { Region } from "react-native-maps";

export const useMapHook = (props: useMapHookProps): useMapHookReturn => {
    const {
        useRequest,
        quest,
        useStorage,
    } = props;

    const {
        request,
    } = useRequest();

    const {
        getItem
    } = useStorage();

    const [user, setUser] = useState<User>();
    const [locations, setLocations] = useState<Location[]>([]);
    const [initialRegion, setInitialRegion] = useState<Region>();

    const goBack = () => {
        props.navigation.goBack();
    }

    const questLocationsCallback = async (data: any) => {
        const locations = data.map((location: any) => LocationMapperDTO(location)) as Location[];
        quest.locations = locations;
        setLocations(locations);

        const xCoordinates = locations.map((location) => location.xCoordinate);
        const yCoordinates = locations.map((location) => location.yCoordinate);

        const maxLatitude = Math.max(...xCoordinates);
        const minLatitude = Math.min(...xCoordinates);
        const maxLongitude = Math.max(...yCoordinates);
        const minLongitude = Math.min(...yCoordinates);

        const initialRegion: Region = {
            latitude: (maxLatitude + minLatitude) / 2,
            longitude: (maxLongitude + minLongitude) / 2,
            latitudeDelta: maxLatitude - minLatitude + 0.0421,
            longitudeDelta: maxLongitude - minLongitude + 0.0421,
        };
        setInitialRegion(initialRegion);
    }

    const loadQuest = async () => {
        const user = await getItem(StorageKeys.USER);
        setUser(user);

        request(
            "get",
            `getlocations/${quest.id}`,
            {},
            user.token,
            questLocationsCallback,
            async (error: any) => {
                console.log(error);
            }
        );
    }

    const onClickScan = () => {
        props.navigation.push(Pages.Scan);
    }

    useEffect(() => {
        loadQuest();
    }, []);

    return {
        goBack,
        onClickScan,
        locations,
        initialRegion,
    }
};
