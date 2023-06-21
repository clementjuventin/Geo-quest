import { Box, HStack, Text, VStack, Image, ScrollView, Pressable, Heading } from "native-base";
import React from "react";

export type HistoryProps = {
    history: {
        title: string;
        claimDate: string;
        img: string;
        id: number;
    }[],
    isLoading: boolean;
}

export const History = (props: HistoryProps) => {
    return (
        <Box backgroundColor="secondary.100" rounded="lg" flex={1}>
            <Text color="coolGray.800" textAlign={"center"} fontWeight="medium" fontSize="xl">
                History
            </Text>
            <VStack backgroundColor={"coolGray.100"} alignContent="center" borderBottomRadius={"lg"} flex={1}>
                <ScrollView>
                    {
                        props.history.map((item) => {
                            return (
                                <Pressable key={item.id} width={"100%"} overflow={"hidden"} py={2}>
                                    <HStack alignItems="center" px={4}>
                                        <Image m={1} rounded={"full"} source={{
                                            uri: item.img,
                                        }} alt={item.title} size="12" />
                                        <VStack alignItems="flex-start" ml="3">

                                            <Heading size="md">
                                                {item.title}
                                            </Heading>
                                            <Text fontWeight="400">
                                                {Date.parse(item.claimDate)}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Pressable>
                            )
                        })
                    }
                </ScrollView>
            </VStack>
        </Box>
    )
}