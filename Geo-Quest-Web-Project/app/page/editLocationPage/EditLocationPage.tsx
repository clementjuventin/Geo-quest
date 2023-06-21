import { Box, Button, NativeBaseProvider, VStack, Center, Heading, FormControl, Input, TextArea, HStack, Text, Alert, IconButton, CloseIcon, Switch, Pressable, Stack, Flex, Modal, WarningOutlineIcon } from "native-base";
import React from "react";
import { BackButton } from "../../components/BackButton";
import { EditLocationProps } from "./types";
import { MaterialIcons } from "@expo/vector-icons";
import { useEditLocation } from "./useEditLocationHook";
import { CoordinatePicker } from "../../components/CoordinatePicker/CoordinatePicker";

export const EditLocation = (props: EditLocationProps) => {
    const {
        goBack,
        label,
        setLabel,
        labelError,
        description,
        setDescription,
        descriptionMessage,
        descriptionLength,
        submitLocation,
        coordinates,
        setCoordinates,
        coordinatesError,
        alertVisible,
        error,
        loading,
    } = useEditLocation({
        navigation: props.navigation,
        quest: props.route?.params?.quest,
        location: props.route?.params?.location,
    })

    const [showMap, setShowMap] = React.useState(false);

    return (
        <NativeBaseProvider>
            <Center
                _light={{ bg: "blueGray.50" }}
                px={4}
                flex={1}
            >
                {
                    alertVisible &&
                    <Alert position={"absolute"} bottom={10} width={"100%"} status="error" colorScheme="info">
                        <HStack flexShrink={1} space={2} alignItems="center">
                            <Alert.Icon />
                            <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                                {error}
                            </Text>
                        </HStack>
                    </Alert>
                }
                <BackButton goBack={goBack}></BackButton>
                <Box safeArea p="2" w="100%">
                    <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
                        color: "warmGray.50"
                    }}>
                        Location creation
                    </Heading>
                    <VStack space={3} mt="5">
                        <FormControl isRequired isInvalid={labelError !== ""}>
                            <Input testID="login" size="2xl" variant="outline" placeholder="Location label" value={label} onChangeText={(newLabel) => {
                                setLabel(newLabel);
                            }} />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {labelError}
                            </FormControl.ErrorMessage>
                        </FormControl>
                        <FormControl isRequired>
                            <TextArea value={description} autoCompleteType={"off"} placeholder={"Location description"}
                                onChangeText={newDescription => {
                                    if (newDescription.length > descriptionLength) return
                                    setDescription(newDescription)
                                }} size="2xl" />
                            <FormControl.HelperText>
                                {descriptionMessage}
                            </FormControl.HelperText>
                        </FormControl>
                        <FormControl isInvalid={coordinatesError !== ""}>
                            <Pressable width={"100%"} rounded={"lg"} overflow={"hidden"} borderColor={coordinatesError !== "" ? "error.500" : "coolGray.200"} borderWidth="1" onPress={() => {
                                setShowMap(true);
                            }}>
                                <Flex direction="row" alignItems="center" height={"100px"}>
                                    <Stack space={2} p="2" pl={4}>
                                        <HStack space={2} alignItems="center" justifyContent="space-between">
                                            <Heading size="md">
                                                Coordinates
                                            </Heading>
                                        </HStack>
                                        <Text fontWeight="400">
                                            Lat: {coordinates?.latitude}
                                        </Text>
                                        <Text fontWeight="400">
                                            Long: {coordinates?.longitude}
                                        </Text>
                                    </Stack>
                                    <Box marginLeft={"auto"} height={"100%"} width={"100px"} backgroundColor={"secondary.600"} justifyContent={"center"} alignItems={"center"}>
                                        <MaterialIcons name="add-location-alt" size={50} color={"white"} />
                                    </Box>
                                </Flex>
                            </Pressable>
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {coordinatesError}
                            </FormControl.ErrorMessage>
                        </FormControl>
                        <Modal isOpen={showMap} onClose={() => setShowMap(false)}>
                            <Modal.Content w={"90%"} height={"60%"}>
                                <Modal.CloseButton />
                                <Box height={"100%"} width={"100%"}>
                                    <CoordinatePicker coordinate={coordinates} setCoordinate={setCoordinates}></CoordinatePicker>
                                    {
                                        coordinates &&
                                        <Button width={"60%"} position={"absolute"} left={4} bottom={4} rounded={"md"} size={"lg"} testID="submit" colorScheme="secondary" onPress={() => {
                                            setShowMap(false);
                                        }}>
                                            Confirm
                                        </Button>
                                    }
                                </Box>
                            </Modal.Content>
                        </Modal>
                        <Button isLoading={loading} isLoadingText="Submitting" width={"100%"} mt="5" size={"lg"} testID="submit" colorScheme="secondary" onPress={() => { submitLocation() }}>Submit</Button>
                    </VStack>
                </Box>
            </Center>
        </NativeBaseProvider>
    );
}