
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from '@/contexts/UserContext';

import HomePage from "./pages/HomePage";
import PropertiesPage from "./pages/PropertiesPage"; 
import PropertyDetailPage from "./pages/PropertyDetailPage";
import LoginPage from "./pages/LoginPage";
import ListPropertyPage from "./pages/ListPropertyPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import NotFoundPage from "./pages/NotFoundPage";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/property/:id" element={<PropertyDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/post-property" element={<ListPropertyPage />} />
              <Route path="/dashboard" element={<UserDashboardPage />} />
              <Route path="/payment/:rentalId" element={<PaymentPage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
