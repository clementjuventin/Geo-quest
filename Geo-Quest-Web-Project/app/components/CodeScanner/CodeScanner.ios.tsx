import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { CodeScannerProps } from './type';
import { Spinner, Alert, HStack, Text } from 'native-base';

export default function CodeScanner(props: CodeScannerProps) {
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [scanned, setScanned] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = async ({ type, data }: any) => {
        setScanned(true);
        setLoading(true);
        // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        console.log("data", data)
        const result = await props.scanQrCode(data);

        if (result === "success") {
            props.goBack();
        }
        else {
            setErrorMessage(result);
            setTimeout(() => {
                setLoading(false);
                setScanned(false);
                setErrorMessage("");
            }, 2000);
        }
    };

    // if (hasPermission === null) {
    //     return <Text>Requesting for camera permission</Text>;
    // }
    // if (hasPermission === false) {
    //     return <Text>No access to camera</Text>;
    // }

    return (
        <View style={{
            flex: 1,
        }}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {
                loading && <Spinner position={"absolute"}
                    bottom={0}
                    left={0}
                    right={0}
                    top={0}
                    m={"auto"}
                    color={"secondary.500"} size="lg" />
            }
            {errorMessage !== "" &&
                <Alert maxW="400" status="error" colorScheme="info"
                    bottom={0}
                    left={0}
                    right={0}
                    top={0}
                    m={"auto"}>
                    <HStack flexShrink={1} space={2} alignItems="center">
                        <Alert.Icon />
                        <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                            {errorMessage}
                        </Text>
                    </HStack>
                </Alert>
            }
        </View>
    );
}