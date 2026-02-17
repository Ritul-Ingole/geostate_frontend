import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetails from "./pages/PropertyDetails";
import Landing from './pages/Landing';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import "./styles/App.css";

function App() {
  return (
    <AuthProvider>
        <Routes>
          {/* Landing - default public page */}
          <Route path="/" element={<Landing />} />

          {/* Auth pages - public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Home - protected */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Property details - protected */}
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