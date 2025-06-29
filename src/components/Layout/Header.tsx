import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, LogOut, MapPin, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Analysis Complete', message: 'Your chest X-ray analysis is ready', read: false },
    { id: 2, title: 'Medication Reminder', message: 'Time to take your medication', read: false },
    { id: 3, title: 'Report Updated', message: 'Your medical report has been updated', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('Searching for:', searchTerm);
      // Implement actual search functionality here
      // For now, show an alert
      alert(`Searching for: "${searchTerm}"`);
      // You can implement navigation to search results page
      // or filter current page content based on search term
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-b border-gray-200 shadow-sm relative z-40"
    >
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
        {/* Left Section with Hamburger Menu */}
        <div className="flex items-center space-x-4">
          {/* Hamburger Menu - Only visible on mobile/tablet */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-gray-800 hover:text-medical-primary transition-colors rounded-lg hover:bg-gray-50"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Search Section */}
          <form onSubmit={handleSearch} className="relative max-w-xs sm:max-w-md w-full">
            <input
              type="text"
              placeholder="Search symptoms, conditions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-12 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-all duration-300 text-sm placeholder:text-gray-500 text-gray-800 shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-medical-primary pointer-events-none" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-medical-primary hover:text-medical-secondary transition-colors rounded-lg hover:bg-gray-50"
            >
              <Settings className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Location - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2 text-xs sm:text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-medical-primary" />
            <span>Community Health Center</span>
          </div>
          
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-medical-primary hover:text-medical-secondary transition-colors rounded-lg hover:bg-gray-50"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-medical-lg border-2 border-medical-primary/20 z-[100] overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-medical-primary hover:text-medical-secondary font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50 border-l-4 border-l-medical-primary' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <h4 className="font-medium text-gray-800 text-sm">{notification.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-medical-primary rounded-full mt-2"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* User Info - Responsive */}
            <div className="hidden sm:block text-right">
              <p className="text-xs sm:text-sm font-medium text-gray-800">{user?.name || 'Community User'}</p>
              <p className="text-xs text-medical-primary">{user?.role || 'Patient'}</p>
            </div>
            
            {/* Avatar */}
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-medical-primary to-medical-secondary rounded-full flex items-center justify-center shadow-medical border-2 border-white/30">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            
            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 text-medical-primary hover:text-red-500 transition-colors rounded-lg hover:bg-gray-50"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile User Info Bar */}
      <div className="sm:hidden px-3 pb-3">
        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-medical-primary" />
            <span className="text-sm font-medium text-gray-800">{user?.name || 'Community User'}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-medical-primary">
            <MapPin className="h-3 w-3" />
            <span>Community Center</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;