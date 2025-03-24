import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Components
import MainLayout from './components/layout/MainLayout';
import LandingPage from './components/LandingPage';
import ResumeUploadPage from './components/ResumeUploadPage';

// Auth Context
import { AuthProvider } from './context/AuthContext';

// Authentication-related components
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserProfile from './components/UserProfile';

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
          

          <Route path="/analyze" element={
            <ProtectedRoute>
              <MainLayout>
                <ResumeUploadPage />
              </MainLayout>
            </ProtectedRoute>
          } />

<Route path="/profile" element={
            <ProtectedRoute>
              <MainLayout>
                <UserProfile />
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
