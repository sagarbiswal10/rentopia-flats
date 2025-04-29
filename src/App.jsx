
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import UserDashboardPage from './pages/UserDashboardPage';
import LandlordDashboardPage from './pages/LandlordDashboardPage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import ListPropertyPage from './pages/ListPropertyPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import NotFoundPage from './pages/NotFoundPage';
import { Toaster } from './components/ui/toaster';
import './App.css';

function App() {
  return (
    <React.Fragment>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/landlord-dashboard" element={<LandlordDashboardPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/list-property" element={<ListPropertyPage />} />
            <Route path="/payment/:rentalId" element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </UserProvider>
      <Toaster />
    </React.Fragment>
  );
}

export default App;
