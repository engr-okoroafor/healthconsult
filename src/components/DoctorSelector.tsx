import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Crown, Lock } from 'lucide-react';

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

interface DoctorSelectorProps {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  onDoctorSelect: (doctor: Doctor) => void;
  defaultSpecialty?: string;
  className?: string;
}

const DoctorSelector: React.FC<DoctorSelectorProps> = ({
  doctors,
  selectedDoctor,
  onDoctorSelect,
  defaultSpecialty = 'General Physician',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Comprehensive list of medical specialties with appropriate icons
  const specialtyIcons: { [key: string]: string } = {
    'General Physician': '🩺',
    'Pediatrician': '👶',
    'Dermatologist': '🧴',
    'Neurologist': '🧠',
    'Geriatrician': '👴',
    'Allergist/Immunologist': '🤧',
    'Anesthesiologist': '💉',
    'Cardiologist': '❤️',
    'Endocrinologist': '🔬',
    'Emergency Medicine Physician': '🚨',
    'Gastroenterologist': '🫃',
    'Hematologist': '🩸',
    'Infectious Disease Physician': '🦠',
    'Nephrologist': '🫘',
    'Oncologist': '🎗️',
    'Pathologist': '🔬',
    'Physiatrist': '🏃',
    'Psychiatrist': '🧘',
    'Pulmonologist': '🫁',
    'Radiologist': '📱',
    'Rheumatologist': '🦴',
    'General Surgeon': '🔪',
    'Orthopedic Surgeon': '🦴',
    'Neurosurgeon': '🧠',
    'Cardiothoracic Surgeon': '❤️',
    'Plastic Surgeon': '✨',
    'Ophthalmologist': '👁️',
    'Otolaryngologist': '👂',
    'Urologist': '🫘',
    'Colon and Rectal Surgeon': '🫃',
    'Obstetrician/Gynecologist': '🤱'
  };

  // Create comprehensive doctor list if not provided
  const comprehensiveDoctors = doctors.length > 0 ? doctors : [
    // Primary Care & General
    { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Dr. Sarah Johnson', specialty: 'General Physician', description: 'Primary care and general health management', icon: specialtyIcons['General Physician'], tavus_replica_id: 'rb17cf590e15', tavus_persona_id: 'pdcdad5c5f0e', is_premium: false, is_available: true },
    
    // Medical Specialties
    { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Dr. Michael Chen', specialty: 'Cardiologist', description: 'Heart and cardiovascular system specialist', icon: specialtyIcons['Cardiologist'], tavus_replica_id: 'rb17cf590e16', tavus_persona_id: 'pdcdad5c5f1e', is_premium: true, is_available: true },
    { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Dr. Emily Rodriguez', specialty: 'Dermatologist', description: 'Skin, hair, and nail conditions specialist', icon: specialtyIcons['Dermatologist'], tavus_replica_id: 'rb17cf590e17', tavus_persona_id: 'pdcdad5c5f2e', is_premium: true, is_available: true },
    { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Dr. James Wilson', specialty: 'Neurologist', description: 'Brain and nervous system disorders specialist', icon: specialtyIcons['Neurologist'], tavus_replica_id: 'rb17cf590e18', tavus_persona_id: 'pdcdad5c5f3e', is_premium: true, is_available: true },
    { id: '550e8400-e29b-41d4-a716-446655440005', name: 'Dr. Lisa Thompson', specialty: 'Pediatrician', description: 'Children and adolescent health specialist', icon: specialtyIcons['Pediatrician'], tavus_replica_id: 'rb17cf590e19', tavus_persona_id: 'pdcdad5c5f4e', is_premium: true, is_available: true },
    { id: '550e8400-e29b-41d4-a716-446655440006', name: 'Dr. Robert Kim', specialty: 'Geriatrician', description: 'Elderly care and age-related conditions', icon: specialtyIcons['Geriatrician'], tavus_replica_id: 'rb17cf590e20', tavus_persona_id: 'pdcdad5c5f5e', is_premium: true, is_available: true },
    { id: '550e8400-e29b-41d4-a716-446655440007', name: 'Dr. Amanda Davis', specialty: 'Allergist/Immunologist', description: 'Allergies and immune system disorders', icon: specialtyIcons['Allergist/Immunologist'], tavus_replica_id: 'rb17cf590e21', tavus_persona_id: 'pdcdad5c5f6e', is_premium: true, is_available: true },
    { id: '550e8400-e29b-41d4-a716-446655440008', name: 'Dr. David Martinez', specialty: 'Endocrinologist', description: 'Hormones and metabolic disorders', icon: specialtyIcons['Endocrinologist'], tavus_replica_id: 'rb17cf590e22', tavus_persona_id: 'pdcdad5c5f7e', is_premium: true, is_available: true },
    { id: '550e8400-e29b-41d4-a716-446655440009', name: 'Dr. Jennifer Lee', specialty: 'Gastroenterologist', description: 'Digestive system and GI tract specialist', icon: specialtyIcons['Gastroenterologist'], tavus_replica_id: 'rb17cf590e23', tavus_persona_id: 'pdcdad5c5f8e', is_premium: true, is_available: true },
    { id: '550e8400-e29b-41d4-a716-446655440010', name: 'Dr. Mark Brown', specialty: 'Pulmonologist', description: 'Lungs and respiratory system specialist', icon: specialtyIcons['Pulmonologist'], tavus_replica_id: 'rb17cf590e24', tavus_persona_id: 'pdcdad5c5f9e', is_premium: true, is_available: true },
    { id: '550e8400-e29b-41d4-a716-446655440011', name: 'Dr. Rachel Green', specialty: 'Psychiatrist', description: 'Mental health and psychiatric disorders', icon: specialtyIcons['Psychiatrist'], tavus_replica_id: 'rb17cf590e25', tavus_persona_id: 'pdcdad5c5f10e', is_premium: true, is_available: true },
    { id: '550e8400-e29b-41d4-a716-446655440012', name: 'Dr. Alex Thompson', specialty: 'Radiologist', description: 'Medical imaging and diagnostic radiology', icon: specialtyIcons['Radiologist'], tavus_replica_id: 'rb17cf590e26', tavus_persona_id: 'pdcdad5c5f11e', is_premium: true, is_available: true },
    
    // Surgical Specialties
    { id: '550e8400-e29b-41d4-a716-446655440013', name: 'Dr. Steven Clark', specialty: 'General Surgeon', description: 'General surgical procedures and operations', icon: specialtyIcons['General Surgeon'], tavus_replica_id: 'rb17cf590e27', tavus_persona_id: 'pdcdad5c5f12e', is_premium: true, is_available: true },
    { id: '550e8400-e29b-41d4-a716-446655440014', name: 'Dr. Maria Garcia', specialty: 'Orthopedic Surgeon', description: 'Bones, joints, and musculoskeletal system', icon: specialtyIcons['Orthopedic Surgeon'], tavus_replica_id: 'rb17cf590e28', tavus_persona_id: 'pdcdad5c5f13e', is_premium: true, is_available: true },
    { id: '550e8400-e29b-41d4-a716-446655440015', name: 'Dr. Kevin White', specialty: 'Neurosurgeon', description: 'Brain and spinal cord surgery specialist', icon: specialtyIcons['Neurosurgeon'], tavus_replica_id: 'rb17cf590e29', tavus_persona_id: 'pdcdad5c5f14e', is_premium: true, is_available: true },
    { id: '550e8400-e29b-41d4-a716-446655440016', name: 'Dr. Nicole Adams', specialty: 'Ophthalmologist', description: 'Eye surgery and vision specialist', icon: specialtyIcons['Ophthalmologist'], tavus_replica_id: 'rb17cf590e30', tavus_persona_id: 'pdcdad5c5f15e', is_premium: true, is_available: true },
    { id: '550e8400-e29b-41d4-a716-446655440017', name: 'Dr. Thomas Miller', specialty: 'Urologist', description: 'Urinary tract and male reproductive system', icon: specialtyIcons['Urologist'], tavus_replica_id: 'rb17cf590e31', tavus_persona_id: 'pdcdad5c5f16e', is_premium: true, is_available: true },
    { id: '550e8400-e29b-41d4-a716-446655440018', name: 'Dr. Laura Wilson', specialty: 'Obstetrician/Gynecologist', description: 'Women\'s reproductive health specialist', icon: specialtyIcons['Obstetrician/Gynecologist'], tavus_replica_id: 'rb17cf590e32', tavus_persona_id: 'pdcdad5c5f17e', is_premium: true, is_available: true }
  ];

  // Filter doctors to show default specialty first
  const defaultDoctor = comprehensiveDoctors.find(d => d.specialty === defaultSpecialty);
  const otherDoctors = comprehensiveDoctors.filter(d => d.specialty !== defaultSpecialty);

  // Set default doctor if none selected
  React.useEffect(() => {
    if (!selectedDoctor && defaultDoctor) {
      onDoctorSelect(defaultDoctor);
    }
  }, [defaultDoctor, selectedDoctor, onDoctorSelect]);

  const handleDoctorSelect = (doctor: Doctor) => {
    onDoctorSelect(doctor);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selected Doctor Display */}
      <div className="bg-white rounded-2xl border-2 border-medical-primary/20 shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{selectedDoctor?.icon || '👨‍⚕️'}</div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {selectedDoctor?.name || 'Select a Doctor'}
              </h3>
              <p className="text-sm text-medical-primary">
                {selectedDoctor?.specialty || 'Choose your specialist'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedDoctor?.is_premium && (
              <div className="flex items-center text-yellow-600">
                <Crown className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">Premium</span>
              </div>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {selectedDoctor && (
          <p className="text-xs text-gray-600 mt-2">{selectedDoctor.description}</p>
        )}
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto"
          >
            <div className="bg-white rounded-2xl border-2 border-medical-primary/20 shadow-lg overflow-hidden">
              {/* Default Doctor */}
              {defaultDoctor && (
                <div>
                  <div className="px-4 py-2 bg-medical-light/20 border-b border-medical-primary/10">
                    <span className="text-xs font-medium text-medical-primary">Recommended</span>
                  </div>
                  <button
                    onClick={() => handleDoctorSelect(defaultDoctor)}
                    className={`w-full p-4 text-left hover:bg-medical-light/20 transition-colors border-b border-gray-100 ${
                      selectedDoctor?.id === defaultDoctor.id ? 'bg-medical-light/30' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">{defaultDoctor.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-800">{defaultDoctor.name}</h4>
                          <div className="flex items-center space-x-1">
                            {!defaultDoctor.is_available && (
                              <Lock className="h-3 w-3 text-gray-400" />
                            )}
                            {defaultDoctor.is_premium && (
                              <Crown className="h-3 w-3 text-yellow-500" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-medical-primary">{defaultDoctor.specialty}</p>
                        <p className="text-xs text-gray-600 mt-1">{defaultDoctor.description}</p>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* Other Doctors */}
              {otherDoctors.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <span className="text-xs font-medium text-gray-600">All Specialists</span>
                  </div>
                  {otherDoctors.map((doctor) => (
                    <button
                      key={doctor.id}
                      onClick={() => handleDoctorSelect(doctor)}
                      disabled={!doctor.is_available}
                      className={`w-full p-4 text-left transition-colors border-b border-gray-100 last:border-b-0 ${
                        doctor.is_available 
                          ? 'hover:bg-gray-50' 
                          : 'opacity-60 cursor-not-allowed'
                      } ${
                        selectedDoctor?.id === doctor.id ? 'bg-medical-light/30' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-xl">{doctor.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-800">{doctor.name}</h4>
                            <div className="flex items-center space-x-1">
                              {!doctor.is_available && (
                                <div className="flex items-center text-gray-500">
                                  <Lock className="h-3 w-3 mr-1" />
                                  <span className="text-xs">Premium</span>
                                </div>
                              )}
                              {doctor.is_premium && doctor.is_available && (
                                <Crown className="h-3 w-3 text-yellow-500" />
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-medical-primary">{doctor.specialty}</p>
                          <p className="text-xs text-gray-600 mt-1">{doctor.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default DoctorSelector;