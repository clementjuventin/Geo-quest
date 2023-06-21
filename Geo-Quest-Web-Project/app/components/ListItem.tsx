import { HStack, Heading, Pressable, Stack, Text, Image, useDisclose, Button, Actionsheet, Modal } from "native-base";
import { Item } from "./List";
import React, { useState } from "react";
import { ValidationModal } from "./ValidationModal";

export const ListItem = (props: ListItemProps) => {
    const {
        item,
    } = props;

    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclose();

    const [isExpanded, setIsExpanded] = React.useState(false);
    const [showModal, setShowModal] = useState(false);
    return (
        <Pressable width={"100%"} overflow={"hidden"} py={2} onPress={() => {
            setIsExpanded(!isExpanded);
        }}>
            <HStack space={4} alignItems="center" >
                <Image m={1} rounded={"full"} source={{
                    uri: item.img === "" ? "https://cdn-icons-png.flaticon.com/512/10981/10981773.png" : item.img
                }} alt={item.label} size="sm" />
                <Stack space={2}>
                    <HStack space={2} alignItems="center" justifyContent="space-between">
                        <Heading size="md">
                            {item.label}
                        </Heading>
                        <Text fontSize="xs" color={"secondary.500"} fontWeight="500">
                            {item.info}
                        </Text>
                    </HStack>
                    <Text fontWeight="400" noOfLines={2}>
                        {item.description}
                    </Text>
                </Stack>
            </HStack>
            {
                isExpanded && item.actions && (
                    <>
                        <HStack alignItems="center" space={2} backgroundColor={"coolGray.100"} width={"100%"} p="2">
                            <Button rounded={"md"} size={"lg"} testID="submit" flex={1} variant={"outline"} colorScheme="secondary" onPress={() => {
                                if (item.actions["Map"])
                                    item.actions["Map"].onClick();
                            }}>
                                Map
                            </Button>
                            {
                                Object.keys(item.actions).length > 1 && (
                                    <Button rounded={"md"} size={"lg"} testID="submit" flex={1} variant={"outline"} colorScheme="secondary" onPress={onOpen}>Actions</Button>
                                )
                            }
                        </HStack>
                        <Actionsheet isOpen={isOpen} onClose={onClose} >
                            <Actionsheet.Content>
                                {
                                    Object.keys(item.actions).map((key) => {
                                        const action = item.actions[key];
                                        return (
                                            <Actionsheet.Item key={key} onPress={() => {
                                                if (action.type === "danger") {
                                                    setShowModal(true);
                                                    return;
                                                }
                                                action.onClick();
                                                onClose();
                                            }}>
                                                <Text fontSize={16} color={action.type === "danger" ? "error.500" : "coolGray.800"}>
                                                    {key}
                                                </Text>
                                                {
                                                    action.type === "danger" && (
                                                        <ValidationModal action={action} label={key} onClose={onClose} showModal={showModal} setShowModal={setShowModal} />
                                                    )
                                                }
                                            </Actionsheet.Item>
                                        )
                                    })
                                }
                            </Actionsheet.Content>
                        </Actionsheet>
                    </>
                )
            }
        </Pressable>
    );
}

export type ListItemProps = {
    item: Item;
}