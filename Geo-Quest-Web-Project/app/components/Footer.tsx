import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Center, HStack, Icon, Pressable, Text } from "native-base";
import { Pages } from "../types/PageProps";

export const Footer = (props: FooterProps) => {
    const {
        tab
    } = props;
    const selected = tab ?? 0;

    const onClick = (tab: number) => {
        if (tab === selected) {
            return;
        }
        if (tab === 0) {
            props.navigate(Pages.Home);
        } else if (tab === 1) {
            props.navigate(Pages.Navigation);
        } else {
            props.navigate(Pages.AddCode);
        }
    }

    return (
        <HStack pt={3} maxH={100} flex={1} bg="secondary.500" alignItems="center" safeAreaBottom >
            <Pressable opacity={selected === 0 ? 1 : 0.7} flex={1} onPress={() => onClick(0)}>
                <Center>
                    <Icon as={<MaterialCommunityIcons name={selected === 0 ? 'home' : 'home-outline'} />} color="white" size="3xl" />
                    <Text bold color="white" fontSize="12">
                        Home
                    </Text>
                </Center>
            </Pressable>
            <Pressable opacity={selected === 1 ? 1 : 0.7} flex={1} onPress={() => onClick(1)}>
                <Center>
                    <Icon as={<MaterialCommunityIcons name={selected === 1 ? 'navigation-variant' : 'navigation-variant-outline'} />} color="white" size="3xl" />
                    <Text bold color="white" fontSize="12">
                        Navigation
                    </Text>
                </Center>
            </Pressable>
            <Pressable opacity={selected === 2 ? 1 : 0.7} flex={1} onPress={() => onClick(2)}>
                <Center>
                    <Icon as={<MaterialCommunityIcons name={selected === 2 ? 'qrcode-scan' : 'qrcode'} />} color="white" size="3xl" />
                    <Text bold color="white" fontSize="12">
                        Join
                    </Text>
                </Center>
            </Pressable>
        </HStack>
    );
}

export type FooterProps = {
    navigate: (screen: string) => void;
    tab?: number;
}
