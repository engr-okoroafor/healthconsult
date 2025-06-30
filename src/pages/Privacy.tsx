import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Server, Globe, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      {/* Futuristic Grid Background */}
      <div className="fixed inset-0 z-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="inline-block p-3 bg-blue-500/20 backdrop-blur-sm rounded-2xl mb-4 border border-blue-500/30">
            <Shield className="h-12 w-12 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Privacy Policy</h1>
          <p className="text-blue-200 max-w-2xl mx-auto">
            Your privacy is our priority. This document outlines how we collect, use, and protect your data.
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-blue-500/20"
          >
            <div className="flex items-start mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg mr-4">
                <Eye className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-300 mb-2">Information We Collect</h2>
                <div className="space-y-3 text-gray-300">
                  <p>We collect the following types of information:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Personal information (name, email, phone number)</li>
                    <li>Health data (symptoms, medical history, diagnoses)</li>
                    <li>Usage data (app interactions, features used)</li>
                    <li>Device information (device type, operating system, browser)</li>
                  </ul>
                  <p className="text-sm text-blue-200">
                    All health data is encrypted using industry-standard AES-256 encryption and stored in secure, HIPAA-compliant databases.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20"
          >
            <div className="flex items-start mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg mr-4">
                <Server className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-purple-300 mb-2">How We Use Your Data</h2>
                <div className="space-y-3 text-gray-300">
                  <p>Your data is used for the following purposes:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Providing personalized health recommendations</li>
                    <li>Improving our AI models and diagnostic capabilities</li>
                    <li>Enhancing user experience and application features</li>
                    <li>Processing payments and delivering purchased items</li>
                    <li>Sending important notifications about your health</li>
                  </ul>
                  <p className="text-sm text-purple-200">
                    We never sell your personal data to third parties. Any data used for AI training is anonymized and stripped of personally identifiable information.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20"
          >
            <div className="flex items-start mb-4">
              <div className="p-2 bg-cyan-500/20 rounded-lg mr-4">
                <Lock className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-cyan-300 mb-2">Data Security</h2>
                <div className="space-y-3 text-gray-300">
                  <p>We implement robust security measures to protect your data:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>End-to-end encryption for all data transmission</li>
                    <li>Multi-factor authentication for account access</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Strict access controls for employee data access</li>
                    <li>Automated threat detection and prevention systems</li>
                  </ul>
                  <p className="text-sm text-cyan-200">
                    In the event of a data breach, we will notify affected users within 72 hours and take immediate steps to secure the system.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-green-500/20"
          >
            <div className="flex items-start mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg mr-4">
                <Globe className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-green-300 mb-2">International Data Transfers</h2>
                <div className="space-y-3 text-gray-300">
                  <p>Your data may be processed in countries outside your residence:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>We use servers located in the United States, European Union, and Asia</li>
                    <li>All international transfers comply with GDPR and applicable data protection laws</li>
                    <li>We implement Standard Contractual Clauses for transfers to countries without adequate protection</li>
                  </ul>
                  <p className="text-sm text-green-200">
                    You can request information about the specific locations where your data is processed by contacting our Data Protection Officer.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-red-500/20"
          >
            <div className="flex items-start mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg mr-4">
                <Clock className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-300 mb-2">Data Retention</h2>
                <div className="space-y-3 text-gray-300">
                  <p>We retain your data according to these principles:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Account information: Retained while your account is active</li>
                    <li>Health data: Stored for 7 years from last activity (legal requirement)</li>
                    <li>Payment information: Kept for 2 years for accounting purposes</li>
                    <li>Usage data: Retained for 1 year for analytics and improvements</li>
                  </ul>
                  <p className="text-sm text-red-200">
                    You can request deletion of your data at any time, subject to legal retention requirements.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-yellow-500/20"
          >
            <div className="flex items-start mb-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg mr-4">
                <AlertCircle className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-yellow-300 mb-2">Your Rights</h2>
                <div className="space-y-3 text-gray-300">
                  <p>As a user, you have the following rights regarding your data:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Right to access your personal data</li>
                    <li>Right to rectify inaccurate information</li>
                    <li>Right to erasure ("right to be forgotten")</li>
                    <li>Right to restrict processing</li>
                    <li>Right to data portability</li>
                    <li>Right to object to processing</li>
                    <li>Rights related to automated decision making and profiling</li>
                  </ul>
                  <p className="text-sm text-yellow-200">
                    To exercise these rights, please contact our Data Protection Officer at privacy@healthcareai.com
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-blue-500/20"
          >
            <div className="flex items-start mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg mr-4">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-300 mb-2">Policy Updates</h2>
                <div className="space-y-3 text-gray-300">
                  <p>This Privacy Policy was last updated on June 30, 2025.</p>
                  <p>We may update this policy periodically to reflect changes in our practices or legal requirements. We will notify you of any material changes through the app or via email.</p>
                  <p className="text-sm text-blue-200">
                    Previous versions of our Privacy Policy are available upon request.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            <a href="mailto:privacy@healthcareai.com" className="text-blue-400 hover:text-blue-300 transition-colors">
              privacy@healthcareai.com
            </a>
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
              Terms of Service
            </Link>
            <Link to="/" className="text-blue-400 hover:text-blue-300 transition-colors">
              Return to Home
            </Link>
          </div>
          
          {/* Built with Bolt Badge */}
          <div className="mt-8 flex justify-center">
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium border border-blue-700/50 shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
            >
              <div className="mr-2 bg-white rounded-full p-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;