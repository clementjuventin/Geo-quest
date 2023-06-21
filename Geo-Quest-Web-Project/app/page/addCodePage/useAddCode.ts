import { useState } from "react";
import { useAddCodeProps, useAddCodeType } from "./types";
import { Pages } from "../../types/PageProps";
import { StorageKeys } from "../../hooks/storageHook";

export const useAddCode: useAddCodeType = (props: useAddCodeProps) => {
    const {
        useStorage,
        navigate
    } = props;

    const {
        getItem,
        setItem
    } = useStorage();

    const [label, setLabel] = useState<string>(''); // 12345678901234567890123456789010
    const [error, setError] = useState<string>('');
    const [showError, setShowError] = useState<boolean>(false);

    const submit = async () => {
        if (label === '') {
            setError('Please enter a label.');
            setShowError(true);
            return;
        }

        const questCodes = await getItem(StorageKeys.RUNNING_QUESTS_CODES, []);
        if (!questCodes.includes(label)) {
            questCodes.push(label);
            await setItem(StorageKeys.MY_QUESTS_CODES, questCodes);
            navigate(Pages.Navigation);
        }
        else {
            setError('Code already exists.');
            setShowError(true);
            return;
        }
    }

    return {
        label,
        setLabel,
        submit,
        error,
        showError,
    }
}

