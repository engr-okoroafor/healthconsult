/*
  # Seed doctors data

  1. Sample Data
    - Insert sample doctors with different specialties
    - Mix of free and premium doctors
    - Include Tavus replica and persona IDs for demo
  
  2. Categories
    - General practitioners (free)
    - Specialists (premium)
*/

-- Insert sample doctors
INSERT INTO doctors (name, specialty, description, icon, tavus_replica_id, tavus_persona_id, is_premium, consultation_price) VALUES
('Dr. Sarah Johnson', 'General Practitioner', 'Experienced family doctor specializing in primary care and preventive medicine', '👩‍⚕️', 'replica_gp_001', 'persona_gp_001', false, 0),
('Dr. Michael Chen', 'Cardiologist', 'Heart specialist with 15+ years experience in cardiovascular medicine', '❤️', 'replica_cardio_001', 'persona_cardio_001', true, 150),
('Dr. Emily Rodriguez', 'Dermatologist', 'Skin care specialist focusing on medical and cosmetic dermatology', '🧴', 'replica_derm_001', 'persona_derm_001', true, 120),
('Dr. James Wilson', 'Pediatrician', 'Child health specialist with expertise in infant and adolescent care', '👶', 'replica_peds_001', 'persona_peds_001', true, 100),
('Dr. Lisa Thompson', 'Mental Health', 'Licensed therapist specializing in anxiety, depression, and stress management', '🧠', 'replica_mental_001', 'persona_mental_001', false, 0),
('Dr. Robert Kim', 'Orthopedic Surgeon', 'Bone and joint specialist with expertise in sports medicine', '🦴', 'replica_ortho_001', 'persona_ortho_001', true, 200),
('Dr. Amanda Davis', 'Nutritionist', 'Certified nutritionist helping with diet planning and weight management', '🥗', 'replica_nutri_001', 'persona_nutri_001', false, 0),
('Dr. David Martinez', 'Neurologist', 'Brain and nervous system specialist with focus on headaches and seizures', '🧠', 'replica_neuro_001', 'persona_neuro_001', true, 180)
ON CONFLICT (id) DO NOTHING;