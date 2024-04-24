import React from "react";
import Dashboard from "./dashboard";
import { getUser } from "../../shared/auth-service";

const MainComponent = () => {
    const user = getUser();
    return <Dashboard user={user} />;
}

export default MainComponent;
