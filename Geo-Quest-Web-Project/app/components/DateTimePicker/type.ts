import { DateTimePickerEvent } from "@react-native-community/datetimepicker";

export type DateTimePickerProps = {
    value: Date;
    onChange: (event: DateTimePickerEvent, date?: Date | undefined) => void;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
    format?: string;
};