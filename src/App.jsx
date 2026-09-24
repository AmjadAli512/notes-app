import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotesPage from './pages/NotesPage';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <div className="app">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="*"
          element={
            <div className="empty-state" style={{ padding: '60px 20px' }}>
              <h2>404 – Page Not Found</h2>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;