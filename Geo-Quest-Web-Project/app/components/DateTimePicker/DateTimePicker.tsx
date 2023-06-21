import { DateTimePickerProps } from "./type";
import { createElement } from "react";

export const DateTimePicker = (props: DateTimePickerProps) => {
    const {
        onChange,
        value,
    } = props;

    return createElement('input', {
        type: 'date',
        value: value,
        onInput: onChange,
      })
}