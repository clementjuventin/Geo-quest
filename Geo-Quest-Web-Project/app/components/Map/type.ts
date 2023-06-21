import { Region } from "react-native-maps";
import { Location } from "../../types/Location";

export type MapProps = {
    goBack: () => void;
    markers: Location[],
    initialRegion?: Region,
    onClickScan: () => void;
}