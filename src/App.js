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
import MyProfile from './pages/MyProfile';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SavedProperties from "./pages/SavedProperties";
import MyListings from "./pages/MyListings";
import Settings from './pages/Settings';
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

        {/* My Profile - protected */}
        <Route path="/my-profile" element={<MyProfile />} />

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

        {/* Saved Properties - protected */}
      <Route path="/saved-properties" element={<SavedProperties />} />

        {/* My Listings - protected */}
        <Route path="/my-listings" element={<MyListings />} />

         {/* Settings page - protected */}
        <Route path="/settings" element={<Settings />} />



      </Routes>

       

    </AuthProvider>
  );
}

export default App;