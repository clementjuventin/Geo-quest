import { NativeBaseProvider, Text } from 'native-base';
import { MapProps } from './type';

// We have to create a different component for web application because it break the build if we use MapView from react-native-maps
export const Map = (props: MapProps) => {
    return (
        <NativeBaseProvider>
            <Text> MAP </Text>
        </NativeBaseProvider>
    )
}

