import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-t border-gray-200 py-6 mt-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Heart className="h-5 w-5 text-medical-primary mr-2" />
            <span className="text-gray-700">© 2025 HealthCare AI. All rights reserved.</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-lg font-medium text-sm flex items-center shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-400/30">
                <div className="mr-1.5 bg-white rounded-full p-0.5 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 3L4 14H13L11 21L20 10H11L13 3Z" fill="url(#bolt-gradient)" stroke="url(#bolt-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="bolt-gradient" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#3B82F6"/>
                        <stop offset="1" stopColor="#8B5CF6"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                Built with Bolt.new
              </div>
            </a>
            <a href="/privacy" className="text-gray-600 hover:text-medical-primary transition-colors">
              Privacy
            </a>
            <a href="/terms" className="text-gray-600 hover:text-medical-primary transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;