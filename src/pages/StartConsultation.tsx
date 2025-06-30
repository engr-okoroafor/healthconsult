import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap,
  ShoppingCart,
  Loader,
  Crown,
  User,
  Stethoscope,
  Video,
  Clock,
  PhoneOff,
  Phone,
  Lock,
  Users,
  Brain,
  Eye,
  Ear,
  Heart,
  Activity,
  Bone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { aiService } from '../services/aiService'; 
import { tavusService } from '../services/tavusService';
import TavusAvatar from '../components/TavusAvatar';
import DoctorSelector from '../components/DoctorSelector';
import toast from 'react-hot-toast';
import PurchaseModal from '../components/PurchaseModal';

const StartConsultation: React.FC = () => {
  const { user, subscription } = useAuth();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>([]);
  const [severity, setSeverity] = useState('');
  const [duration, setDuration] = useState('');
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const bodyParts = [
    { id: 'head', name: 'Head/Brain', icon: Brain },
    { id: 'eyes', name: 'Eyes', icon: Eye },
    { id: 'nose', name: 'Nose', icon: User },
    { id: 'ears', name: 'Ears', icon: Ear },
    { id: 'chest', name: 'Chest/Lungs', icon: Activity },
    { id: 'heart', name: 'Heart', icon: Heart },
    { id: 'stomach', name: 'Stomach/Abdomen', icon: User },
    { id: 'bones', name: 'Bones/Joints', icon: Bone },
    { id: 'skin', name: 'Skin', icon: User },
  ];

  const severityLevels = [
    { id: 'mild', name: 'Mild', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-300' },
    { id: 'moderate', name: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-300' },
    { id: 'severe', name: 'Severe', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-300' },
  ];

  const durationOptions = [
    { id: 'few-hours', name: 'A few hours' },
    { id: '1-day', name: '1 day' },
    { id: '2-3-days', name: '2-3 days' },
    { id: '1-week', name: 'About a week' },
    { id: 'more-week', name: 'More than a week' },
  ];

  useEffect(() => {
    if (user?.id) {
      loadDoctors();
    }
  }, [user?.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const loadDoctors = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_available_doctors', { target_user_id: user?.id });

      if (error) throw error;
      setDoctors(data || []);
      
      // Set General Physician as default
      const defaultDoctor = (data || []).find((doc: any) => doc.specialty === 'General Physician');
      if (defaultDoctor) {
        setSelectedDoctor(defaultDoctor);
      }
    } catch (err) {
      console.error('Error loading doctors:', err);
      toast.error('Failed to load doctors');
    }
  };

  const toggleBodyPart = (partId: string) => {
    setSelectedBodyParts(prev => 
      prev.includes(partId) 
        ? prev.filter(id => id !== partId)
        : [...prev, partId]
    );
  };

  const handleAnalyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast.error('Please describe your symptoms first');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      if (aiService.isConfigured()) {
        const result = await aiService.generateSymptomDiagnosis(
          symptoms,
          selectedBodyParts,
          severity || 'moderate',
          duration || '1-3 days',
          selectedDoctor?.specialty || 'General Physician'
        );
        setDiagnosis(result);
        toast.success('Symptoms analyzed successfully!');
      } else {
        // Demo analysis
        setTimeout(() => {
          setDiagnosis({
            condition: 'Common Cold (Demo)',
            confidence: 85,
            description: 'Demo analysis - Configure OpenAI API key in environment variables for real AI analysis. Based on your symptoms, this appears to be a viral upper respiratory infection commonly known as the common cold. The condition typically affects the nose, throat, and sinuses, causing inflammation and increased mucus production.',
            naturalRemedies: [
              'Complete bed rest for 8-10 hours daily, especially during the first 3 days of illness to allow your immune system to fight the infection effectively',
              'Drink 8-10 glasses of warm fluids daily including herbal teas (chamomile, ginger, echinacea), warm water with lemon and honey, and clear broths to maintain hydration and soothe throat irritation',
              'Raw honey (1-2 tablespoons) taken directly or mixed in warm tea every 4-6 hours for its antimicrobial and throat-soothing properties - do not give to children under 1 year',
              'Apply warm compress to forehead and nose for 10-15 minutes, 3-4 times daily to relieve sinus pressure and congestion',
              'Practice deep breathing exercises and steam inhalation (10 minutes over hot water with eucalyptus oil) twice daily to clear nasal passages',
              'Gargle with warm salt water (1/2 teaspoon salt in 8 oz warm water) every 2-3 hours to reduce throat inflammation and kill bacteria'
            ],
            foods: [
              'Homemade chicken soup with carrots, celery, onions, and garlic - consume 1-2 bowls daily for hydration, electrolytes, and anti-inflammatory compounds that help reduce cold symptoms',
              'Fresh citrus fruits: 2-3 oranges, 1 grapefruit, or 1 cup fresh lemon juice daily to provide 200-500mg Vitamin C for immune system support',
              'Fresh ginger tea: steep 1-inch piece of fresh ginger in hot water for 10 minutes, add honey and lemon, drink 3-4 cups daily for anti-inflammatory and antiviral effects',
              'Raw garlic: 2-3 fresh cloves daily (crushed and mixed with honey or added to food) for allicin compound that has antimicrobial properties',
              'Dark leafy greens (spinach, kale): 2-3 servings daily for vitamins A, C, and folate to support immune function',
              'Probiotic-rich foods: 1 cup plain yogurt or kefir daily to support gut health and immune system',
              'Warm bone broth: 2-3 cups daily for minerals, collagen, and easy-to-digest nutrients'
            ],
            medications: [
              'Paracetamol (Acetaminophen): 500-1000mg every 6-8 hours (maximum 4000mg per day) for fever reduction and pain relief - take with food to prevent stomach irritation',
              'Ibuprofen: 200-400mg every 6-8 hours (maximum 1200mg per day) for inflammation and pain - take with food, avoid if you have stomach ulcers or kidney problems',
              'Throat lozenges with menthol or benzocaine: 1 lozenge every 2-3 hours as needed for throat pain relief - do not exceed 8 lozenges per day',
              'Saline nasal spray: 2-3 sprays in each nostril every 4-6 hours to moisturize nasal passages and reduce congestion',
              'Decongestant nasal spray (oxymetazoline): 2-3 sprays per nostril twice daily for maximum 3 days only to prevent rebound congestion',
              'Cough suppressant (dextromethorphan): 15-30mg every 4-6 hours for dry cough - do not exceed 120mg per day'
            ],
            administration: [
              'Take all oral medications with food or milk to prevent stomach upset and improve absorption',
              'Maintain fluid intake of at least 8-10 glasses of water daily, increasing to 12 glasses if fever is present',
              'Get 8-10 hours of sleep per night and take 2-3 short naps during the day for the first 3-5 days',
              'Monitor body temperature every 4-6 hours and record symptoms in a diary to track improvement',
              'Space medications at least 4 hours apart unless specifically directed otherwise by healthcare provider',
              'Use a humidifier in bedroom (40-50% humidity) to ease breathing and prevent nasal dryness',
              'Avoid alcohol and smoking completely during illness as they can worsen symptoms and delay recovery'
            ],
            warning: 'This is demo content. Seek immediate medical attention if you experience: fever above 103°F (39.4°C), difficulty breathing or shortness of breath, severe headache with neck stiffness, persistent vomiting, symptoms lasting more than 10 days, or if you have underlying health conditions like asthma, diabetes, or heart disease. Always consult healthcare professionals before starting any new medications.'
          });
          setIsAnalyzing(false);
        }, 4000);
        return;
      }
    } catch (error: any) {
      console.error('Symptom analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startConsultation = async (doctor: any) => {
    if (!doctor.is_available && doctor.is_premium) {
      toast.error('This specialist requires a premium subscription');
      return;
    }

    setIsLoading(true);

    try {
      const replicaData = await tavusService.getReplicaStatus(doctor.tavus_replica_id);

      if (replicaData.status !== 'completed') {
        toast.error(`Replica not ready: ${replicaData.status}`);
        return;
      }

      const conversation = await tavusService.startConsultation(
        doctor.tavus_replica_id,
        doctor.tavus_persona_id
      );

      setConversationId(conversation.conversation_id);
      setIsConnected(true);
      setSessionDuration(0);

      const { error } = await supabase
        .from('consultations')
        .insert({
          user_id: user?.id,
          doctor_id: doctor.id,
          doctor_type: doctor.specialty,
          symptoms: symptoms || 'General consultation',
          tavus_conversation_id: conversation.conversation_id,
          status: 'active',
        });

      if (error) throw error;

      toast.success(`Connected to ${doctor.name}`);
    } catch (err: any) {
      console.error('Error starting consultation:', err);
      toast.error(err.message || 'Consultation start failed');
    } finally {
      setIsLoading(false);
    }
  };

  const endConsultation = async () => {
    if (!conversationId) return;

    setIsLoading(true);
    try {
      await tavusService.endConsultation(conversationId);

      await supabase
        .from('consultations')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('tavus_conversation_id', conversationId);

      setIsConnected(false);
      setConversationId(null);
      setSessionDuration(0);

      toast.success('Consultation ended');
    } catch (err) {
      console.error('Error ending consultation:', err);
      toast.error('Failed to end consultation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationStart = async (conversationId: string) => {
    setActiveConversationId(conversationId);
    
    // Save consultation to database
    try {
      const { error } = await supabase
        .from('consultations')
        .insert([{
          user_id: user?.id,
          doctor_id: selectedDoctor?.id,
          doctor_type: selectedDoctor?.specialty || 'General Physician',
          symptoms: symptoms || 'General consultation',
          tavus_conversation_id: conversationId,
          status: 'active'
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving consultation:', error);
    }
  };

  const handleConversationEnd = async () => {
    setActiveConversationId(null);
    
    // Update consultation status in database
    if (activeConversationId) {
      try {
        const { error } = await supabase
          .from('consultations')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('tavus_conversation_id', activeConversationId);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating consultation:', error);
      }
    }
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const isPremiumUser = subscription === 'monthly' || subscription === 'yearly';

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Start Consultation</h1>
        <p className="text-gray-600">Connect with AI medical specialists for personalized health consultations and treatment recommendations.</p>
        {!aiService.isConfigured() && (
          <div className="mt-2 p-3 bg-yellow-100 border-2 border-yellow-300 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Configure OpenAI API key in environment variables for real AI analysis.
            </p>
          </div>
        )}
      </motion.div>

      {/* Premium Plan Banner */}
      {!isPremiumUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-2 border-yellow-300 shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Crown className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-800">Upgrade to Premium</h3>
                <p className="text-sm text-gray-600">Access all specialist doctors and advanced features</p>
              </div>
            </div>
            <Link
              to="/pricing"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            >
              Upgrade Now
            </Link>
          </div>
        </motion.div>
      )}

      {/* Doctor Selection Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl border-2 border-medical-primary/20 shadow-lg p-6"
      >
        <div className="flex items-center mb-4">
          <Users className="h-5 w-5 text-medical-primary mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Select a Doctor - Choose your specialist</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <DoctorSelector
              doctors={doctors}
              selectedDoctor={selectedDoctor}
              onDoctorSelect={setSelectedDoctor}
            />
          </div>
          
          <div>
            {selectedDoctor && (
              <TavusAvatar
                doctor={selectedDoctor}
                symptoms={symptoms}
                onConversationStart={handleConversationStart}
                onConversationEnd={handleConversationEnd}
                className="h-full"
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Symptoms Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-2xl border-2 border-medical-primary/20 shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Describe Your Symptoms</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What symptoms are you experiencing?
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Please describe your symptoms in detail... (e.g., I have a headache, feel tired, and have a runny nose)"
              className="w-full p-4 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors h-32 resize-none text-gray-800 placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Which body parts are affected? (Select multiple)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {bodyParts.map((part) => (
                <button
                  key={part.id}
                  onClick={() => toggleBodyPart(part.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center text-sm ${
                    selectedBodyParts.includes(part.id)
                      ? 'bg-medical-primary/20 border-medical-primary text-gray-800 shadow-lg'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-medical-primary/10 hover:border-medical-primary/50'
                  }`}
                >
                  <part.icon className="h-4 w-4 mr-2 text-medical-primary" />
                  {part.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How severe are your symptoms?
            </label>
            <div className="flex space-x-3">
              {severityLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSeverity(level.id)}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                    severity === level.id
                      ? `${level.bg} ${level.border} ${level.color} shadow-lg`
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-medical-primary/10 hover:border-medical-primary/50'
                  }`}
                >
                  {level.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How long have you had these symptoms?
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors text-gray-800"
            >
              <option value="" className="text-gray-800">Select duration</option>
              {durationOptions.map((option) => (
                <option key={option.id} value={option.id} className="text-gray-800">{option.name}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleAnalyzeSymptoms}
            disabled={!symptoms.trim() || isAnalyzing}
            className="w-full bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {isAnalyzing ? (
              <>
                <Loader className="animate-spin h-4 w-4 mr-2" />
                {aiService.isConfigured() ? 'AI Analyzing Symptoms...' : 'Generating Demo Analysis...'}
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Analyze Symptoms with AI
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Analysis Results */}
      {diagnosis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border-2 border-medical-primary/20 shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {aiService.isConfigured() ? 'AI Analysis Results' : 'Demo Analysis Results'}
          </h2>
          
          <div className="space-y-4">
            {/* Diagnosis */}
            <div className="bg-gradient-to-r from-medical-primary/20 to-medical-secondary/20 rounded-xl p-4 border-2 border-medical-primary/30">
              <h3 className="font-semibold text-gray-800 mb-2">Likely Condition</h3>
              <h4 className="text-lg font-bold text-gray-800 mb-2">{diagnosis.condition}</h4>
              <p className="text-sm text-gray-700 mb-2">{diagnosis.description}</p>
              <div className="flex items-center">
                <span className="text-sm text-gray-700">Confidence: </span>
                <span className="font-semibold text-gray-800 ml-1">{diagnosis.confidence}%</span>
              </div>
            </div>

            {/* Natural Remedies */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border-2 border-green-300">
              <h3 className="font-semibold text-gray-800 mb-3">🌿 Natural Remedies</h3>
              <ul className="space-y-2">
                {diagnosis.naturalRemedies.map((remedy: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {remedy}
                  </li>
                ))}
              </ul>
            </div>

            {/* Healing Foods */}
            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-4 border-2 border-orange-300">
              <h3 className="font-semibold text-gray-800 mb-3">🥗 Healing Foods & Diet</h3>
              <ul className="space-y-2">
                {diagnosis.foods.map((food: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {food}
                  </li>
                ))}
              </ul>
            </div>

            {/* Medications */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border-2 border-purple-300">
              <h3 className="font-semibold text-gray-800 mb-3">💊 Recommended Medications</h3>
              <ul className="space-y-2">
                {diagnosis.medications.map((med: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {med}
                  </li>
                ))}
              </ul>
            </div>

            {/* Administration */}
            {diagnosis.administration && (
              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-4 border-2 border-blue-300">
                <h3 className="font-semibold text-gray-800 mb-3">🕒 How to Take Treatment</h3>
                <ul className="space-y-2">
                  {diagnosis.administration.map((instruction: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warning */}
            <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-xl p-4 border-2 border-red-300">
              <h3 className="font-semibold text-gray-800 mb-2">⚠️ Important Warning</h3>
              <p className="text-sm text-gray-700">{diagnosis.warning}</p>
            </div>

            {/* Buy Food/Medicine Button */}
            <div className="mt-6">
              <button
                onClick={() => setShowPurchaseModal(true)}
                className="w-full bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy Recommended Food & Medicine
              </button>
            </div>
          </div>
        </motion.div>
      )}
      
      <PurchaseModal 
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        recommendedItems={diagnosis?.naturalRemedies || []}
      />
    </div>
  );
};

export default StartConsultation;