import { BaseProps } from "../types/PageProps"
import { Box, HStack, ScrollView, Skeleton, Text, VStack } from "native-base";
import React from "react";
import { ListItem } from "./ListItem";

export const CustomList = (props: ListProps) => {
    const {
        items,
        label,
        loading,
    } = props;

    return (
        <Box w={"100%"} backgroundColor="secondary.100" rounded="lg" flex={1}>
            <Text color="coolGray.800" textAlign={"center"} fontWeight="medium" fontSize="xl">
                {label}
            </Text>
            {
                loading &&
                <>
                    <HStack w="100%" py={2} space={2} overflow={"hidden"} backgroundColor={"coolGray.100"}>
                        <Skeleton h={"70px"} w={"70px"} />
                        <VStack space="3">
                            <Skeleton h="6" rounded="full" w={"180px"} />
                            <Skeleton h="3" width={"250px"} rounded="full" />
                            <Skeleton h="3" width={"250px"} rounded="full" />
                        </VStack>
                    </HStack>
                    <HStack w="100%" py={2} space={2} overflow={"hidden"} backgroundColor={"coolGray.100"}>
                        <Skeleton h={"70px"} w={"70px"} />
                        <VStack space="3">
                            <Skeleton h="6" rounded="full" w={"180px"} />
                            <Skeleton h="3" width={"250px"} rounded="full" />
                            <Skeleton h="3" width={"250px"} rounded="full" />
                        </VStack>
                    </HStack>
                    <HStack w="100%" py={2} space={2} overflow={"hidden"} backgroundColor={"coolGray.100"}>
                        <Skeleton h={"70px"} w={"70px"} />
                        <VStack space="3">
                            <Skeleton h="6" rounded="full" w={"180px"} />
                            <Skeleton h="3" width={"250px"} rounded="full" />
                            <Skeleton h="3" width={"250px"} rounded="full" />
                        </VStack>
                    </HStack>
                </>
            }
            {
                !loading &&
                <ScrollView backgroundColor={"coolGray.100"} rounded={"lg"}>
                    <VStack alignContent="center">
                        {
                            items.map((item) => {
                                return (
                                    <ListItem key={`${item.id}`} item={item} />
                                )
                            })
                        }
                    </VStack>
                </ScrollView>
            }
        </Box>
    )
}

export type ListProps = {
    label: string,
    items: Item[],
    loading: boolean
} & BaseProps;

export type Item = {
    id: number;
    label: string;
    img: string;
    info: string;
    description: string;
    actions: {
        [label: string]: Action;
    }
}

export type Action = {
    onClick: () => void;
    type: "text" | "danger" | "disabled";
}