import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Heart, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-medical-light flex items-center justify-center">
        <div className="backdrop-blur-sm bg-glass-white rounded-2xl p-8 shadow-medical border border-white/30">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-medical-primary to-medical-secondary rounded-2xl mx-auto flex items-center justify-center">
                <Heart className="h-8 w-8 text-white animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Loader className="w-4 h-4 text-medical-primary animate-spin" />
                <span className="text-medical-primary">Loading...</span>
              </div>
              <p className="text-gray-800 font-medium">Initializing AI Health Assistant...</p>
              <p className="text-sm text-medical-primary">Preparing your personalized health experience</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Desktop Sidebar - Hidden on mobile, shown on larger screens */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 z-50"
            >
              <Sidebar onClose={closeMobileMenu} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto bg-gray-50 min-h-full">
            <Outlet />
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;