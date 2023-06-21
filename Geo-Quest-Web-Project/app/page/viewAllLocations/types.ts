import { Action } from "../../components/List";
import { BaseProps, NavigationType } from "../../types/PageProps";
import { Quest } from "../../types/Quest";
import { Location } from "../../types/Location";
import { useRequestType } from "../../hooks/requestHook";
import { useStorageType } from "../../hooks/storageHook";

export type ViewLocationsProps = {

} & BaseProps;

export type useViewLocationsProps = {
    navigation: NavigationType,
    quest: Quest;
    useRequest: useRequestType;
    useStorage: useStorageType;
}

export type ActionLocation = Location & {
    actions: {
        [label: string]: Action
    };
}

export type useViewLocationsType = (props: useViewLocationsProps) => {
    goBack: () => void;
    locations: ActionLocation[];
    error: string;
    alertVisible: boolean;
    createLocationClick: () => void;
    showQRCode: boolean;
    setShowQRCode: (showQRCode: boolean) => void;
}