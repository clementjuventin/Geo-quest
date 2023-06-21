import { useScanHookReturn, useScanHookType } from "./types";
import { StorageKeys } from "../../hooks/storageHook";

export const useScanHook = (props: useScanHookType): useScanHookReturn => {
    const {
        navigation,
        useRequest,
        useStorage
    } = props;

    const {
        request
    } = useRequest();

    const {
        getItem
    } = useStorage();

    const scanQrCode = async (data: string) => {
        const user = await getItem(StorageKeys.USER);
        console.log(user.id, data)
        let result = "Undefined error";
        if (user) {
            await request(
                "post",
                "claimlocation",
                {
                    userId: user.id,
                    code: data
                },
                user?.token,
                async () => {
                    result = "success";
                },
                async (error: any) => {
                    result = error.message;
                }
            );
        }
        return result;
    }

    const goBack = () => {
        navigation.goBack();
    }

    return {
        goBack,
        scanQrCode
    }
};
