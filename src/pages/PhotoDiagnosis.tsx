import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Camera, 
  Upload, 
  X, 
  Eye,
  AlertCircle,
  CheckCircle,
  Loader,
  Zap,
  Leaf,
  Pill,
  Clock,
  Activity,
  ShoppingCart,
  Users
} from 'lucide-react';
import TavusAvatar from '../components/TavusAvatar';
import DoctorSelector from '../components/DoctorSelector';
import PurchaseModal from '../components/PurchaseModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { tavusService } from '../services/tavusService';
import { aiService } from '../services/aiService';
import toast from 'react-hot-toast';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  description: string;
  icon: string;
  tavus_replica_id: string;
  tavus_persona_id: string;
  is_premium: boolean;
  is_available: boolean;
}

const PhotoDiagnosis: React.FC = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [imageType, setImageType] = useState('');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadDoctors();
    }
  }, [user?.id]);

  const loadDoctors = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_available_doctors', { target_user_id: user?.id });

      if (error) throw error;
      
      // Filter for Radiologist and General Physician
      const filteredDoctors = (data || []).filter((doc: any) => 
        doc.specialty === 'General Physician' || doc.specialty === 'Radiologist'
      );
      
      setDoctors(filteredDoctors);
      
      // Set Radiologist as default for photo diagnosis
      const defaultDoctor = filteredDoctors.find((doc: any) => doc.specialty === 'Radiologist') ||
                           filteredDoctors.find((doc: any) => doc.specialty === 'General Physician');
      if (defaultDoctor) {
        setSelectedDoctor(defaultDoctor);
      }
    } catch (err) {
      console.error('Error loading doctors:', err);
      toast.error('Failed to load doctors');
    }
  };

  const bodyParts = [
    'Skin/Rash', 'Eyes', 'Mouth/Throat', 'Hands/Feet', 'Arms/Legs', 'Face', 'Back', 'Chest', 'Abdomen', 'Other'
  ];

  const imageTypes = [
    'Photo (Wound/Rash)', 'X-Ray', 'MRI', 'CT Scan', 'DICOM', 'Ultrasound', 'Mammography', 'Other Medical Image'
  ];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.bmp', '.webp'],
      'application/dicom': ['.dcm'],
      'application/octet-stream': ['.dcm']
    },
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      setUploadedImages(prev => [...prev, ...acceptedFiles]);
    }
  });

  const removeImage = (indexToRemove: number) => {
    setUploadedImages(images => images.filter((_, index) => index !== indexToRemove));
  };

  const handleConversationStart = async (conversationId: string) => {
    setActiveConversationId(conversationId);
    
    // Save consultation to database
    try {
      const { error } = await supabase
        .from('consultations')
        .insert({
          user_id: user?.id,
          doctor_id: selectedDoctor?.id,
          doctor_type: selectedDoctor?.specialty || 'Radiologist',
          symptoms: `Image analysis consultation for ${selectedBodyPart || 'unknown body part'}`,
          tavus_conversation_id: conversationId,
          status: 'active'
        });

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

  const handleAnalyze = async () => {
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    if (!selectedBodyPart || !imageType) {
      toast.error('Please select body part and image type');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      if (aiService.isConfigured()) {
        // Convert image to base64
        const file = uploadedImages[0];
        const reader = new FileReader();
        
        reader.onload = async (e) => {
          try {
            const base64 = e.target?.result as string;
            const base64Data = base64.split(',')[1]; // Remove data:image/jpeg;base64, prefix
            
            const result = await aiService.analyzeImage(
              base64Data,
              selectedDoctor?.specialty || 'Radiologist',
              [selectedBodyPart],
              imageType
            );
            
            setDiagnosis(result);
            toast.success('Image analysis completed!');
          } catch (error: any) {
            console.error('Image analysis failed:', error);
            toast.error('Analysis failed: ' + error.message);
          } finally {
            setIsAnalyzing(false);
          }
        };
        
        reader.readAsDataURL(file);
      } else {
        // Demo analysis
        setTimeout(() => {
          const mockDiagnosis = {
            findings: [
              {
                type: 'Visual Analysis (Demo)',
                description: 'Demo analysis - Configure OpenAI API key in environment variables for real AI-powered image analysis. Visual examination reveals characteristic inflammatory changes consistent with contact dermatitis, including erythema (redness), mild edema (swelling), and possible vesicle formation in the affected area.',
                severity: 'mild',
                confidence: 0.78
              }
            ],
            diagnosis: {
              condition: 'Contact Dermatitis (Demo)',
              confidence: 0.78,
              description: 'Demo analysis - Configure OpenAI API key for real AI analysis. Contact dermatitis is an inflammatory skin condition caused by direct contact with irritants or allergens. The condition typically presents with localized redness, swelling, and possible blistering in the area of contact. This appears to be acute contact dermatitis based on the visual presentation and symptom pattern.'
            },
            naturalRemedies: [
              'Apply cool, wet compresses using clean cloth soaked in cold water for 15-20 minutes, 4-6 times daily to reduce inflammation and provide immediate relief from itching and burning',
              'Use 100% pure aloe vera gel (refrigerated for extra cooling effect) applied in thin layer 4-5 times daily - ensure no added fragrances or alcohol which can worsen irritation',
              'Take colloidal oatmeal baths: blend 1 cup plain oats into fine powder, add to lukewarm bath water, soak for 15-20 minutes twice daily for anti-inflammatory and moisturizing effects',
              'Apply cold milk compresses: soak clean cloth in cold whole milk for 10-15 minutes, 3 times daily - the proteins and fats help soothe and heal irritated skin',
              'Use calendula cream or ointment (2-3% concentration) applied 3-4 times daily for its anti-inflammatory and wound-healing properties',
              'Apply witch hazel extract with cotton pad 2-3 times daily for its astringent and anti-inflammatory effects'
            ],
            foods: [
              'Anti-inflammatory foods: 1 teaspoon turmeric powder daily (mixed in warm milk or food), fresh ginger (1-inch piece daily in tea or food), 2-3 servings of dark leafy greens (spinach, kale) for antioxidants and vitamins',
              'Omega-3 rich foods: 1 handful of walnuts daily, 2 tablespoons ground flaxseeds in smoothies or yogurt, 1 tablespoon chia seeds soaked in water for 15 minutes before consuming',
              'Vitamin C rich foods: 2-3 citrus fruits daily, 1 cup fresh berries, 1 bell pepper for collagen synthesis and skin healing',
              'Zinc-rich foods: 1 oz pumpkin seeds, 3 oz lean meat or fish, 1/2 cup legumes daily for wound healing and immune support',
              'Quercetin-rich foods: 1 medium apple with skin, 1/2 cup red onions, 1 cup green tea daily for natural antihistamine effects',
              'Probiotic foods: 1 cup plain yogurt or kefir daily to support immune system and reduce inflammatory response'
            ],
            medications: [
              'Oral antihistamine (Benadryl/Diphenhydramine): 25-50mg every 6-8 hours for adults (maximum 300mg per day) to reduce itching and allergic response - may cause drowsiness, avoid driving',
              'Loratadine (Claritin): 10mg once daily for non-drowsy antihistamine effect - preferred for daytime use',
              'Hydrocortisone cream 1%: Apply thin layer to affected area twice daily for maximum 7 days - do not use on broken skin or face without medical supervision',
              'Calamine lotion: Apply 3-4 times daily for drying effect and itch relief - shake well before use, allow to dry completely',
              'Topical anesthetic (lidocaine 2%): Apply sparingly 2-3 times daily for severe itching - test small area first for sensitivity',
              'Oral pain reliever (Ibuprofen): 200-400mg every 6-8 hours with food for inflammation and pain relief'
            ],
            warning: 'This is demo content. Configure OpenAI API key for real AI analysis. Seek immediate medical attention if you experience: signs of infection (pus, red streaking, fever), severe swelling or difficulty breathing (possible allergic reaction), blistering covering large areas, no improvement after 7 days of treatment, or if condition spreads rapidly. Avoid scratching to prevent secondary bacterial infection.'
          };
          
          setDiagnosis(mockDiagnosis);
          setIsAnalyzing(false);
        }, 3000);
      }
    } catch (error: any) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed: ' + error.message);
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Photo Diagnosis</h1>
        <p className="text-gray-600">Upload medical images for AI-powered visual diagnosis and comprehensive treatment recommendations.</p>
        {!aiService.isConfigured() && (
          <div className="mt-2 p-3 bg-yellow-100 border-2 border-yellow-300 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Configure OpenAI API key in environment variables for real AI-powered image analysis.
            </p>
          </div>
        )}
      </motion.div>

      {/* Doctor Selection Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
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
              defaultSpecialty="Radiologist"
            />
          </div>
          
          <div>
            {selectedDoctor && (
              <TavusAvatar
                doctor={selectedDoctor}
                symptoms={`Image analysis for ${selectedBodyPart || 'medical imaging'} - ${imageType || 'medical image'}`}
                onConversationStart={handleConversationStart}
                onConversationEnd={handleConversationEnd}
                className="h-full"
              />
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Photo Upload */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl border-2 border-medical-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Camera className="h-5 w-5 mr-2 text-medical-primary" />
            Upload Medical Images
          </h2>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive 
                ? 'border-medical-primary bg-medical-primary/10 shadow-lg' 
                : 'border-medical-primary/30 hover:border-medical-primary hover:bg-medical-primary/5'
            }`}
          >
            <input {...getInputProps()} />
            <Camera className="mx-auto h-12 w-12 text-medical-primary mb-4" />
            {isDragActive ? (
              <p className="text-medical-primary font-medium">Drop the images here...</p>
            ) : (
              <div>
                <p className="text-gray-800 mb-2">
                  <strong>Click to upload</strong> or drag and drop
                </p>
                <p className="text-sm text-gray-600">
                  All medical images: DICOM, MRI, CT, X-Ray, Photos (JPG, PNG, WebP)
                </p>
              </div>
            )}
          </div>

          {/* Image Type Selection */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What type of medical image is this?
            </label>
            <select
              value={imageType}
              onChange={(e) => setImageType(e.target.value)}
              className="w-full p-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors text-gray-800"
            >
              <option value="" className="text-gray-800">Select image type</option>
              {imageTypes.map((type) => (
                <option key={type} value={type} className="text-gray-800">{type}</option>
              ))}
            </select>
          </div>

          {/* Body Part Selection */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Which body part is shown in the image?
            </label>
            <select
              value={selectedBodyPart}
              onChange={(e) => setSelectedBodyPart(e.target.value)}
              className="w-full p-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors text-gray-800"
            >
              <option value="" className="text-gray-800">Select body part</option>
              {bodyParts.map((part) => (
                <option key={part} value={part} className="text-gray-800">{part}</option>
              ))}
            </select>
          </div>

          {/* Uploaded Images */}
          {uploadedImages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Uploaded Images</h3>
              <div className="grid grid-cols-2 gap-3">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl border-2 border-medical-primary/30"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || uploadedImages.length === 0}
                className="w-full mt-4 bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    {aiService.isConfigured() ? 'AI Analyzing Images...' : 'Generating Demo Analysis...'}
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Analyze with AI
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>

        {/* Analysis Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl border-2 border-medical-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Eye className="h-5 w-5 mr-2 text-medical-primary" />
            Visual Diagnosis & Treatment
          </h2>

          {!diagnosis && !isAnalyzing && (
            <div className="text-center py-12">
              <Camera className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-600">Upload medical images to get AI-powered visual diagnosis and comprehensive treatment plan</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="text-center py-12">
              <div className="animate-spin mx-auto h-12 w-12 border-4 border-medical-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-800 font-medium">
                {aiService.isConfigured() ? 'AI is analyzing your images...' : 'Generating demo analysis...'}
              </p>
              <p className="text-sm text-gray-600 mt-2">Advanced computer vision in progress</p>
            </div>
          )}

          {diagnosis && (
            <div className="space-y-6">
              {/* Anomaly Alert */}
              {diagnosis.findings && diagnosis.findings.length > 0 && (
                <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-xl p-4 border-2 border-red-300">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">Visual Analysis Complete</h3>
                  </div>
                  <p className="text-sm text-gray-700">AI has completed visual analysis. Full treatment plan generated below.</p>
                </div>
              )}

              {/* Diagnosis */}
              <div className="bg-gradient-to-r from-medical-primary/20 to-medical-secondary/20 rounded-xl p-4 border-2 border-medical-primary/30">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-medical-primary mr-2" />
                  <h3 className="font-semibold text-gray-800">Visual Diagnosis</h3>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">{diagnosis.diagnosis?.condition || 'Analysis Complete'}</h4>
                <p className="text-sm text-gray-700 mb-2">{diagnosis.diagnosis?.description || 'Visual analysis completed successfully.'}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700">Confidence: </span>
                    <span className="font-semibold text-gray-800 ml-1">{((diagnosis.diagnosis?.confidence || 0.75) * 100).toFixed(1)}%</span>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                    Analysis Complete
                  </span>
                </div>
              </div>

              {/* Findings */}
              {diagnosis.findings && diagnosis.findings.length > 0 && (
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4 border-2 border-blue-300">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600" />
                    Visual Findings
                  </h3>
                  <div className="space-y-3">
                    {diagnosis.findings.map((finding: any, index: number) => (
                      <div key={index} className="bg-white/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-800">{finding.type}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            finding.severity === 'mild' ? 'bg-green-100 text-green-700' :
                            finding.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {finding.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">{finding.description}</p>
                        <p className="text-xs text-gray-600">Confidence: {(finding.confidence * 100).toFixed(1)}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Natural Remedies */}
              {diagnosis.naturalRemedies && (
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border-2 border-green-300">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Leaf className="h-5 w-5 mr-2 text-green-600" />
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
              )}

              {/* Healing Foods */}
              {diagnosis.foods && (
                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-4 border-2 border-orange-300">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Pill className="h-5 w-5 mr-2 text-orange-600" />
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
              )}

              {/* Medications */}
              {diagnosis.medications && (
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border-2 border-purple-300">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Pill className="h-5 w-5 mr-2 text-purple-600" />
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
              )}

              {/* Warning */}
              <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-xl p-4 border-2 border-red-300">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                  Important Warning
                </h3>
                <p className="text-sm text-gray-700">{diagnosis.warning || 'This is AI analysis for informational purposes. Always consult with a qualified healthcare professional for proper diagnosis and treatment.'}</p>
              </div>

              {/* E-commerce Integration */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border-2 border-purple-300">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-purple-600" />
                  Purchase Recommended Items
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setShowPurchaseModal(true)}
                    className="bg-purple-200 hover:bg-purple-300 border-2 border-purple-400 text-purple-800 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                  >
                    Buy Medicines
                  </button>
                  <button 
                    onClick={() => setShowPurchaseModal(true)}
                    className="bg-green-200 hover:bg-green-300 border-2 border-green-400 text-green-800 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                  >
                    Order Foods
                  </button>
                </div>
              </div>

              {/* Start Treatment Button */}
              <div className="flex space-x-3">
                <button className="flex-1 bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200">
                  Start Treatment Plan
                </button>
                <button className="flex-1 bg-white hover:bg-gray-50 border-2 border-medical-primary/30 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors">
                  View Full Details
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      
      <PurchaseModal 
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        recommendedItems={diagnosis?.naturalRemedies || []}
      />
    </div>
  );
};

export default PhotoDiagnosis;