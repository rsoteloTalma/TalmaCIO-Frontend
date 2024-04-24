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
  return (
    <Routes>
        <Route path="/" element={!user ? <Login /> :<Home />}/>
        <Route path="/resetPassword/:key" element={<ResetPassword />}/>
        <Route path="/changePassword/:key" element={<UpdatePassword />}/>
        <Route path="/home" element={<Home />} />

        <Route path="/itinerary/addFile" element={<ItineraryAddFile />} />
        <Route path="/itinerary/list" element={<ItineraryList />} />

        <Route path="/overtime" element={<Home />} />
        <Route path="/componentTest" element={<ComponentTest />} />
    </Routes>
  );
};

export default AppRoutes;
