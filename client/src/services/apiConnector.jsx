import axios from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = async (method , url , bodyData , headers = {} , params ) => {

    const isFormData = bodyData instanceof FormData;

    // -------------- FIXED FORM-DATA + TOKEN + COOKIES ------------------
    if (isFormData) {
        const fetchHeaders = {};

        // Pass all headers (not just Authorization)
        for (const key in headers) {
            fetchHeaders[key] = headers[key];
        }

        const response = await fetch(url, {
            method,
            body: bodyData,
            headers: fetchHeaders,
            credentials: "include",   
        });

        const data = await response.json();

        return { 
            data, 
            status: response.status, 
            statusText: response.statusText 
        };
    }

    // ------------------ AXIOS FOR NORMAL REQUESTS --------------------
    return axiosInstance({
        method,
        url,
        data: bodyData ?? null,
        headers: headers ?? {},
        params: params ?? null,
        withCredentials: true,
    });
};
