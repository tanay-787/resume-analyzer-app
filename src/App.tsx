import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';

// Components
import MainLayout from './components/layout/MainLayout';
import LandingPage from './components/LandingPage';
import ResumeUploadPage from './components/ResumeUploadPage';

// Auth Context
import { AuthProvider } from './context/AuthContext';

// Authentication-related components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/analyze" element={
            <MainLayout>
              <ResumeUploadPage />
            </MainLayout>
          } />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
