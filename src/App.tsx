import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Components
import MainLayout from './components/layout/MainLayout';
import LandingPage from './components/LandingPage';
import ResumeUploadPage from './components/ResumeUploadPage';

// Auth Context
import { AuthProvider } from './context/AuthContext';

// Authentication-related components
import APIKeySetup from './components/ApiKeySetup';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <MainLayout>
              <LandingPage />
            </MainLayout>
          } />
          
          {/* Protected Routes */}
          <Route path="/set-api-key" element={
            <ProtectedRoute>
              <MainLayout>
                <APIKeySetup />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/analyze" element={
            <ProtectedRoute>
              <MainLayout>
                <ResumeUploadPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
