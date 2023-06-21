import {Flex, HStack, Heading, Pressable, Stack, Text, Box, Image } from "native-base";
import React from "react";
import { Pages, NavigationType } from "../types/PageProps";
import { Quest } from "../types/Quest";
import { MaterialIcons } from "@expo/vector-icons";

export const PendingQuest = (props: PendingProps) => {
    const {
        quest
    } = props;

    const onClick = () => {
        props.navigation.push(
            Pages.Map, {
            quest
        });
    }

    return (
        <Pressable mt="auto" rounded={"lg"} overflow={"hidden"} bg="coolGray.100" onPress={() => onClick()}>
            <Flex direction="row" alignItems="center" height={"80px"}>
                <Stack space={2} p="2" pl={4}>
                    <HStack space={2} alignItems="center" justifyContent="space-between">
                        <Heading size="md">
                            {quest?.name ?? ""}
                        </Heading>
                    </HStack>
                    <Text fontWeight="400">
                        Keep going with my last quest...
                    </Text>
                </Stack>
                <Box marginLeft={"auto"} borderLeftRadius={"full"} height={"100%"} width={"100px"} marginRight={"-50px"} backgroundColor={"secondary.500"} />
                <Box height={"100%"} width={"75px"} backgroundColor={"secondary.500"} justifyContent={"center"}>
                    <MaterialIcons name="location-on" size={50} color={"white"} />
                </Box>
            </Flex>
        </Pressable>
    );
}

export type PendingProps = {
    navigation: NavigationType,
    quest?: Quest;
}