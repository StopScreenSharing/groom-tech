import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";


import NavBar from "./NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddOwner from "./pages/AddOwner";
import AddDog from "./pages/AddDog";
import AddAppointment from "./pages/AddAppointment";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* <Route path="/owners/new" element={<AddOwner />} />
        <Route path="/dogs/new" element={<AddDog />} />
        <Route path="/appointments/new" element={<AddAppointment />} />
        <Route path="/appointments/:id" element={<AppointmentDetail />} /> */}
      </Routes>
    </>
  );
}

export default App;
