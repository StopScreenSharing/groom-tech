import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import NavBar from "./NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// import AddOwner from "./pages/AddOwner";
// import AddDog from "./pages/AddDog";
// import AddAppointment from "./pages/AddAppointment";

function App() {
  return (
    <>
      <NavBar />
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/" element={
            <ProtectedRoute >
                <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/owners/new" element={
            <ProtectedRoute >
                <AddOwner />
            </ProtectedRoute>
          }
        />

        <Route path="/dogs/new" element={
            <ProtectedRoute >
                <AddDog />
            </ProtectedRoute>
          }
        />

        <Route path="/appointmnets/new" element={
            <ProtectedRoute >
                <AddAppointment />
            </ProtectedRoute>
          }
        />

        //catch 
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </>
  );
}

export default App;
