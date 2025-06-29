import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Camera, 
  Pill, 
  BookOpen,
  AlertTriangle,
  Settings,
  Activity,
  Heart,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  onClose?: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Start Consultation', href: '/consultation', icon: MessageSquare },
  { name: 'Photo Diagnosis', href: '/photo-diagnosis', icon: Camera },
  { name: 'Treatment Plans', href: '/treatments', icon: Pill },
  { name: 'Health Education', href: '/education', icon: BookOpen },
  { name: 'Emergency Guide', href: '/emergency', icon: AlertTriangle },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-80 h-full bg-white border-r border-gray-200 shadow-lg flex flex-col"
    >
      {/* Mobile Close Button */}
      {onClose && (
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Logo Section */}
      <div className="flex items-center px-6 py-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-medical-primary to-medical-secondary rounded-xl shadow-medical">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">HealthCare AI</h1>
            <p className="text-sm text-medical-primary">Community Doctor</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-medical-primary to-medical-secondary text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-medical-primary border border-transparent hover:border-gray-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`mr-3 h-5 w-5 transition-colors ${
                    isActive ? 'text-white' : 'text-medical-primary group-hover:text-medical-secondary'
                  }`}
                />
                <span className="text-sm">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Status Section */}
      <div className="p-4">
        <div className="bg-medical-light rounded-xl p-4 border border-medical-primary/20 shadow-soft">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-4 w-4 text-medical-primary animate-pulse" />
            <span className="text-sm font-medium text-gray-800">AI Status</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-medical-primary">AI Doctor Ready</span>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            <span>Powered by Advanced AI</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;