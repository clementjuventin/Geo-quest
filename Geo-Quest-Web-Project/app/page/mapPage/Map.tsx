import { MapPageProps } from './types';
import { useMapHook } from './useMapHook';
import { NativeBaseProvider } from 'native-base';
import { Map } from '../../components/Map/Map';
import { useRequest } from '../../hooks/requestHook';
import { useStorage } from '../../hooks/storageHook';

export const MapPage = (props: MapPageProps) => {
    const {
        goBack,
        onClickScan,
        locations,
        initialRegion,
    } = useMapHook({
        navigation: props.navigation,
        useRequest,
        useStorage,
        quest: props.route?.params?.quest
    });

    return (
        <NativeBaseProvider>
            <Map goBack={goBack} markers={locations} initialRegion={initialRegion} onClickScan={onClickScan}></Map>
        </NativeBaseProvider>
    )
}
