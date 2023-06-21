import { HStack, Heading, Pressable, Stack, Text, Box, Flex, Actionsheet, useDisclose, Modal, Button, VStack } from "native-base";
import React, { useState } from "react";
import { ValidationModal } from "./ValidationModal";
import QRCode from "react-qr-code";
import { ActionLocation } from "../page/viewAllLocations/types";


export const EditLocationBox = (props: EditLocationBoxProps) => {
    const {
        location,
        showQRCode,
        setShowQRCode
    } = props;

    const {
        isOpen,
        onClose,
        onOpen,
    } = useDisclose();

    const [showModal, setShowModal] = useState(false);
    console.log(location)

    return (
        <Box key={location.xCoordinate.toString() + location.yCoordinate.toString()}>
            <Pressable rounded={"lg"} overflow={"hidden"} borderColor="coolGray.200" borderWidth="1" onPress={() => {
                onOpen()
            }}>
                <HStack py={"3"} px={"4"} space={3} alignItems={"center"} alignContent={"center"}>
                    <Stack flex={10} space={2}>
                        <Heading size="md">
                            {location.title}
                        </Heading>
                        <Text fontWeight="400" textAlign={"justify"} numberOfLines={2} >
                            {location.description}
                        </Text>
                    </Stack>
                    <Stack flex={4} space={2}>
                        <Text fontWeight="300">
                            Lat: {location.xCoordinate.toFixed(2)}°
                        </Text>
                        <Text fontWeight="300" >
                            Lon: {location.yCoordinate.toFixed(2)}°
                        </Text>
                    </Stack>
                </HStack>
            </Pressable>
            <Actionsheet isOpen={isOpen} onClose={onClose} >
                <Actionsheet.Content>
                    {
                        Object.keys(location.actions).map((key) => {
                            const action = location.actions[key];
                            return (
                                <Actionsheet.Item disabled={action.type === "disabled"} key={key} onPress={() => {
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
            <Modal isOpen={showQRCode} onClose={() => setShowQRCode(false)}>
                <Modal.Content w={"90%"}>
                    <Modal.CloseButton />
                    <Modal.Body>
                        <VStack space={4} alignContent={"center"} alignItems={"center"}>
                            <QRCode size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} value={location.code ?? ""} viewBox={`0 0 256 256`} />
                            <Button width={"100%"} rounded={"md"} size={"lg"} testID="submit" flex={1} colorScheme={"secondary"} onPress={() => { }}>
                                Save
                            </Button>
                        </VStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    )
}

export type EditLocationBoxProps = {
    location: ActionLocation,
    showQRCode: boolean;
    setShowQRCode: (showQRCode: boolean) => void;
}