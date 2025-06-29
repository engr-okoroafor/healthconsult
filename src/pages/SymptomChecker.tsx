import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Send, Bot, User, Thermometer, Heart, Brain, Atom as Stomach, Bone, Eye, Ear, Settings as Lungs, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import { aiService } from '../services/aiService';

const SymptomChecker: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>([]);
  const [severity, setSeverity] = useState('');
  const [duration, setDuration] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const bodyParts = [
    { id: 'head', name: 'Head/Brain', icon: Brain },
    { id: 'eyes', name: 'Eyes', icon: Eye },
    { id: 'ears', name: 'Ears', icon: Ear },
    { id: 'chest', name: 'Chest/Lungs', icon: Lungs },
    { id: 'heart', name: 'Heart', icon: Heart },
    { id: 'stomach', name: 'Stomach/Abdomen', icon: Stomach },
    { id: 'bones', name: 'Bones/Joints', icon: Bone },
    { id: 'skin', name: 'Skin', icon: User },
  ];

  const severityLevels = [
    { id: 'mild', name: 'Mild', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-300' },
    { id: 'moderate', name: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-300' },
    { id: 'severe', name: 'Severe', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-300' },
  ];

  const toggleBodyPart = (partId: string) => {
    setSelectedBodyParts(prev => 
      prev.includes(partId) 
        ? prev.filter(id => id !== partId)
        : [...prev, partId]
    );
  };

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    
    try {
      if (aiService.isConfigured()) {
        // Use real AI service
        const result = await aiService.generateSymptomDiagnosis(
          symptoms,
          selectedBodyParts,
          severity,
          duration
        );
        setDiagnosis(result);
      } else {
        // Fallback to demo content
        setTimeout(() => {
          const mockDiagnosis = {
            condition: 'Common Cold (Demo Mode)',
            confidence: 85,
            description: 'Demo analysis - Configure API keys in Settings → AI Configuration to get real AI-powered diagnosis.',
            naturalRemedies: [
              'Drink warm ginger tea with honey 3 times daily',
              'Gargle with warm salt water',
              'Eat citrus fruits rich in Vitamin C (oranges, lemons)',
              'Rest and stay hydrated with plenty of fluids',
              'Use steam inhalation with eucalyptus oil'
            ],
            foods: [
              'Chicken soup with garlic and onions',
              'Fresh fruits: oranges, kiwi, berries',
              'Vegetables: spinach, broccoli, bell peppers',
              'Herbal teas: chamomile, peppermint, echinacea',
              'Avoid dairy and processed foods temporarily'
            ],
            medications: [
              'Paracetamol 500mg every 6 hours for fever (if needed)',
              'Throat lozenges for sore throat',
              'Saline nasal spray for congestion'
            ],
            administration: [
              'Take medications with food to avoid stomach upset',
              'Drink remedies warm, not hot',
              'Continue treatment for 5-7 days',
              'Rest is crucial - get 8+ hours of sleep'
            ],
            warning: 'This is demo content. Configure API keys in Settings for real AI analysis. Seek medical attention if symptoms worsen or persist beyond 10 days.'
          };
          
          setDiagnosis(mockDiagnosis);
          setIsAnalyzing(false);
        }, 3000);
        return;
      }
    } catch (error: any) {
      console.error('Symptom analysis failed:', error);
      setError(error.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Symptom Checker</h1>
        <p className="text-gray-600">Describe your symptoms and get AI-powered diagnosis with natural remedies and treatment recommendations.</p>
        {!aiService.isConfigured() && (
          <div className="mt-2 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Configure API keys in Settings → AI Configuration for real AI analysis.
            </p>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Symptom Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical hover:shadow-green-glow transition-all duration-300 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Stethoscope className="h-5 w-5 mr-2 text-medical-primary" />
            Describe Your Symptoms
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What symptoms are you experiencing?
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe your symptoms in detail... (e.g., I have a headache, runny nose, and feel tired)"
                className="w-full p-3 bg-white/70 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors backdrop-blur-sm h-32 resize-none text-gray-800 placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Which body parts are affected? (Select multiple)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {bodyParts.map((part) => (
                  <button
                    key={part.id}
                    onClick={() => toggleBodyPart(part.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center text-sm ${
                      selectedBodyParts.includes(part.id)
                        ? 'bg-medical-primary/20 border-medical-primary text-gray-800 shadow-green-glow'
                        : 'bg-white/70 border-white/30 text-gray-700 hover:bg-medical-primary/10 hover:border-medical-primary/50'
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
              <div className="flex space-x-2">
                {severityLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSeverity(level.id)}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                      severity === level.id
                        ? `${level.bg} ${level.border} ${level.color} shadow-green-glow`
                        : 'bg-white/70 border-white/30 text-gray-700 hover:bg-medical-primary/10 hover:border-medical-primary/50'
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
                className="w-full p-3 bg-white/70 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors text-gray-800"
              >
                <option value="" className="text-gray-800">Select duration</option>
                <option value="few-hours" className="text-gray-800">A few hours</option>
                <option value="1-day" className="text-gray-800">1 day</option>
                <option value="2-3-days" className="text-gray-800">2-3 days</option>
                <option value="1-week" className="text-gray-800">About a week</option>
                <option value="more-week" className="text-gray-800">More than a week</option>
              </select>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border-2 border-red-300 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!symptoms.trim() || isAnalyzing}
              className="w-full bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-3 px-4 rounded-xl font-medium hover:shadow-green-glow transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  {aiService.isConfigured() ? 'AI Analyzing Symptoms...' : 'Generating Demo Analysis...'}
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Get AI Diagnosis
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical hover:shadow-green-glow transition-all duration-300 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Bot className="h-5 w-5 mr-2 text-medical-primary" />
            AI Diagnosis & Treatment
          </h2>

          {!diagnosis && !isAnalyzing && (
            <div className="text-center py-12">
              <Stethoscope className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-600">Describe your symptoms to get an AI-powered diagnosis and treatment plan</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="text-center py-12">
              <div className="animate-spin mx-auto h-12 w-12 border-4 border-medical-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-800 font-medium">
                {aiService.isConfigured() ? 'AI is analyzing your symptoms...' : 'Generating demo analysis...'}
              </p>
              <p className="text-sm text-gray-600 mt-2">This may take a few moments</p>
            </div>
          )}

          {diagnosis && (
            <div className="space-y-6">
              {/* Diagnosis */}
              <div className="bg-gradient-to-r from-medical-primary/20 to-medical-secondary/20 rounded-xl p-4 border-2 border-medical-primary/30">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-medical-primary mr-2" />
                  <h3 className="font-semibold text-gray-800">Likely Condition</h3>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">{diagnosis.condition}</h4>
                <p className="text-sm text-gray-700 mb-2">{diagnosis.description}</p>
                <div className="flex items-center">
                  <span className="text-sm text-gray-700">Confidence: </span>
                  <span className="font-semibold text-gray-800 ml-1">{diagnosis.confidence}%</span>
                </div>
              </div>

              {/* Natural Remedies */}
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border-2 border-green-300">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Thermometer className="h-5 w-5 mr-2 text-green-600" />
                  Natural Remedies
                </h3>
                <ul className="space-y-2">
                  {diagnosis.naturalRemedies.map((remedy: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {remedy}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Foods */}
              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-4 border-2 border-orange-300">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Stomach className="h-5 w-5 mr-2 text-orange-600" />
                  Healing Foods & Diet
                </h3>
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
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-purple-600" />
                  Recommended Medications
                </h3>
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
              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-4 border-2 border-blue-300">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  How to Take Treatment
                </h3>
                <ul className="space-y-2">
                  {diagnosis.administration.map((instruction: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warning */}
              <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-xl p-4 border-2 border-red-300">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                  Important Warning
                </h3>
                <p className="text-sm text-gray-700">{diagnosis.warning}</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SymptomChecker;