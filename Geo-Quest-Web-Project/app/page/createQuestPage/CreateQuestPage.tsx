import { Box, Button, NativeBaseProvider, VStack, Center, Heading, FormControl, Input, TextArea, HStack, Text, Alert, IconButton, CloseIcon, Switch, Pressable, Stack, Flex } from "native-base";
import React from "react";
import { useCreateQuest } from "./useCreateQuestHook";
import { BackButton } from "../../components/BackButton";
import { useStorage } from "../../hooks/storageHook";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { DateTimePicker } from "../../components/DateTimePicker/DateTimePicker";
import { CreateQuestProps } from "./types";
import { MaterialIcons } from "@expo/vector-icons";
import { Quest } from "../../types/Quest";

export const CreateQuest = (props: CreateQuestProps) => {
    const {
        navigation
    } = props;

    const quest = props.route?.params?.quest as Quest;

    const {
        goBack,
        label,
        setLabel,
        datePickerDate,
        setDatePickerDate,
        description,
        setDescription,
        descriptionMessage,
        descriptionLength,
        submitQuest,
        locationClick,
        loading,
        alertVisible,
        error,
        locations,
        isActive,
        setIsActive,
        isCreationMode,
    } = useCreateQuest({
        useStorage,
        navigation,
        quest
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
                <Box safeArea p="2" w="100%">
                    <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
                        color: "warmGray.50"
                    }}>
                        Quest
                        {
                            isCreationMode ? " creation" : " edition"
                        }
                    </Heading>
                    <Heading mt="1" _dark={{
                        color: "warmGray.200"
                    }} color="coolGray.600" fontWeight="medium" size="xs">
                        Let's begin a new journey!
                    </Heading>
                    <VStack space={3} mt="5">
                        <FormControl isRequired >
                            <Input testID="login" size="2xl" variant="outline" placeholder="Quest label" value={label} onChangeText={(newLabel) => {
                                setLabel(newLabel);
                            }} />
                        </FormControl>
                        <FormControl isRequired>
                            <TextArea value={description} autoCompleteType={"off"} placeholder={"Quest description"}
                                onChangeText={newDescription => {
                                    if (newDescription.length > descriptionLength) return
                                    setDescription(newDescription)
                                }} size="2xl" />
                            <FormControl.HelperText>
                                {descriptionMessage}
                            </FormControl.HelperText>
                        </FormControl>
                        <Pressable width={"100%"} rounded={"lg"} overflow={"hidden"} borderColor="coolGray.200" borderWidth="1" onPress={() => {
                            locationClick();
                        }}>
                            <Flex direction="row" alignItems="center" height={"80px"}>
                                <Stack space={2} p="2" pl={4}>
                                    <HStack space={2} alignItems="center" justifyContent="space-between">
                                        <Heading size="md">
                                            Locations
                                        </Heading>
                                    </HStack>
                                    <Text fontWeight="400">
                                        {locations.length}/15
                                    </Text>
                                </Stack>
                                <Box marginLeft={"auto"} borderLeftRadius={"full"} height={"100%"} width={"100px"} marginRight={"-50px"} backgroundColor={"secondary.600"} />
                                <Box height={"100%"} width={"75px"} backgroundColor={"secondary.600"} justifyContent={"center"}>
                                    <MaterialIcons name="location-on" size={50} color={"white"} />
                                </Box>
                            </Flex>
                        </Pressable>
                        <VStack space={4} mt="3">
                            <Heading color="coolGray.600" fontWeight="medium" size="xs">
                                Optional
                            </Heading>
                            <HStack space={3} justifyContent={"center"} alignItems={"center"}>
                                <Text marginRight={"auto"}>End date</Text>
                                <DateTimePicker
                                    value={datePickerDate}
                                    minDate={new Date(Date.now())}
                                    onChange={(event: DateTimePickerEvent, date?: Date | undefined) => {
                                        setDatePickerDate(date ?? new Date(Date.now()));
                                    }}
                                />
                            </HStack>
                            <HStack space={3} justifyContent={"center"} alignItems={"center"}>
                                <Text marginRight={"auto"}>Active</Text>
                                <Switch defaultIsChecked colorScheme="secondary" isChecked={isActive} onToggle={() => setIsActive(!isActive)} />
                            </HStack>
                        </VStack>
                        <Button width={"100%"} mt="5" disabled={loading} size={"lg"} testID="submit" colorScheme="secondary" onPress={() => { submitQuest() }}>Submit</Button>
                    </VStack>
                </Box>
            </Center>
        </NativeBaseProvider>
    );
}