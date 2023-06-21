import { useStorageType } from "../../hooks/storageHook";
import { Location } from "../../types/Location";
import { BaseProps, NavigationType } from "../../types/PageProps";
import { Quest } from "../../types/Quest";

export type CreateQuestProps = {

} & BaseProps;

export type useCreateQuestProps = {
    useStorage: useStorageType,
    navigation: NavigationType,
    quest: Quest,
}

export type useCreateQuestType = (props: useCreateQuestProps) => {
    goBack: () => void;
    label: string;
    setLabel: (label: string) => void;
    datePickerDate: Date;
    setDatePickerDate: (date: Date) => void;
    description: string;
    setDescription: (description: string) => void;
    descriptionMessage: string;
    descriptionLength: number;
    submitQuest: () => void;
    locationClick: () => void;
    loading: boolean;
    error: string;
    alertVisible: boolean;
    locations: Location[];
    isActive: boolean;
    setIsActive: (isActive: boolean) => void;
    isCreationMode: boolean;
}