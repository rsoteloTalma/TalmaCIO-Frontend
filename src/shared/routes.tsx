import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../components/login";
import Home from "../components/home";
import ComponentTest from "../components/component-test";
import ResetPassword from "../components/reset-password";
import UpdatePassword from "../components/update-password";

import ItineraryAddFile from "../components/itinerary-add-file";
import ItineraryList from "../components/itinerary-list";

interface AppRoutesProps { user: any; }

const AppRoutes: React.FC<AppRoutesProps> = ({ user }) => {

  const verifyOption = (rolId: number) => {
    if(!user) { return false; }
    return user?.roles.some((x: any) => x.id === rolId || rolId === 0);
  };

  return (
    <Routes>
        <Route path="/" element={!user ? <Login /> :<Home />}/>
        <Route path="/resetPassword/:key" element={<ResetPassword />}/>
        <Route path="/changePassword/:key" element={<UpdatePassword />}/>
        <Route path="/home" element={!user ? <Login /> : <Home /> } />

        <Route path="/itinerary/addFile" 
          element={!user ? <Login /> : verifyOption(29) && <ItineraryAddFile /> } />

        <Route path="/itinerary/list"
          element={!user ? <Login /> : verifyOption(31) && <ItineraryList /> } />

        <Route path="/componentTest" element={<ComponentTest />} />
    </Routes>
  );
};

export default AppRoutes;
