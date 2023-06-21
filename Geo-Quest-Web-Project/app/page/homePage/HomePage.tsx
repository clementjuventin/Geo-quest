import { Box, NativeBaseProvider, VStack } from "native-base";
import { HomeProps } from "./types";
import React from "react";
import { UserDetail } from "../../components/UserDetail";
import { History } from "../../components/History";
import { Footer } from "../../components/Footer";
import { PendingQuest } from "../../components/PendingQuest";
import { useHome } from "./useHomeHook";
import { useStorage } from "../../hooks/storageHook";
import { useRequest } from "../../hooks/requestHook";
import { Rank } from "../../components/Rank";

export const Home = (props: HomeProps) => {
    const {
        navigation
    } = props;

    const {
        user,
        quest,
        rank,
        score,
        ranking,
        loadingRanking,
        loadingHistory,
        history,
    } = useHome({
        useStorage,
        useRequest
    })

    return (
        <NativeBaseProvider>
            <VStack space={3}
                bg={"blueGray.50"}
                p={4}
                flex={1}
            >
                <Box mt={8}>
                    <UserDetail navigation={navigation} user={user} rank={rank} score={score} />
                </Box>
                <Rank ranking={ranking} loading={loadingRanking} />
                <History history={history} isLoading={loadingHistory} />
                {quest ? <PendingQuest quest={quest} navigation={navigation} /> : null}
            </VStack>
            <Footer tab={0} navigate={navigation.navigate}></Footer>
        </NativeBaseProvider>
    );
}