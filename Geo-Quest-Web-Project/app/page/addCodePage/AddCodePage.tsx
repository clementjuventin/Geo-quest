import { Box, Button, NativeBaseProvider, VStack, Center, Heading, FormControl, Input } from "native-base";
import { AddCodeProps } from "./types";
import React from "react";
import { useStorage } from "../../hooks/storageHook";
import { useAddCode } from "./useAddCode";
import { Footer } from "../../components/Footer";

export const AddCode = (props: AddCodeProps) => {
    const {
        navigation
    } = props;

    const {
        label,
        setLabel,
        submit,
        error,
        showError,
    } = useAddCode({
        useStorage,
        navigate: navigation.navigate
    })

    return (
        <NativeBaseProvider>
            <Center
                _dark={{ bg: "blueGray.900" }}
                _light={{ bg: "blueGray.50" }}
                px={4}
                flex={1}
            >
                <Box safeArea p="2" py="8" w="100%">
                    <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
                        color: "warmGray.50"
                    }}>
                        Add quest by code
                    </Heading>
                    <VStack space={3} mt="5">
                        <FormControl isRequired >
                            <Input testID="login" size="2xl" variant="outline" placeholder="Code" value={label} onChangeText={(newLabel) => {
                                setLabel(newLabel);
                            }} />
                        </FormControl>
                        <Button size={"lg"} testID="submit" marginRight={"5px"} colorScheme="secondary" onPress={() => { submit() }}>Submit</Button>
                    </VStack>
                </Box>
            </Center>
            <Footer tab={2} navigate={navigation.navigate}></Footer>
        </NativeBaseProvider>
    );
}