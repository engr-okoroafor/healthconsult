import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Phone, 
  Clock, 
  Heart,
  Thermometer,
  Zap,
  Eye,
  Brain,
  Droplets,
  Shield,
  Activity,
  Users,
  Scissors,
  Flame,
  Skull,
  Baby,
  Waves,
  Wind,
  Atom as Stomach
} from 'lucide-react';

const EmergencyGuide: React.FC = () => {
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);

  const emergencyTypes = [
    {
      id: 'chest-pain',
      name: 'Chest Pain',
      icon: Heart,
      severity: 'critical',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'breathing',
      name: 'Difficulty Breathing',
      icon: Activity,
      severity: 'critical',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'stroke',
      name: 'Stroke Signs',
      icon: Brain,
      severity: 'critical',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'bleeding',
      name: 'Severe Bleeding',
      icon: Droplets,
      severity: 'urgent',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'burns',
      name: 'Burns',
      icon: Zap,
      severity: 'urgent',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'fever',
      name: 'High Fever',
      icon: Thermometer,
      severity: 'moderate',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'eye-injury',
      name: 'Eye Injury',
      icon: Eye,
      severity: 'urgent',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'poisoning',
      name: 'Poisoning',
      icon: Shield,
      severity: 'critical',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'choking',
      name: 'Choking',
      icon: Wind,
      severity: 'critical',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'drowning',
      name: 'Drowning',
      icon: Waves,
      severity: 'critical',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'cuts',
      name: 'Deep Cuts',
      icon: Scissors,
      severity: 'urgent',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'allergic-reaction',
      name: 'Allergic Reaction',
      icon: Skull,
      severity: 'critical',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'gunshot',
      name: 'Gun Shot',
      icon: AlertTriangle,
      severity: 'critical',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'stomach-ache',
      name: 'Stomach Ache',
      icon: Stomach,
      severity: 'moderate',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'snake-bite',
      name: 'Snake Bite',
      icon: Shield,
      severity: 'critical',
      color: 'from-red-500 to-red-600'
    }
  ];

  const emergencyDetails = {
    'chest-pain': {
      title: 'Chest Pain Emergency',
      immediateActions: [
        'Call emergency services (911) immediately',
        'Have the person sit down and rest',
        'Loosen tight clothing around neck and chest',
        'If prescribed, help them take nitroglycerin',
        'If unconscious and not breathing, start CPR'
      ],
      warningSigns: [
        'Crushing or squeezing chest pain',
        'Pain radiating to arm, jaw, or back',
        'Shortness of breath',
        'Nausea or vomiting',
        'Sweating or dizziness'
      ],
      doNots: [
        'Do not give food or water',
        'Do not leave the person alone',
        'Do not drive to hospital yourself',
        'Do not give aspirin unless prescribed'
      ]
    },
    'breathing': {
      title: 'Breathing Emergency',
      immediateActions: [
        'Call emergency services immediately',
        'Help person sit upright',
        'Loosen tight clothing',
        'If they have an inhaler, help them use it',
        'Stay calm and reassure the person'
      ],
      warningSigns: [
        'Cannot speak in full sentences',
        'Blue lips or fingernails',
        'Wheezing or gasping',
        'Chest tightness',
        'Rapid breathing'
      ],
      doNots: [
        'Do not lay the person flat',
        'Do not give food or drink',
        'Do not leave them alone',
        'Do not panic - stay calm'
      ]
    },
    'stroke': {
      title: 'Stroke Emergency',
      immediateActions: [
        'Call emergency services immediately',
        'Note the time symptoms started',
        'Keep person calm and lying down',
        'Turn head to side if vomiting',
        'Do not give food, water, or medication'
      ],
      warningSigns: [
        'Face drooping on one side',
        'Arm weakness or numbness',
        'Speech difficulty or slurred words',
        'Sudden severe headache',
        'Loss of balance or coordination'
      ],
      doNots: [
        'Do not give aspirin or medication',
        'Do not give food or water',
        'Do not leave person alone',
        'Do not wait to see if symptoms improve'
      ]
    },
    'bleeding': {
      title: 'Severe Bleeding',
      immediateActions: [
        'Apply direct pressure to wound',
        'Elevate injured area above heart if possible',
        'Use clean cloth or bandage',
        'Call emergency services if bleeding is severe',
        'Apply pressure to pressure points if needed'
      ],
      warningSigns: [
        'Blood soaking through bandages',
        'Spurting or pulsing blood',
        'Large amount of blood loss',
        'Signs of shock (pale, weak, dizzy)',
        'Deep or gaping wounds'
      ],
      doNots: [
        'Do not remove embedded objects',
        'Do not peek under bandages',
        'Do not use tourniquet unless trained',
        'Do not give food or water'
      ]
    },
    'burns': {
      title: 'Burn Emergency',
      immediateActions: [
        'Remove from heat source safely',
        'Cool burn with cool (not cold) water for 10-20 minutes',
        'Remove jewelry before swelling',
        'Cover with sterile, non-stick bandage',
        'Seek medical attention for serious burns'
      ],
      warningSigns: [
        'Burns larger than palm of hand',
        'Burns on face, hands, feet, or genitals',
        'Third-degree burns (white or charred)',
        'Chemical or electrical burns',
        'Signs of infection'
      ],
      doNots: [
        'Do not use ice or very cold water',
        'Do not break blisters',
        'Do not apply butter or oils',
        'Do not remove stuck clothing'
      ]
    },
    'fever': {
      title: 'High Fever Emergency',
      immediateActions: [
        'Take temperature accurately',
        'Remove excess clothing',
        'Apply cool, damp cloths to forehead',
        'Give fluids if person is conscious',
        'Seek medical attention if fever is very high'
      ],
      warningSigns: [
        'Temperature over 103°F (39.4°C)',
        'Fever with severe headache',
        'Difficulty breathing',
        'Persistent vomiting',
        'Signs of dehydration'
      ],
      doNots: [
        'Do not use alcohol to cool down',
        'Do not give aspirin to children',
        'Do not bundle up if shivering',
        'Do not ignore other symptoms'
      ]
    },
    'eye-injury': {
      title: 'Eye Injury Emergency',
      immediateActions: [
        'Do not rub or touch the injured eye',
        'Cover both eyes with sterile gauze',
        'Seek immediate medical attention',
        'If chemical in eye, flush with clean water for 15 minutes',
        'Keep person calm and still'
      ],
      warningSigns: [
        'Visible cut or puncture to eye',
        'Object embedded in eye',
        'Blood in the eye',
        'Sudden vision loss',
        'Severe eye pain'
      ],
      doNots: [
        'Do not remove embedded objects',
        'Do not apply pressure to the eye',
        'Do not use eye drops unless prescribed',
        'Do not allow rubbing of the eye'
      ]
    },
    'poisoning': {
      title: 'Poisoning Emergency',
      immediateActions: [
        'Call Poison Control: 1-800-222-1222',
        'Call 911 if person is unconscious',
        'Identify the poison if possible',
        'Follow Poison Control instructions',
        'Keep person calm and monitor breathing'
      ],
      warningSigns: [
        'Nausea and vomiting',
        'Difficulty breathing',
        'Confusion or altered mental state',
        'Seizures or convulsions',
        'Burns around mouth or throat'
      ],
      doNots: [
        'Do not induce vomiting unless told to',
        'Do not give activated charcoal',
        'Do not give milk or water unless instructed',
        'Do not leave person alone'
      ]
    },
    'choking': {
      title: 'Choking Emergency',
      immediateActions: [
        'Ask "Are you choking?" - if they can\'t speak, act immediately',
        'Stand behind person and give 5 back blows',
        'Give 5 abdominal thrusts (Heimlich maneuver)',
        'Alternate between back blows and abdominal thrusts',
        'Call 911 if object doesn\'t dislodge'
      ],
      warningSigns: [
        'Cannot speak, cough, or breathe',
        'Hands clutching throat',
        'Blue face or lips',
        'Weak or ineffective coughing',
        'High-pitched sounds when breathing'
      ],
      doNots: [
        'Do not hit on back if person can cough',
        'Do not use abdominal thrusts on infants',
        'Do not try to remove object with fingers',
        'Do not give water to clear throat'
      ]
    },
    'drowning': {
      title: 'Drowning Emergency',
      immediateActions: [
        'Get person out of water safely',
        'Call 911 immediately',
        'Check for breathing and pulse',
        'Start CPR if not breathing',
        'Keep person warm and monitor vital signs'
      ],
      warningSigns: [
        'Not breathing or gasping',
        'Blue lips or skin',
        'Unconsciousness',
        'Weak or no pulse',
        'Water coming from mouth/nose'
      ],
      doNots: [
        'Do not assume person is fine if conscious',
        'Do not leave person alone',
        'Do not give food or drink',
        'Do not attempt rescue if you\'re not trained'
      ]
    },
    'cuts': {
      title: 'Deep Cut Emergency',
      immediateActions: [
        'Apply direct pressure with clean cloth',
        'Elevate the injured area if possible',
        'Do not remove embedded objects',
        'Call 911 for severe cuts',
        'Cover wound with sterile bandage'
      ],
      warningSigns: [
        'Cut deeper than 1/4 inch',
        'Edges of wound gape open',
        'Bleeding won\'t stop after 10 minutes',
        'Cut on face, joints, or genitals',
        'Signs of infection (redness, warmth, pus)'
      ],
      doNots: [
        'Do not remove embedded objects',
        'Do not use hydrogen peroxide on deep cuts',
        'Do not close wound with tape',
        'Do not ignore signs of infection'
      ]
    },
    'allergic-reaction': {
      title: 'Severe Allergic Reaction (Anaphylaxis)',
      immediateActions: [
        'Call 911 immediately',
        'Use epinephrine auto-injector if available',
        'Help person lie down with legs elevated',
        'Loosen tight clothing',
        'Monitor breathing and be ready for CPR'
      ],
      warningSigns: [
        'Difficulty breathing or wheezing',
        'Swelling of face, lips, or throat',
        'Rapid pulse or dizziness',
        'Severe whole-body rash',
        'Nausea, vomiting, or diarrhea'
      ],
      doNots: [
        'Do not give oral medications if swallowing is difficult',
        'Do not leave person alone',
        'Do not assume symptoms will improve',
        'Do not delay calling for help'
      ]
    },
    'gunshot': {
      title: 'Gunshot Wound Emergency',
      immediateActions: [
        'Call 911 immediately - this is a life-threatening emergency',
        'Do not move the person unless in immediate danger',
        'Apply direct pressure to bleeding wounds with clean cloth',
        'Do not remove any embedded objects or bullets',
        'Monitor breathing and be prepared to perform CPR'
      ],
      warningSigns: [
        'Heavy bleeding or blood loss',
        'Difficulty breathing or chest wounds',
        'Loss of consciousness',
        'Signs of shock (pale, weak pulse, confusion)',
        'Wounds to head, neck, chest, or abdomen'
      ],
      doNots: [
        'Do not move the person unnecessarily',
        'Do not remove bullets or embedded objects',
        'Do not give food, water, or medications',
        'Do not leave the person alone',
        'Do not try to clean deep wounds'
      ]
    },
    'stomach-ache': {
      title: 'Severe Stomach Ache Emergency',
      immediateActions: [
        'Have person lie down in comfortable position',
        'Apply gentle heat or cold to abdomen as preferred',
        'Monitor for signs of severe complications',
        'Call doctor if pain is severe or persistent',
        'Keep track of symptoms and their progression'
      ],
      warningSigns: [
        'Severe, sudden onset abdominal pain',
        'Pain with fever and vomiting',
        'Rigid or tender abdomen',
        'Blood in vomit or stool',
        'Signs of dehydration or shock'
      ],
      doNots: [
        'Do not give pain medications without medical advice',
        'Do not apply heat if appendicitis is suspected',
        'Do not give food or water if surgery might be needed',
        'Do not ignore severe or worsening pain'
      ]
    },
    'snake-bite': {
      title: 'Snake Bite Emergency',
      immediateActions: [
        'Call 911 or poison control immediately',
        'Keep the person calm and still',
        'Remove jewelry before swelling occurs',
        'Mark the edge of swelling with a pen and time',
        'Position bitten limb below heart level if possible'
      ],
      warningSigns: [
        'Rapid swelling around bite area',
        'Severe pain at bite site',
        'Nausea, vomiting, or dizziness',
        'Difficulty breathing or swallowing',
        'Changes in vision or speech'
      ],
      doNots: [
        'Do not cut the bite or try to suck out venom',
        'Do not apply ice or tourniquet',
        'Do not give alcohol or caffeine',
        'Do not try to catch or kill the snake',
        'Do not elevate the bitten limb above heart level'
      ]
    },
    'eye-injury': {
      title: 'Eye Injury Emergency',
      immediateActions: [
        'Do not rub or touch the injured eye',
        'Cover both eyes with sterile gauze',
        'Seek immediate medical attention',
        'If chemical in eye, flush with clean water for 15 minutes',
        'Keep person calm and still'
      ],
      warningSigns: [
        'Visible cut or puncture to eye',
        'Object embedded in eye',
        'Blood in the eye',
        'Sudden vision loss',
        'Severe eye pain'
      ],
      doNots: [
        'Do not remove embedded objects',
        'Do not apply pressure to the eye',
        'Do not use eye drops unless prescribed',
        'Do not allow rubbing of the eye'
      ]
    },
    'poisoning': {
      title: 'Poisoning Emergency',
      immediateActions: [
        'Call Poison Control: 1-800-222-1222',
        'Call 911 if person is unconscious',
        'Identify the poison if possible',
        'Follow Poison Control instructions',
        'Keep person calm and monitor breathing'
      ],
      warningSigns: [
        'Nausea and vomiting',
        'Difficulty breathing',
        'Confusion or altered mental state',
        'Seizures or convulsions',
        'Burns around mouth or throat'
      ],
      doNots: [
        'Do not induce vomiting unless told to',
        'Do not give activated charcoal',
        'Do not give milk or water unless instructed',
        'Do not leave person alone'
      ]
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-300';
      case 'urgent': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'moderate': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Emergency Medical Guide</h1>
        <p className="text-gray-600">Quick reference guide for medical emergencies. Always call emergency services for serious conditions.</p>
      </motion.div>

      {/* Emergency Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="backdrop-blur-md bg-red-50/50 rounded-2xl border-2 border-red-300 shadow-medical p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-red-600 rounded-xl mr-4">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-800">Emergency Services</h2>
              <p className="text-red-600">For life-threatening emergencies</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-red-800">911</div>
            <p className="text-sm text-red-600">Call immediately</p>
          </div>
        </div>
      </motion.div>

      {/* Emergency Types Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Emergency Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {emergencyTypes.map((emergency, index) => (
            <motion.button
              key={emergency.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => setSelectedEmergency(emergency.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                selectedEmergency === emergency.id
                  ? 'bg-white/70 border-medical-primary shadow-green-glow'
                  : 'bg-white/50 border-white/30 hover:bg-white/70'
              }`}
            >
              <div className={`p-3 rounded-lg bg-gradient-to-r ${emergency.color} w-fit mx-auto mb-3`}>
                <emergency.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium text-gray-800 mb-1">{emergency.name}</h3>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(emergency.severity)}`}>
                {emergency.severity}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Emergency Details */}
      {selectedEmergency && emergencyDetails[selectedEmergency] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
        >
          <div className="flex items-center mb-6">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">
              {emergencyDetails[selectedEmergency].title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Immediate Actions */}
            <div className="bg-green-50/50 rounded-xl p-4 border-2 border-green-300">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Immediate Actions
              </h3>
              <ol className="space-y-2">
                {emergencyDetails[selectedEmergency].immediateActions.map((action, index) => (
                  <li key={index} className="text-sm text-green-700 flex items-start">
                    <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    {action}
                  </li>
                ))}
              </ol>
            </div>

            {/* Warning Signs */}
            <div className="bg-red-50/50 rounded-xl p-4 border-2 border-red-300">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Warning Signs
              </h3>
              <ul className="space-y-2">
                {emergencyDetails[selectedEmergency].warningSigns.map((sign, index) => (
                  <li key={index} className="text-sm text-red-700 flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {sign}
                  </li>
                ))}
              </ul>
            </div>

            {/* Do NOTs */}
            <div className="bg-orange-50/50 rounded-xl p-4 border-2 border-orange-300">
              <h3 className="font-semibold text-orange-800 mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Do NOT Do
              </h3>
              <ul className="space-y-2">
                {emergencyDetails[selectedEmergency].doNots.map((dont, index) => (
                  <li key={index} className="text-sm text-orange-700 flex items-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {dont}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* General Emergency Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">General Emergency Preparedness</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50/50 rounded-lg p-4 border-2 border-blue-300">
            <Phone className="h-5 w-5 text-blue-600 mb-2" />
            <h3 className="font-medium text-blue-800 mb-1">Emergency Contacts</h3>
            <p className="text-sm text-blue-700">Keep important numbers easily accessible</p>
          </div>
          <div className="bg-purple-50/50 rounded-lg p-4 border-2 border-purple-300">
            <Heart className="h-5 w-5 text-purple-600 mb-2" />
            <h3 className="font-medium text-purple-800 mb-1">First Aid Kit</h3>
            <p className="text-sm text-purple-700">Maintain a well-stocked first aid kit</p>
          </div>
          <div className="bg-green-50/50 rounded-lg p-4 border-2 border-green-300">
            <Users className="h-5 w-5 text-green-600 mb-2" />
            <h3 className="font-medium text-green-800 mb-1">CPR Training</h3>
            <p className="text-sm text-green-700">Learn basic life-saving techniques</p>
          </div>
          <div className="bg-yellow-50/50 rounded-lg p-4 border-2 border-yellow-300">
            <Shield className="h-5 w-5 text-yellow-600 mb-2" />
            <h3 className="font-medium text-yellow-800 mb-1">Stay Calm</h3>
            <p className="text-sm text-yellow-700">Keep calm and think clearly in emergencies</p>
          </div>
        </div>
      </motion.div>

      {/* Important Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="backdrop-blur-md bg-yellow-50/50 rounded-2xl border-2 border-yellow-300 shadow-medical p-6"
      >
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Important Disclaimer</h3>
            <p className="text-sm text-yellow-700">
              This guide provides general emergency information and should not replace professional medical training or emergency services. 
              Always call 911 or your local emergency number for serious medical emergencies. When in doubt, seek immediate professional medical help.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmergencyGuide;