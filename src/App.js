import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetails from "./pages/PropertyDetails";
import Landing from './pages/Landing';
import Intro from './pages/Intro';
import Sell from './pages/Sell';
import Mortgage from './pages/Mortgage';
import Agents from './pages/Agents';
import Help from './pages/Help';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import "./styles/App.css";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Intro animation - default entry point */}
        <Route path="/" element={<Intro />} />

        {/* Landing page - shown after intro */}
        <Route path="/landing" element={<Landing />} />

        {/* Auth pages - public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Home is now PUBLIC */}
        <Route path="/home" element={<Home />} />

        {/* Sell page - protected */}
        <Route path="/sell" element={<Sell />} />

        {/* Mortgage calculator - protected */}
        <Route path="/mortgage" element={<Mortgage />} />

        {/* Agents page - protected */}
        <Route path="/agents" element={<Agents />} />

        {/* Help page */}
        <Route path="/help" element={<Help />} />

        {/* Only PropertyDetails requires login */}
        <Route
          path="/property/:id"
          element={
            <ProtectedRoute>
              <PropertyDetails />
            </ProtectedRoute>
          }
        />

        {/* Catch all → Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

    </AuthProvider>
  );
}

export default App;