// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";

import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Prediction from "./pages/Prediction";
import Chatbot from "./pages/Chatbot";
import Login from "./pages/Login";
import EgfrCalculatorPage from "./pages/EgfrCalculatorPage";
import NephroLife from "./pages/NephroLife";
import RenalRadar from "./pages/RenalRadar";
import DiagnosisPath from "./pages/DiagnosisPath";
import Recommendations from "./pages/Recommendations";
import Register from "./pages/Register";

// 🔒 Protected Route
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Layout Wrapper */}
          <Route element={<MainLayout />}>

            {/* ✅ PUBLIC ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />

            {/* 🔒 PROTECTED ROUTES (FIXED WITH /) */}
            <Route path="/predict" element={<ProtectedRoute><Prediction /></ProtectedRoute>} />
            <Route path="/nephrolife" element={<ProtectedRoute><NephroLife /></ProtectedRoute>} />
            <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
            <Route path="/egfr-calculator" element={<ProtectedRoute><EgfrCalculatorPage /></ProtectedRoute>} />
            <Route path="/renalradar" element={<ProtectedRoute><RenalRadar /></ProtectedRoute>} />
            <Route path="/diagnosis" element={<ProtectedRoute><DiagnosisPath /></ProtectedRoute>} />
            <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />

          </Route>

          {/* ❌ 404 PAGE */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center text-white text-2xl">
                404 - Page Not Found
              </div>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;