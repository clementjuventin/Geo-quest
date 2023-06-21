import { View, Text } from 'react-native';
import { CodeScannerProps } from './type';

export default function CodeScanner(props: CodeScannerProps) {
    return (
        <View style={{
            flex: 1,
        }}>
            <Text> Scanner</Text>
        </View>
    );
}