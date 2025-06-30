import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, FileText } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="p-2 bg-gradient-to-br from-medical-primary to-medical-secondary rounded-lg mr-3">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-gray-800 font-semibold">HealthCare AI</span>
          </div>
          
          <div className="flex flex-wrap justify-center space-x-6">
            <Link to="/privacy" className="text-gray-600 hover:text-medical-primary transition-colors flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              <span>Privacy Policy</span>
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-medical-primary transition-colors flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              <span>Terms of Service</span>
            </Link>
            
            {/* Built with Bolt Badge */}
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium border border-blue-700/50 shadow-sm hover:shadow-blue-500/20 transition-all duration-300"
            >
              <div className="mr-1 bg-white rounded-full p-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 10V3L4 14H11V21L20 10H13Z" fill="url(#bolt-gradient)" stroke="url(#bolt-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="bolt-gradient" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3B82F6"/>
                      <stop offset="1" stopColor="#8B5CF6"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              Built with Bolt.new
            </a>
          </div>
          
          <div className="mt-4 md:mt-0 text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} HealthCare AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;