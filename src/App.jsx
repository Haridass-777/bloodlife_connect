import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import "./App.css";
import EmergencyRequestPage from "./EmergencyRequestPage";
import DonorPage from "./DonorPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/emergency-request" element={<EmergencyRequestPage />} />
        <Route path="/donor" element={<DonorPage/>}/>
      </Routes>
    </Router>
  );
}

