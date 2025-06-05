
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/CartContext';
import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
import HomePage from '@/pages/HomePage';
import AdminPage from '@/pages/AdminPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import CheckoutPage from '@/pages/CheckoutPage';
import ProtectedRoute from '@/components/ProtectedRoute';

const ThemeApplicator = ({ children }) => {
  const { settings } = useAdmin();

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme) {
      root.style.setProperty('--theme-color-primary-hex', settings.theme.primaryColorHex);
      root.style.setProperty('--theme-color-primary-text-hex', settings.theme.primaryTextColorHex);
      root.style.setProperty('--theme-color-secondary-hex', settings.theme.secondaryColorHex);
      root.style.setProperty('--theme-color-secondary-text-hex', settings.theme.secondaryTextColorHex);
      root.style.setProperty('--theme-color-accent-hex', settings.theme.accentColorHex);
      root.style.setProperty('--theme-color-accent-text-hex', settings.theme.accentTextColorHex);
      root.style.setProperty('--theme-bg-gradient-start-hex', settings.theme.bgGradientStartHex);
      root.style.setProperty('--theme-bg-gradient-end-hex', settings.theme.bgGradientEndHex);
      root.style.setProperty('--theme-text-main-hex', settings.theme.textMainHex);
      root.style.setProperty('--theme-text-muted-hex', settings.theme.textMutedHex);
      root.style.setProperty('--theme-card-bg-hex', settings.theme.cardBgHex);
      root.style.setProperty('--theme-card-foreground-hex', settings.theme.cardForegroundHex);
      root.style.setProperty('--theme-input-border-hex', settings.theme.inputBorderHex);
      root.style.setProperty('--theme-ring-hex', settings.theme.ringHex);
    }
  }, [settings.theme]);

  return <div className="min-h-screen">{children}</div>;
};

function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <Router>
          <ThemeApplicator>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
              <Route path="/admin" element={<Navigate to="/admin-login" replace />} /> 
              <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
            <Toaster />
          </ThemeApplicator>
        </Router>
      </CartProvider>
    </AdminProvider>
  );
}

export default App;
