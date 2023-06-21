import { Box, HStack, Heading, Pressable, ScrollView, Skeleton, Stack, Text, VStack } from "native-base";
import React from "react";
import { Image } from 'react-native';
import { getAvatarFromUsername } from "../utils/Avatar";

export type RankProps = {
    ranking: {
        id: number,
        username: string,
        score: number,
    }[],
    loading: boolean,
}

export const Rank = (props: RankProps) => {
    const loading = props.loading ?? true;
    return (
        <Box backgroundColor="secondary.100" rounded="lg" flex={1}>
            <Text color="coolGray.800" textAlign={"center"} fontWeight="medium" fontSize="xl">
                Ranking
            </Text>
            <VStack flex={1} backgroundColor={"coolGray.100"} alignContent="center" borderBottomRadius={"lg"}>
                <ScrollView >
                    {
                        !loading &&
                        props.ranking.map((item, index) => {
                            return (
                                <Pressable key={index} width={"100%"} overflow={"hidden"} py={2}>
                                    <HStack space={4} alignItems="center" px={4}>
                                        <Box height={12} width={12}>
                                            <Image style={{
                                                width: "100%",
                                                height: "100%",
                                            }} source={getAvatarFromUsername(item.username)} alt="avatar" />
                                        </Box>
                                        <Stack space={1}>
                                            <HStack space={2} alignItems="center">
                                                <Heading size="md">
                                                    {item.username}
                                                </Heading>
                                                <Text fontSize="xs" color={"secondary.500"} fontWeight="600">
                                                    #{index + 1}
                                                </Text>
                                            </HStack>
                                            <Text fontWeight="400">
                                                Total claims : {item.score}
                                            </Text>
                                        </Stack>
                                    </HStack>
                                </Pressable>
                            )
                        })
                    }
                    {
                        loading &&
                        <>
                            <HStack w="100%" p={2} space={2} overflow={"hidden"} backgroundColor={"coolGray.100"}>
                                <Skeleton h={"70px"} w={"70px"} />
                                <VStack space="3">
                                    <Skeleton h="6" rounded="full" w={"180px"} />
                                    <Skeleton h="3" width={"250px"} rounded="full" />
                                    <Skeleton h="3" width={"250px"} rounded="full" />
                                </VStack>
                            </HStack>
                            <HStack w="100%" p={2} space={2} overflow={"hidden"} backgroundColor={"coolGray.100"}>
                                <Skeleton h={"70px"} w={"70px"} />
                                <VStack space="3">
                                    <Skeleton h="6" rounded="full" w={"180px"} />
                                    <Skeleton h="3" width={"250px"} rounded="full" />
                                    <Skeleton h="3" width={"250px"} rounded="full" />
                                </VStack>
                            </HStack>
                            <HStack w="100%" p={2} space={2} overflow={"hidden"} backgroundColor={"coolGray.100"}>
                                <Skeleton h={"70px"} w={"70px"} />
                                <VStack space="3">
                                    <Skeleton h="6" rounded="full" w={"180px"} />
                                    <Skeleton h="3" width={"250px"} rounded="full" />
                                    <Skeleton h="3" width={"250px"} rounded="full" />
                                </VStack>
                            </HStack>
                        </>
                    }
                </ScrollView>
            </VStack>
        </Box >
    )
}