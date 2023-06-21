import { LatLng } from "react-native-maps";

export type CoordinatePickerProps = {
    coordinate: LatLng | undefined,
    setCoordinate: (coordinate: LatLng) => void,
}