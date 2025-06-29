import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Pill, 
  Leaf, 
  Apple, 
  Clock, 
  Search,
  Filter,
  Heart,
  Zap,
  Shield,
  Thermometer,
  Droplets,
  Sun,
  Activity,
  Play,
  Eye,
  CheckCircle,
  AlertCircle,
  ShoppingCart
} from 'lucide-react';
import { aiService } from '../services/aiService';
import PurchaseModal from '../components/PurchaseModal';

const TreatmentPlans: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTreatment, setSelectedTreatment] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const categories = [
    { id: 'all', name: 'All Treatments', icon: Pill },
    { id: 'natural', name: 'Natural Remedies', icon: Leaf },
    { id: 'nutrition', name: 'Nutrition Therapy', icon: Apple },
    { id: 'prevention', name: 'Prevention', icon: Shield },
  ];

  const treatments = [
    {
      id: 1,
      name: 'Common Cold Treatment',
      category: 'natural',
      condition: 'Cold & Flu',
      duration: '5-7 days',
      difficulty: 'Easy',
      severity: 'mild',
      description: 'Comprehensive natural treatment for common cold symptoms'
    },
    {
      id: 2,
      name: 'Digestive Health Plan',
      category: 'nutrition',
      condition: 'Stomach Issues',
      duration: '2-3 weeks',
      difficulty: 'Moderate',
      severity: 'moderate',
      description: 'Holistic approach to digestive health and gut healing'
    },
    {
      id: 3,
      name: 'Skin Health Regimen',
      category: 'natural',
      condition: 'Skin Problems',
      duration: '4-6 weeks',
      difficulty: 'Easy',
      severity: 'mild',
      description: 'Natural skincare and healing protocol'
    },
    {
      id: 4,
      name: 'Headache Relief Protocol',
      category: 'natural',
      condition: 'Headaches',
      duration: '1-3 days',
      difficulty: 'Easy',
      severity: 'moderate',
      description: 'Fast-acting natural headache relief methods'
    },
    {
      id: 5,
      name: 'Immune Boost Program',
      category: 'prevention',
      condition: 'General Wellness',
      duration: 'Ongoing',
      difficulty: 'Moderate',
      severity: 'mild',
      description: 'Comprehensive immune system strengthening program'
    },
    {
      id: 6,
      name: 'Anxiety Management Plan',
      category: 'natural',
      condition: 'Mental Health',
      duration: '4-8 weeks',
      difficulty: 'Moderate',
      severity: 'moderate',
      description: 'Natural approaches to anxiety and stress management'
    }
  ];

  const filteredTreatments = treatments.filter(treatment => {
    const matchesSearch = treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         treatment.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || treatment.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100 border-green-300';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'Hard': return 'text-red-600 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const handleStartTreatment = async (treatment: any) => {
    setIsGenerating(true);
    setError(null);
    setSelectedTreatment(treatment);

    try {
      if (aiService.isConfigured()) {
        const plan = await aiService.generateTreatmentPlan(treatment.condition, treatment.severity);
        setGeneratedPlan(plan);
      } else {
        // Demo content
        setTimeout(() => {
          setGeneratedPlan({
            lifecyclePhases: {
              phase1: "Immediate relief and symptom management (Days 1-3)",
              phase2: "Active treatment and healing phase (Days 4-7)",
              phase3: "Recovery and prevention phase (Week 2+)"
            },
            naturalRemedies: [
              "Rest and adequate sleep (8+ hours)",
              "Stress reduction techniques and meditation",
              "Natural anti-inflammatory foods and herbs",
              "Gentle exercise as tolerated",
              "Hydration therapy with electrolytes",
              "Herbal remedies specific to condition"
            ],
            foods: [
              "Anti-inflammatory foods (turmeric, ginger)",
              "Fresh fruits and vegetables (5+ servings daily)",
              "Lean proteins (fish, legumes, poultry)",
              "Whole grains and complex carbohydrates",
              "Healthy fats (avocado, nuts, olive oil)",
              "Adequate hydration (8-10 glasses water)"
            ],
            medications: [
              "Over-the-counter pain relief as needed",
              "Anti-inflammatory medications if required",
              "Topical treatments for localized symptoms",
              "Supplements as recommended by healthcare provider"
            ],
            exercises: [
              "Gentle stretching and flexibility exercises",
              "Light walking or low-impact cardio",
              "Breathing exercises and relaxation techniques",
              "Range of motion activities",
              "Gradual increase in activity level"
            ],
            dailySchedule: [
              { time: "08:00", activity: "Morning medication and healthy breakfast", type: "medication" },
              { time: "12:00", activity: "Nutritious lunch and light exercise", type: "nutrition" },
              { time: "18:00", activity: "Evening medication and dinner", type: "medication" },
              { time: "21:00", activity: "Relaxation routine and sleep preparation", type: "wellness" }
            ],
            preventionTips: [
              "Maintain consistent healthy lifestyle habits",
              "Regular exercise routine (150 min/week)",
              "Effective stress management techniques",
              "Adequate sleep hygiene (7-9 hours nightly)"
            ],
            possibleCauses: [
              "Lifestyle factors and dietary choices",
              "Environmental triggers and allergens",
              "Genetic predisposition and family history",
              "Previous injuries or underlying conditions"
            ]
          });
          setIsGenerating(false);
        }, 3000);
        return;
      }
    } catch (error: any) {
      console.error('Treatment plan generation failed:', error);
      setError(error.message || 'Failed to generate treatment plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewDetails = async (treatment: any) => {
    await handleStartTreatment(treatment);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Natural Treatment Plans</h1>
        <p className="text-gray-600">Comprehensive treatment plans combining natural remedies, nutrition therapy, and medications for common health conditions.</p>
        {!aiService.isConfigured() && (
          <div className="mt-2 p-3 bg-yellow-100 border-2 border-yellow-300 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Configure API keys in Settings → AI Configuration for personalized AI-generated treatment plans.
            </p>
          </div>
        )}
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search treatments or conditions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/70 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors backdrop-blur-sm text-gray-800 placeholder:text-gray-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-medical-primary/20 text-medical-primary border-2 border-medical-primary/30'
                    : 'bg-white/50 text-gray-700 border-2 border-white/30 hover:bg-white/70'
                }`}
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Generated Treatment Plan */}
      {generatedPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {aiService.isConfigured() ? 'AI-Generated' : 'Demo'} Treatment Plan: {selectedTreatment?.name}
            </h2>
            <button
              onClick={() => setGeneratedPlan(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lifecycle Phases */}
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4 border-2 border-blue-300">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Treatment Phases
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <h4 className="font-medium text-gray-800">Phase 1</h4>
                    <p className="text-sm text-gray-700">{generatedPlan.lifecyclePhases.phase1}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <h4 className="font-medium text-gray-800">Phase 2</h4>
                    <p className="text-sm text-gray-700">{generatedPlan.lifecyclePhases.phase2}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <h4 className="font-medium text-gray-800">Phase 3</h4>
                    <p className="text-sm text-gray-700">{generatedPlan.lifecyclePhases.phase3}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Schedule */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border-2 border-green-300">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-green-600" />
                Daily Schedule
              </h3>
              <div className="space-y-3">
                {generatedPlan.dailySchedule.map((item: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <span className="text-sm font-medium text-green-700 w-16">{item.time}</span>
                    <div className="flex-1 ml-3">
                      <p className="text-sm text-gray-700">{item.activity}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.type === 'medication' ? 'bg-blue-100 text-blue-700' :
                        item.type === 'nutrition' ? 'bg-orange-100 text-orange-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Natural Remedies */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border-2 border-green-300">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Leaf className="h-5 w-5 mr-2 text-green-600" />
                Natural Remedies
              </h3>
              <ul className="space-y-2">
                {generatedPlan.naturalRemedies.map((remedy: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {remedy}
                  </li>
                ))}
              </ul>
            </div>

            {/* Healing Foods */}
            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-4 border-2 border-orange-300">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Apple className="h-5 w-5 mr-2 text-orange-600" />
                Healing Foods
              </h3>
              <ul className="space-y-2">
                {generatedPlan.foods.map((food: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {food}
                  </li>
                ))}
              </ul>
            </div>

            {/* Possible Causes */}
            <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-xl p-4 border-2 border-red-300">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                Possible Causes
              </h3>
              <ul className="space-y-2">
                {generatedPlan.possibleCauses.map((cause: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {cause}
                  </li>
                ))}
              </ul>
            </div>

            {/* Prevention Tips */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border-2 border-purple-300">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-purple-600" />
                Prevention Tips
              </h3>
              <ul className="space-y-2">
                {generatedPlan.preventionTips.map((tip: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => setShowPurchaseModal(true)}
              className="w-full bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-3 px-4 rounded-xl font-medium hover:shadow-green-glow transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Buy Recommended Items
            </button>
          </div>
        </motion.div>
      )}

      {/* Treatment Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTreatments.map((treatment, index) => (
          <motion.div
            key={treatment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical hover:shadow-green-glow transition-all duration-300 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{treatment.name}</h3>
                <p className="text-sm text-gray-600">{treatment.condition}</p>
                <p className="text-xs text-gray-500 mt-1">{treatment.description}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border-2 ${getDifficultyColor(treatment.difficulty)}`}>
                  {treatment.difficulty}
                </span>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {treatment.duration}
                </div>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => handleStartTreatment(treatment)}
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-2 px-4 rounded-xl font-medium hover:shadow-green-glow transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {isGenerating && selectedTreatment?.id === treatment.id ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Treatment
                  </>
                )}
              </button>
              <button
                onClick={() => handleViewDetails(treatment)}
                disabled={isGenerating}
                className="flex-1 bg-white/70 hover:bg-white/90 border-2 border-medical-primary/30 text-gray-800 py-2 px-4 rounded-xl font-medium transition-colors flex items-center justify-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-100 border-2 border-red-300 rounded-xl">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {filteredTreatments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Pill className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500">No treatment plans found matching your criteria</p>
        </motion.div>
      )}
      
      <PurchaseModal 
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        recommendedItems={generatedPlan?.naturalRemedies || []}
      />

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Treatment Success Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start p-4 bg-white/50 rounded-xl border-2 border-white/30">
            <Heart className="h-5 w-5 text-red-500 mr-3 mt-1" />
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Consistency is Key</h3>
              <p className="text-sm text-gray-600">Follow the treatment plan daily for best results</p>
            </div>
          </div>
          <div className="flex items-start p-4 bg-white/50 rounded-xl border-2 border-white/30">
            <Droplets className="h-5 w-5 text-blue-500 mr-3 mt-1" />
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Stay Hydrated</h3>
              <p className="text-sm text-gray-600">Drink plenty of water to support healing</p>
            </div>
          </div>
          <div className="flex items-start p-4 bg-white/50 rounded-xl border-2 border-white/30">
            <Sun className="h-5 w-5 text-yellow-500 mr-3 mt-1" />
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Rest & Recovery</h3>
              <p className="text-sm text-gray-600">Get adequate sleep for optimal healing</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TreatmentPlans;