import React from 'react';
import { motion } from 'framer-motion';

interface BoltBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const BoltBadge: React.FC<BoltBadgeProps> = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: {
      container: 'px-2 py-1 text-xs',
      icon: 'w-3 h-3',
      text: 'text-xs'
    },
    md: {
      container: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    lg: {
      container: 'px-4 py-2 text-base',
      icon: 'w-5 h-5',
      text: 'text-base'
    }
  };

  return (
    <motion.a
      href="https://bolt.new"
      target="_blank"
      rel="noopener noreferrer"
      className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white ${sizes[size].container} rounded-lg font-medium flex items-center shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-400/30 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="mr-1.5 bg-white rounded-full p-0.5 flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizes[size].icon}>
          <path d="M13 3L4 14H13L11 21L20 10H11L13 3Z" fill="url(#bolt-gradient)" stroke="url(#bolt-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="bolt-gradient" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6"/>
              <stop offset="1" stopColor="#8B5CF6"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className={sizes[size].text}>Built with Bolt.new</span>
    </motion.a>
  );
};

export default BoltBadge;