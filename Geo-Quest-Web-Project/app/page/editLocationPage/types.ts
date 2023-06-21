import { LatLng } from "react-native-maps";
import { BaseProps, NavigationType } from "../../types/PageProps";
import { Location } from "../../types/Location";
import { Quest } from "../../types/Quest";

export type EditLocationProps = {

} & BaseProps;

export type useEditLocationProps = {
    navigation: NavigationType,
    quest: Quest,
    location: Location,
}

export type useEditLocationType = (props: useEditLocationProps) => {
    goBack: () => void;
    label: string;
    setLabel: (label: string) => void;
    labelError: string;
    description: string;
    setDescription: (description: string) => void;
    descriptionMessage: string;
    descriptionLength: number;
    submitLocation: () => void;
    coordinates: LatLng | undefined;
    setCoordinates: (coordinate: LatLng) => void;
    coordinatesError: string;
    error: string;
    alertVisible: boolean;
    loading: boolean;
}