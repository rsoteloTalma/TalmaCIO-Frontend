import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Dashboard from "./dashboard";
import { getUser, getToken } from "../../shared/auth-service";
import validateToken from "./validate-token";


const MainComponent: React.FC = () => {
    const navigate = useNavigate();
    const user = getUser();

    const path = window.location.pathname;
    const pathSeg = path.split("/").filter(segment => segment !== "");
    const reject = ["resetPassword","changePassword","componentTest"];

    useEffect(() => {
        const token = getToken();

        const checkToken = async () => {
            if (!token) {
                sessionStorage.clear();
                navigate("/");
                return;
            }

            const isValid = await validateToken(token);

            if (!isValid) {
                sessionStorage.clear();
                navigate("/");
                return;
            }
        };

        if(pathSeg.length > 0){
            if(reject.includes(pathSeg[0]) === false){ checkToken(); }
        } else {
            checkToken();
        }

    }, [navigate]);

    return <Dashboard user={user} />;
}

export default MainComponent;
