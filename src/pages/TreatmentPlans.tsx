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
              phase1: "Immediate relief and symptom management (Days 1-3): Focus on reducing acute symptoms, providing comfort measures, and stabilizing the condition. Implement emergency protocols, pain management, and basic supportive care.",
              phase2: "Active treatment and healing phase (Days 4-7): Begin targeted therapeutic interventions, monitor progress closely, and adjust treatments based on response. Introduce healing foods, specific medications, and therapeutic activities.",
              phase3: "Recovery and prevention phase (Week 2+): Transition to long-term management strategies, implement prevention protocols, and establish sustainable health maintenance routines for optimal long-term outcomes."
            },
            naturalRemedies: [
              "Complete rest and adequate sleep: 8-10 hours nightly plus 1-2 daytime naps (20-30 minutes) for first week, maintain consistent sleep schedule going to bed at same time daily, create optimal sleep environment with room temperature 65-68°F",
              "Stress reduction techniques: Daily meditation (start with 5 minutes, increase to 20 minutes), progressive muscle relaxation before bed, deep breathing exercises (4-7-8 technique) performed 3-4 times daily, and weekly stress assessment",
              "Natural anti-inflammatory protocol: Turmeric golden milk (1 tsp turmeric + 1 cup warm milk + pinch black pepper) twice daily, fresh ginger tea (1-inch piece steeped 10 minutes) 3 times daily, and omega-3 rich foods",
              "Gentle exercise progression: Week 1-2: 10-minute walks twice daily, Week 3-4: 20-minute walks plus gentle stretching, Week 5+: Add light resistance training and increase to 30-minute sessions",
              "Comprehensive hydration therapy: 8-10 glasses pure water daily, electrolyte replacement with coconut water (1-2 cups), herbal teas (chamomile, peppermint) 2-3 cups daily, avoid caffeine and alcohol",
              "Targeted herbal remedies: Echinacea tincture (1-2 ml three times daily) for immune support, elderberry syrup (1 tablespoon twice daily), and adaptogenic herbs like ashwagandha (300-600mg daily with meals)"
            ],
            foods: [
              "Anti-inflammatory powerhouse foods: Fresh turmeric root (1-inch piece daily) or turmeric powder (1 tsp with black pepper), fresh ginger (1-2 inches daily), tart cherries (1 cup or 2 oz juice), and leafy greens (2-3 cups daily)",
              "Colorful fruits and vegetables: 5-7 servings daily including berries (1 cup blueberries/strawberries), citrus fruits (2 oranges or 1 grapefruit), cruciferous vegetables (1 cup broccoli/cauliflower), and orange vegetables (1 cup carrots/sweet potato)",
              "High-quality lean proteins: Wild-caught fatty fish (salmon, sardines, mackerel) 3-4 times weekly, organic poultry (4-6 oz portions), legumes (1/2 cup cooked beans/lentils daily), and plant proteins (quinoa, hemp seeds)",
              "Nutrient-dense whole grains: Steel-cut oats (1/2 cup dry), quinoa (1/2 cup cooked), brown rice (1/3 cup cooked), and ancient grains like amaranth and millet - avoid refined grains completely",
              "Therapeutic healthy fats: Extra virgin olive oil (2-3 tablespoons daily), avocado (1/2 medium daily), raw nuts and seeds (1 oz almonds, walnuts, pumpkin seeds), and coconut oil (1-2 tablespoons for cooking)",
              "Healing beverages and hydration: 8-10 glasses filtered water, bone broth (1-2 cups daily), green tea (2-3 cups), herbal teas (chamomile, ginger, turmeric), and fresh vegetable juices (8 oz daily)"
            ],
            medications: [
              "Over-the-counter pain relief: Acetaminophen 500-1000mg every 6-8 hours (maximum 3000mg daily) for pain and fever, or Ibuprofen 200-400mg every 6-8 hours with food (maximum 1200mg daily) for inflammation",
              "Anti-inflammatory medications: Naproxen 220mg twice daily with food for longer-lasting relief, or aspirin 325mg daily for cardiovascular protection (if no bleeding risk), always take with food to prevent stomach irritation",
              "Topical treatments: Arnica gel or cream applied 3-4 times daily to affected areas, capsaicin cream (0.025-0.075%) for nerve pain, menthol-based rubs for muscle soreness, and cold/heat therapy alternating 15 minutes each",
              "Evidence-based supplements: Vitamin D3 (2000-4000 IU daily), Omega-3 fish oil (1-2g EPA/DHA daily), Magnesium glycinate (200-400mg before bed), Vitamin C (500-1000mg daily), and Zinc (15-30mg daily with food)"
            ],
            exercises: [
              "Comprehensive stretching routine: 15-20 minutes daily including neck rolls, shoulder shrugs, spinal twists, hip circles, and calf stretches - hold each stretch 30 seconds, repeat 2-3 times",
              "Progressive cardio program: Week 1-2: 10-15 minute walks, Week 3-4: 20-25 minutes, Week 5+: 30-45 minutes or swimming/cycling for 20-30 minutes, monitor heart rate staying in 50-70% max range",
              "Therapeutic breathing exercises: Diaphragmatic breathing (5 minutes 3x daily), box breathing (4-4-4-4 count), alternate nostril breathing for stress relief, and breath-holding exercises for lung capacity",
              "Range of motion therapy: Joint mobility exercises for all major joints, performed 2-3 times daily, including arm circles, leg swings, ankle rotations, and gentle spinal movements in all directions",
              "Strength building progression: Start with bodyweight exercises (wall push-ups, chair squats), progress to resistance bands, then light weights (1-5 lbs), focusing on proper form over intensity"
            ],
            dailySchedule: [
              { time: "07:00", activity: "Wake up, drink 16 oz water with lemon, take morning supplements (Vitamin D, Omega-3)", type: "medication" },
              { time: "08:00", activity: "Anti-inflammatory breakfast: oatmeal with berries, nuts, and turmeric golden milk", type: "nutrition" },
              { time: "10:00", activity: "Gentle morning walk (15-20 minutes) and breathing exercises", type: "exercise" },
              { time: "12:00", activity: "Nutrient-dense lunch: salad with salmon, avocado, and olive oil dressing", type: "nutrition" },
              { time: "15:00", activity: "Afternoon herbal tea (ginger or green tea) and meditation (10-15 minutes)", type: "wellness" },
              { time: "18:00", activity: "Evening medication if needed, healing dinner with anti-inflammatory foods", type: "medication" },
              { time: "20:00", activity: "Gentle stretching routine and relaxation exercises", type: "exercise" },
              { time: "21:00", activity: "Sleep preparation: chamomile tea, gratitude journaling, room preparation", type: "wellness" }
            ],
            preventionTips: [
              "Maintain consistent healthy lifestyle habits: Establish daily routines including same wake/sleep times, regular meal schedules, consistent exercise timing, and weekly meal prep to ensure nutritional consistency",
              "Comprehensive exercise routine: 150 minutes moderate-intensity cardio weekly (30 min x 5 days), 2-3 strength training sessions, daily flexibility work, and weekly balance/coordination activities",
              "Advanced stress management: Daily meditation practice (minimum 10 minutes), weekly stress assessment and adjustment, monthly stress management technique evaluation, and quarterly lifestyle stress audit",
              "Optimal sleep hygiene protocol: 7-9 hours nightly sleep, consistent bedtime routine starting 1 hour before sleep, bedroom environment optimization (temperature, lighting, noise), and sleep quality tracking"
            ],
            possibleCauses: [
              "Lifestyle factors and dietary choices: Poor nutrition (high processed foods, sugar, trans fats), sedentary lifestyle, irregular sleep patterns, chronic stress, excessive alcohol consumption, smoking, and inadequate hydration",
              "Environmental triggers and allergens: Air pollution exposure, household chemical irritants, seasonal allergens (pollen, mold), food sensitivities, electromagnetic field exposure, and workplace toxins",
              "Genetic predisposition and family history: Inherited inflammatory conditions, autoimmune tendencies, metabolic disorders, cardiovascular risk factors, and genetic variations affecting nutrient absorption",
              "Previous injuries or underlying conditions: Past physical trauma, chronic infections, hormonal imbalances, digestive disorders, previous medication side effects, and accumulated oxidative stress damage"
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