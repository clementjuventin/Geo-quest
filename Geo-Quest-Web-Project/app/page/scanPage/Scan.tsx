import { ScanPageProps } from './types';
import { NativeBaseProvider } from 'native-base';
import { useScanHook } from './useScanHook';
import { BackButton } from '../../components/BackButton';
import React from 'react';
import CodeScanner from '../../components/CodeScanner/CodeScanner';
import { useRequest } from '../../hooks/requestHook';
import { useStorage } from '../../hooks/storageHook';

export const ScanPage = (props: ScanPageProps) => {
    const {
        navigation
    } = props;

    const {
        goBack,
        scanQrCode
    } = useScanHook({
        navigation,
        useRequest,
        useStorage
    });

    return (
        <NativeBaseProvider>
            <CodeScanner goBack={goBack} scanQrCode={scanQrCode} />
            <BackButton goBack={goBack} />
        </NativeBaseProvider>
    )
}
