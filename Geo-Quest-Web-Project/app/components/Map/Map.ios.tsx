import MapView, { Circle, Marker } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { BackButton } from '../../components/BackButton';
import { Box, Button, NativeBaseProvider, View } from 'native-base';
import { MapProps } from './type';
import { useEffect } from 'react';
import React from 'react';

export const Map = (props: MapProps) => {
    const mapView = React.useRef<MapView>(null);

    useEffect(() => {
        const region = props.initialRegion;
        if (region && props.markers.length > 0) {
            setTimeout(() => {
                mapView.current?.animateToRegion(region, 1500);
            }, 500);
        }

    }, [props.initialRegion])

    return (
        <NativeBaseProvider>
            <View>
                <MapView
                    ref={mapView}
                    provider={PROVIDER_GOOGLE}
                    style={{ width: '100%', height: '100%' }}
                    showsUserLocation={true}
                    loadingEnabled={true}
                >
                    {props.markers.map((marker) => (
                        <Marker
                            key={marker.key}
                            coordinate={{ latitude: marker.xCoordinate, longitude: marker.yCoordinate }}
                            title={marker.title}
                            description={marker.description}
                            isPreselected={true}
                            opacity={1}
                        />
                    ))}
                    {props.markers.map((marker) => (
                        <Circle
                            key={marker.key}
                            radius={50}
                            center={{ latitude: marker.xCoordinate, longitude: marker.yCoordinate }}
                            strokeColor="#6495ED"
                            fillColor="rgba(100,149,237,0.2)"

                        />
                    ))}
                </MapView>
                <BackButton goBack={props.goBack} />
                <Box position={"absolute"} bottom={10} width={"100%"} display={"flex"} flexDirection={"row"}>
                    <Button marginX={"8"} flex={1} size={"lg"} testID="scan" colorScheme="secondary" onPress={() => {
                        props.onClickScan();
                    }}>Scan QR code</Button>
                </Box>
            </View>
        </NativeBaseProvider>
    )
}