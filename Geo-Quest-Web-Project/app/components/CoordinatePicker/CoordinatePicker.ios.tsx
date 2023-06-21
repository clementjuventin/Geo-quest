import MapView, { Marker, Circle } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { NativeBaseProvider, View } from 'native-base';
import { CoordinatePickerProps } from './type';
import React from 'react';

export const CoordinatePicker = (props: CoordinatePickerProps) => {
    const mapView = React.useRef<MapView>(null);

    return (
        <NativeBaseProvider>
            <View>
                <MapView
                    onPress={(e) => {
                        props.setCoordinate(e.nativeEvent.coordinate);
                    }}
                    ref={mapView}
                    provider={PROVIDER_GOOGLE}
                    style={{ width: '100%', height: '100%' }}
                    showsUserLocation={true}
                    loadingEnabled={true}
                    showsCompass={true}
                    showsScale={true}
                    showsMyLocationButton={true}
                    showsPointsOfInterest={false}
                >
                    {
                        props.coordinate && (
                            <>
                                <Marker
                                    coordinate={props.coordinate}
                                    opacity={1}
                                />
                                <Circle
                                    radius={50}
                                    center={props.coordinate}
                                    strokeColor="#6495ED"
                                    fillColor="rgba(100,149,237,0.2)"
                                />
                            </>
                        )
                    }
                </MapView>
            </View>
        </NativeBaseProvider>
    )
}