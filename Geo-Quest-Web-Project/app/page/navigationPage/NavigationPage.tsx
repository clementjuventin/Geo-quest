import { Box, Button, Text, NativeBaseProvider, VStack, AddIcon, HStack } from "native-base";
import { NavigationProps } from "./types";
import React from "react";
import { UserDetail } from "../../components/UserDetail";
import { Footer } from "../../components/Footer";
import { useNavigation } from "./useNavigationHook";
import { CustomList } from "../../components/List";
import { useStorage } from "../../hooks/storageHook";
import { useRequest } from "../../hooks/requestHook";

export const NavigationPage = (props: NavigationProps) => {
    const {
        navigation,
        route,
    } = props;

    const {
        user,
        createQuestClick,
        runningQuests,
        userQuests,
        loading,
        rank,
        score,
    } = useNavigation({
        useStorage,
        useRequest,
        navigation: navigation,
        params: route?.params,
    })

    return (
        <NativeBaseProvider>
            <VStack space={3}
                pb={3}
                _light={{ bg: "blueGray.50" }}
                px={4}
                flex={1}
                display={"flex"}
                alignItems={"center"}
            >
                <Box mt={12} w={"100%"}>
                    <UserDetail navigation={navigation} user={user} rank={rank} score={score} />
                </Box>
                <CustomList loading={loading} label="Running quests" navigation={navigation} items={runningQuests} />
                <CustomList loading={loading} label="My quests" navigation={navigation} items={userQuests} />
                <Button onPress={createQuestClick} rounded={"full"} w={"50%"} size="sm" variant="outline" colorScheme="secondary" >
                    <HStack space={2} alignItems={"center"} >
                        <AddIcon color={"#EC4899"} />
                        <Text>Create a quest</Text>
                    </HStack>
                </Button>
            </VStack>
            <Footer tab={1} navigate={navigation.navigate}></Footer>
        </NativeBaseProvider>
    );
}