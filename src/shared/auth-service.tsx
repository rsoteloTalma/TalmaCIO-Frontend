import axios from "axios";
import { SERVICE_URLS } from "./constants";
import { processErrorMessage } from "./functions";

interface LoginResponse {
    message: string;
    token?: string;
    errorMessage?: string;
}

interface User {
    userCioId: number;
    employeeId: string;
    isActive: boolean;
    passwordChange: boolean;
	userName: string;
    name: string;
    lastName: string;
    email: string;
    employeePosition: string;
	operationAirportId: number;
    setAirports: {
        id: number;
        code: string;
    }[];
    roles: {
        id: number;
        code: string;
    }[];
    token: string;
}


export const login = async (user: string, password: string, isRecoverPassword: boolean): Promise<LoginResponse> => {
    const parameters = {
        Password: password,
        User: user,
        IsRecoverPassword: isRecoverPassword,
        AppId: 2 
    }

    try {
        const response = await axios.post(
            SERVICE_URLS.ROOT + "Authenticator/Authenticate",
            JSON.stringify(parameters), {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        console.log(response);
        const { data } = response.data;

        if(data){
                //Verificar si ya realizó cambio de clave por primera vez

                if (data.passwordChange === false) 
                {
                   const responsePasswordChange = await requestPasswordChange(data.employeeId, false); 

                   if (responsePasswordChange) {
                    if(responsePasswordChange.success) {
                      const m = "Este es su primer ingreso, por lo tanto se envió un correo con las instrucciones para activar su clave a la siguiente dirección: " + responsePasswordChange.email + ".";
                      return { message: m};
                    }
                  }
                }

                const date = new Date();
                date.setDate(date.getDate() + 1);

                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("user", JSON.stringify(data));
                sessionStorage.setItem("tokenExpiration", date.toString());

                if (data.token === null){
                    return ({
                        message: data.errorMessage,
                    });
                } else {
                    return ({
                        message: "Ok",
                    });
                }  

        }else{
            return {
                message: response.data.message
            };
        }
    } catch (error: any) {
        return ({
            message: error.toString(),
        });
    }
}


export const getToken = () => {
    return sessionStorage.getItem("token");
}


export const logout = () => {
    sessionStorage.clear();
    window.location.href = "/";
}


export const getUser = () => {
    const user = sessionStorage.getItem("user");

    if (user) { return JSON.parse(user); }
    return null;
}


export const mainMenu = async (permission: any): Promise<any> => {
    try {
        const token = getToken();
        const response = await axios.post(
            SERVICE_URLS.ROOT + "Authenticator/GetMenu",
            JSON.stringify(permission), {
            headers: {
                "Content-Type" : "application/json",
                "Accept" : "application/json",
                "Authorization":  "Bearer " + token, 
            }
        });

        const { data } = response.data;
        return data;

    } catch (error: any) {
        return ({
            message: error.toString(),
        });
    }
}

export const requestPasswordChange = async (employeeId: string, isRecoverPassword: boolean): Promise<any> => {

    const parameters = {
        employeeId: employeeId,
        isRecoveryPassword: isRecoverPassword,
        AppId: 2 
    }

    try {
        const response = await axios.post(
            SERVICE_URLS.ROOT + "Authenticator/RequestPasswordChange",
            JSON.stringify(parameters), {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        const { data } = response.data;
        return data;

    } catch (error: any) {
        return ({
            message: error.toString(),
        });
    }
}