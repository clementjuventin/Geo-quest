import { useRequestType } from "../../hooks/requestHook";
import { BaseProps, NavigationType } from "../../types/PageProps";
import { Quest } from "../../types/Quest";
import { Location } from "../../types/Location";
import { useStorageType } from "../../hooks/storageHook";
import { Region } from "react-native-maps";

export type MapPageProps = {
   
} & BaseProps;

export type useMapHookProps = {
    navigation: NavigationType;
    useRequest: useRequestType;
    useStorage: useStorageType;
    quest: Quest;
};

export type useMapHookReturn = {
    goBack: () => void;
    onClickScan: () => void;
    locations: Location[],
    initialRegion?: Region,
}