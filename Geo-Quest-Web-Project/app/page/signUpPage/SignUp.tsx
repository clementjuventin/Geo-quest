import { Box, Button, Center, FormControl, Heading, Icon, Input, NativeBaseProvider, Pressable, VStack, WarningOutlineIcon } from "native-base";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { SignUpProps } from "./types";
import { useSignUpHook } from "./useSignUpHook";
import { useRequest } from "../../hooks/requestHook";
import { useStorage } from "../../hooks/storageHook";

export const SignUp = (props: SignUpProps) => {
    const [show, setShow] = React.useState(false);

    const {
        navigation,
    } = props;

    const {
        login,
        password,
        setLogin,
        setPassword,
        loginMessage,
        passwordMessage,
        validLogin,
        validPassword,
        canSignUp,
        navigateToLogin,
        signUp,
        isLoading,
    } = useSignUpHook({
        navigate: navigation.navigate,
        useRequest,
        useStorage,
    });

    const passwordViewer = <Pressable onPress={() => setShow(!show)}>
        <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
    </Pressable>

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
                        Welcome
                    </Heading>
                    <Heading mt="1" _dark={{
                        color: "warmGray.200"
                    }} color="coolGray.600" fontWeight="medium" size="xs">
                        Choose your login and password.
                    </Heading>
                    <VStack space={3} mt="5">
                        <FormControl isRequired isInvalid={!validLogin}>
                            <Input testID="login" size="2xl" variant="outline" placeholder="Login" value={login} onChangeText={(newLogin) => {
                                setLogin(newLogin);
                            }} />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {loginMessage}
                            </FormControl.ErrorMessage>
                        </FormControl>
                        <FormControl isRequired isInvalid={!validPassword}>
                            <Input testID="password" size="2xl" type={show ? "text" : "password"} variant="outline" placeholder="Password" InputRightElement={passwordViewer} value={password} onChangeText={(newPassword) => {
                                setPassword(newPassword);
                            }} />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {passwordMessage}
                            </FormControl.ErrorMessage>
                        </FormControl>
                        <Button size={"lg"} testID="submit" colorScheme={canSignUp ? "secondary" : "muted"} disabled={!canSignUp} onPress={signUp} isLoading={isLoading}>Sign Up</Button>
                        <Button size={"lg"} testID="cancel" colorScheme="secondary" variant={"outline"} onPress={navigateToLogin}>Cancel</Button>
                    </VStack>
                </Box>
            </Center>
        </NativeBaseProvider>
    );
}