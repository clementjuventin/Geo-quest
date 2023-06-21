import RNDateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePickerProps } from "./type";

export const DateTimePicker = (props: DateTimePickerProps) => {
    const {
        onChange,
        value,
        minDate,
        maxDate,
    } = props;

    return (
        <RNDateTimePicker mode="datetime" value={value} onChange={onChange} minimumDate={minDate} maximumDate={maxDate} />
    )
}