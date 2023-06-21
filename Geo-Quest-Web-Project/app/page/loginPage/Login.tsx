import { Box, Button, Center, FormControl, Heading, Icon, Input, Link, NativeBaseProvider, Pressable, VStack, WarningOutlineIcon } from "native-base";
import { LoginProps } from "./types";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useLoginHook } from "./useLoginHook";
import { useRequest } from "../../hooks/requestHook";
import { useStorage } from "../../hooks/storageHook";

export const Login = (props: LoginProps) => {
    const [show, setShow] = React.useState(false);

    const {
        navigation
    } = props;

    const {
        login,
        password,
        setLogin,
        setPassword,
        message,
        valid,
        navigateToSignUp,
        tryLogin,
    } = useLoginHook({ navigation, useRequest, useStorage });

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
                        Sign in to continue!
                    </Heading>
                    <VStack space={3} mt="5">
                        <FormControl isRequired isInvalid={!valid}>
                            <Input testID="login" size="2xl" variant="outline" placeholder="Login" value={login} onChangeText={(newLogin) => {
                                setLogin(newLogin);
                            }} />
                        </FormControl>
                        <FormControl isRequired isInvalid={!valid}>
                            <Input testID="password" size="2xl" type={show ? "text" : "password"} variant="outline" value={password} placeholder="Password" marginTop={"15px"} InputRightElement={passwordViewer}
                                onChangeText={(newPassword) => {
                                    setPassword(newPassword);
                                }} />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {message}
                            </FormControl.ErrorMessage>
                            <Link _text={{
                                fontSize: "xs",
                                fontWeight: "500",
                                color: "indigo.500"
                            }} alignSelf="flex-end" mt="1">
                                Forget Password?
                            </Link>
                            <Box marginTop={"15px"} display={"flex"} flexDirection={"row"}>
                                <Button size={"lg"} testID="submit" flex={1} marginRight={"5px"} colorScheme="secondary" onPress={tryLogin}>Sign In</Button>
                                <Button size={"lg"} testID="signup" flex={1} marginLeft={"5px"} colorScheme="secondary" variant={"outline"} onPress={navigateToSignUp}>Sign Up</Button>
                            </Box>
                        </FormControl>
                    </VStack>
                </Box>
            </Center>
        </NativeBaseProvider>
    );
}