import { Button, NativeBaseProvider, VStack, Center, Heading, HStack, Text, Alert, ScrollView, Flex } from "native-base";
import React from "react";
import { useViewLocations } from "./useViewLocationsHook";
import { BackButton } from "../../components/BackButton";
import { ActionLocation, ViewLocationsProps } from "./types";
import { EditLocationBox } from "../../components/EditLocationBox";
import { useRequest } from "../../hooks/requestHook";
import { useStorage } from "../../hooks/storageHook";

export const ViewLocations = (props: ViewLocationsProps) => {

    const {
        goBack,
        createLocationClick,
        alertVisible,
        locations,
        error,
        showQRCode,
        setShowQRCode
    } = useViewLocations({
        navigation: props.navigation,
        quest: props.route?.params?.quest,
        useRequest,
        useStorage
    })

    return (
        <NativeBaseProvider>
            <Center
                _light={{ bg: "blueGray.50" }}
                px={4}
                flex={1}
            >
                {alertVisible &&
                    <Alert maxW="400" status="error" colorScheme="info">
                        <HStack flexShrink={1} space={2} alignItems="center">
                            <Alert.Icon />
                            <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                                {error}
                            </Text>
                        </HStack>
                    </Alert>
                }
                <BackButton goBack={goBack}></BackButton>
                <VStack space={3} height={"75%"} w="100%">
                    <Flex height={"100%"} p="2" w="100%">
                        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
                            color: "warmGray.50"
                        }}>
                            Locations {`(${locations.length}/15)`
                            }
                        </Heading>
                        {
                            locations.length > 0 &&
                            <ScrollView flex={1} mt="5">
                                <VStack space={3}>
                                    {locations.map((location: ActionLocation) => {
                                        return (
                                            <EditLocationBox setShowQRCode={setShowQRCode} key={location.key} location={location} showQRCode={showQRCode} />
                                        )
                                    })
                                    }
                                </VStack>
                            </ScrollView>
                        }
                    </Flex>
                    <Button width={"100%"} size={"lg"} testID="submit" colorScheme="secondary" onPress={() => { createLocationClick() }}>Add New Location</Button>
                </VStack>
            </Center>
        </NativeBaseProvider>
    );
}