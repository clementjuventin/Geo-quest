export const useRequest: useRequestType = () => {

    const request = async (
        method: "get" | "post" | "put" | "delete",
        endpoint: string,
        data: any,
        token?: string,
        callBack?: (data: any) => Promise<void>,
        errorCallBack?: (error: any) => Promise<void>,
    ) => {
        const headers: any = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const url = `https://geoquest.osc-fr1.scalingo.io/api/${endpoint}`;

        const response = await fetch(url, {
            method: method.toUpperCase(),
            headers,
            body: method !== "get" ? JSON.stringify(data) : undefined,
        });
        const json = await response.json();
        if (response.status === 200) {
            if (callBack) {
                await callBack(json.data);
            }
        } else {
            if (errorCallBack) {
                await errorCallBack(json);
            }
        }
    }

    return {
        request,
    }
}

export type useRequestType = () => {
    request: (
        method: "get" | "post" | "put" | "delete",
        endpoint: string,
        data: any,
        token?: string,
        callBack?: (data: any) => Promise<void>,
        errorCallBack?: (error: any) => Promise<void>,
    ) => Promise<void>;
};