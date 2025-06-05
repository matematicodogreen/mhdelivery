
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Settings, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/components/ui/use-toast';

const Header = ({ onCartClick }) => {
  const { getTotalItems } = useCart();
  const { settings } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = getTotalItems();

  const isAdminDashboard = location.pathname === '/admin/dashboard';
  const isLoginPage = location.pathname === '/admin-login';
  const isHome = location.pathname === '/';
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

  const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/e7698b0a-57cc-48b5-9074-5853220a1132/a2da475007f7bf9dc1b95cb698852758.png";

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    toast({ title: "Logout realizado", description: "Você foi desconectado." });
    navigate('/admin-login');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md"
      style={{ borderColor: 'var(--theme-input-border-hex)' }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-auto h-12 md:h-14 flex items-center justify-center">
              <img alt="Logo MH Delivery" className="h-full w-auto object-contain" src={logoUrl} />
            </div>
          </motion.div>

          {!isLoginPage && (
            <div className="flex items-center space-x-2 sm:space-x-3">
              {!isAdminDashboard && !isAuthenticated && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate('/admin-login')}
                  className="relative"
                  style={{ borderColor: 'var(--theme-color-primary-hex)', color: 'var(--theme-color-primary-hex)'}}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              )}

              {isAdminDashboard && isAuthenticated && (
                 <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLogout}
                  className="relative"
                  style={{ borderColor: 'var(--theme-color-primary-hex)', color: 'var(--theme-color-primary-hex)'}}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              )}

              {(!isHome || isAdminDashboard) && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate('/')}
                  className="relative"
                  style={{ borderColor: 'var(--theme-color-primary-hex)', color: 'var(--theme-color-primary-hex)'}}
                >
                  <Home className="h-5 w-5" />
                </Button>
              )}

              {!isAdminDashboard && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onCartClick}
                    className="relative"
                    style={{ borderColor: 'var(--theme-color-primary-hex)', color: 'var(--theme-color-primary-hex)'}}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 text-xs rounded-full h-6 w-6 flex items-center justify-center cart-badge"
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </Button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;