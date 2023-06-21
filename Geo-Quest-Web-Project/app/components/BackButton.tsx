import { MaterialIcons } from "@expo/vector-icons";
import { Icon, Pressable, Text } from "native-base";

export const BackButton = (props: BackButtonProps) => {
    const {
        goBack
    } = props;

    return (
        <Pressable style={{
            position: "absolute",
            top: 65,
            left: 15,
        }} onPress={() => {
            goBack();
        }}>
            <MaterialIcons style={{
                opacity: 0.8,
            }} name="arrow-back" size={30} />
        </Pressable>
    );
}

export type BackButtonProps = {
    goBack: () => void;
}