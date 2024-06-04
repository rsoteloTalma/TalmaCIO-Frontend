import { SERVICE_URLS } from "./constants";
import axios, { AxiosError } from "axios";
import { getToken, logout } from "./auth-service";
import moment from "moment";


const evaluateError = (error: any) => {
    throw new Error("Ocurrio un error en el servidor reintente o comunìquese con TI ", error);
}

const evaluateNotFound = (error: any) => {
    if (error instanceof AxiosError) {
        const response = error.response;
        if (response && response.status >= 400) {
            alert(`Ocurrio un error, reintente o comuníquese con TI. \n ${response.data.Message ?? ""}`);
            window.location.reload();
            return response.data.Errors[0];
        }
        // } else if (response && response.status >= 500) { evaluateError(error); }
    }
};

export async function callAPI(
    params: any,
    method: string,
    action: "get" | "post" | "put" | "delete"
    ): Promise<any> {

    const tokenExpiration = sessionStorage.getItem("tokenExpiration");
    const now = moment();
    const tokenExpirationParsed = moment(tokenExpiration);

    if (now.diff(tokenExpirationParsed, "hours") >= 0) {
        logout();
        return;
    }
    else {
        const token =  getToken();

        if (action === "get") {
            try {
                const getResponse = await axios.get(
                    SERVICE_URLS.ROOT + method, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${token}`
                    },
                    params: params
                });
                return getResponse.data;
            } catch (error) {
                evaluateNotFound(error);
            }
        }

        if (action === "post") {  
            try {
                const postResponse = await axios.post(
                    SERVICE_URLS.ROOT + method,
                    params
                        ,{
                            headers: { 
                                "Content-Type" : "application/json",
                                "Accept" : "application/json",
                                "Authorization":  "Bearer " + token, 
                            }
                        },
                    );
                return postResponse;
            } catch (error) {            
                evaluateNotFound(error);
            }
        }

        if (action === "put") {  
            try {
                const postResponse = await axios.put(
                    SERVICE_URLS.ROOT + method ,
                    params
                        ,{
                            headers: { 
                                "Content-Type" : "application/json",
                                "Accept" : "application/json",
                                "Authorization":  "Bearer " + token, 
                            }
                        },
                    );
                return postResponse;
            } catch (error) {            
                evaluateNotFound(error);
            }
        }

        if (action === "delete") {
            try {
                const deleteResponse = await axios.delete(
                    SERVICE_URLS.ROOT + method, {
                    headers: {
                        "Authorization":  "Bearer " + token, 
                        "Content-Type": "application/json",
                        "Accept" : "application/json"
                    },
                    data: params
                });
                return deleteResponse;
            } catch (error) {            
                evaluateNotFound(error);
            }
        }
    }
} 
