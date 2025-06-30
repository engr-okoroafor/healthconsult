import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, AlertTriangle, Globe, Scale, Clock, MessageSquare, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
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
          <div className="inline-block p-3 bg-purple-500/20 backdrop-blur-sm rounded-2xl mb-4 border border-purple-500/30">
            <FileText className="h-12 w-12 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Terms of Service</h1>
          <p className="text-purple-200 max-w-2xl mx-auto">
            Please read these terms carefully before using our platform. By accessing or using our service, you agree to be bound by these terms.
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20"
          >
            <div className="flex items-start mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg mr-4">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-purple-300 mb-2">1. Acceptance of Terms</h2>
                <div className="space-y-3 text-gray-300">
                  <p>By accessing or using HealthcareAI, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.</p>
                  <p>We reserve the right to modify these terms at any time. Your continued use of the platform following the posting of changes constitutes your acceptance of such changes.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-blue-500/20"
          >
            <div className="flex items-start mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg mr-4">
                <AlertTriangle className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-300 mb-2">2. Medical Disclaimer</h2>
                <div className="space-y-3 text-gray-300">
                  <p>HealthcareAI provides general health information and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
                  <p>The AI-generated content, including diagnoses, treatment plans, and recommendations, is for informational purposes only. The platform does not establish a doctor-patient relationship.</p>
                  <p className="text-sm text-blue-200 bg-blue-900/30 p-3 rounded-lg border border-blue-500/30">
                    <strong>IMPORTANT:</strong> Never disregard professional medical advice or delay seeking it because of something you have read on this platform. If you think you may have a medical emergency, call your doctor or emergency services immediately.
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
                <Globe className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-cyan-300 mb-2">3. User Accounts</h2>
                <div className="space-y-3 text-gray-300">
                  <p>When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password and for all activities that occur under your account.</p>
                  <p>You agree to notify us immediately of any unauthorized use of your account or any other breach of security. We cannot and will not be liable for any loss or damage arising from your failure to comply with this section.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>You must be at least 18 years old to use this service</li>
                    <li>You may not use the service for any illegal or unauthorized purpose</li>
                    <li>You may not impersonate another person or entity</li>
                    <li>You may not share your account credentials with others</li>
                  </ul>
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
                <Scale className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-green-300 mb-2">4. Intellectual Property</h2>
                <div className="space-y-3 text-gray-300">
                  <p>The service and its original content, features, and functionality are owned by HealthcareAI and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
                  <p>You may not modify, reproduce, distribute, create derivative works or adaptations of, publicly display or in any way exploit any of the content in whole or in part except as expressly authorized by us.</p>
                  <p>By submitting content to the platform, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate, and distribute your content in any existing or future media.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-pink-500/20"
          >
            <div className="flex items-start mb-4">
              <div className="p-2 bg-pink-500/20 rounded-lg mr-4">
                <CreditCard className="h-6 w-6 text-pink-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-pink-300 mb-2">5. Payments and Subscriptions</h2>
                <div className="space-y-3 text-gray-300">
                  <p>By subscribing to our premium services, you agree to pay all fees in accordance with the fees, charges, and billing terms in effect at the time a fee or charge is due and payable.</p>
                  <p>Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period. You can cancel your subscription through your account settings.</p>
                  <p>Refunds are provided in accordance with our Refund Policy, which is incorporated by reference into these Terms of Service.</p>
                  <p className="text-sm text-pink-200">
                    All payment processing is handled by secure third-party payment processors. We do not store your complete credit card information on our servers.
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
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-yellow-300 mb-2">6. Termination</h2>
                <div className="space-y-3 text-gray-300">
                  <p>We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach of the Terms.</p>
                  <p>If you wish to terminate your account, you may simply discontinue using the service, or notify us that you wish to delete your account.</p>
                  <p>All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-red-500/20"
          >
            <div className="flex items-start mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg mr-4">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-300 mb-2">7. Limitation of Liability</h2>
                <div className="space-y-3 text-gray-300">
                  <p>In no event shall HealthcareAI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your access to or use of or inability to access or use the service</li>
                    <li>Any conduct or content of any third party on the service</li>
                    <li>Any content obtained from the service</li>
                    <li>Unauthorized access, use or alteration of your transmissions or content</li>
                  </ul>
                  <p className="text-sm text-red-200 bg-red-900/30 p-3 rounded-lg border border-red-500/30">
                    <strong>IMPORTANT:</strong> Some jurisdictions do not allow the exclusion of certain warranties or the exclusion or limitation of liability for consequential or incidental damages, so the limitations above may not apply to you.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-blue-500/20"
          >
            <div className="flex items-start mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg mr-4">
                <MessageSquare className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-300 mb-2">8. Contact Us</h2>
                <div className="space-y-3 text-gray-300">
                  <p>If you have any questions about these Terms, please contact us at:</p>
                  <p className="text-blue-300">
                    <a href="mailto:legal@healthcareai.com" className="hover:text-blue-200 transition-colors">
                      legal@healthcareai.com
                    </a>
                  </p>
                  <p>
                    HealthcareAI, Inc.<br />
                    123 Medical Plaza<br />
                    San Francisco, CA 94103<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">
            Last updated: June 30, 2025
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
              Privacy Policy
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

export default Terms;