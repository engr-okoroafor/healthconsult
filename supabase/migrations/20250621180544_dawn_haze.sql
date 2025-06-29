/*
  # HealthCare AI Database Schema

  1. New Tables
    - `users` - User accounts with role-based access
    - `profiles` - User settings and preferences
    - `symptoms` - Master symptoms catalog
    - `user_symptoms` - User-reported symptoms
    - `diagnoses` - AI diagnosis results
    - `treatment_plans` - Comprehensive treatment plans
    - `alerts` - User notifications and reminders
    - `purchases` - E-commerce transactions
    - `medication_reminders` - Voice alert reminders
    - `prevention_tips` - AI-generated prevention advice

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Secure functions for notifications and scheduling

  3. Functions
    - `notify_user()` - Create user notifications
    - `generate_schedule()` - Generate daily treatment schedules
    - `fetch_prevention_tips()` - Get personalized prevention tips
*/

-- Users table with role-based access
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'nurse', 'doctor', 'admin')),
  department text,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User profiles with settings
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  settings jsonb DEFAULT '{}',
  notification_preferences jsonb DEFAULT '{
    "newAnalysis": true,
    "criticalFindings": true,
    "reportUpdates": false,
    "voiceAlerts": true
  }',
  ai_preferences jsonb DEFAULT '{
    "defaultModel": "general-practitioner",
    "sensitivity": "standard",
    "apiProvider": "gemini"
  }',
  display_preferences jsonb DEFAULT '{
    "theme": "dark",
    "zoomLevel": "fit",
    "preset": "standard"
  }',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Master symptoms table
CREATE TABLE IF NOT EXISTS symptoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text,
  description text,
  severity_indicators jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- User-reported symptoms
CREATE TABLE IF NOT EXISTS user_symptoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  symptom_ids uuid[] DEFAULT '{}',
  body_parts jsonb DEFAULT '[]',
  severity text CHECK (severity IN ('mild', 'moderate', 'severe')),
  duration text,
  description text,
  additional_info jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- AI diagnoses with image analysis
CREATE TABLE IF NOT EXISTS diagnoses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  user_symptoms_id uuid REFERENCES user_symptoms(id),
  image_urls text[] DEFAULT '{}',
  image_types text[] DEFAULT '{}',
  body_parts_analyzed text[] DEFAULT '{}',
  ai_model_used text DEFAULT 'general-practitioner',
  results jsonb NOT NULL DEFAULT '{}',
  confidence_score decimal(3,2),
  anomaly_detected boolean DEFAULT false,
  severity text CHECK (severity IN ('mild', 'moderate', 'severe')),
  status text DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'failed')),
  processing_time_ms integer,
  created_at timestamptz DEFAULT now()
);

-- Comprehensive treatment plans
CREATE TABLE IF NOT EXISTS treatment_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnosis_id uuid REFERENCES diagnoses(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  plan_data jsonb NOT NULL DEFAULT '{}',
  lifecycle_phases jsonb DEFAULT '{
    "phase1": "Immediate relief (Days 1-3)",
    "phase2": "Healing phase (Days 4-7)", 
    "phase3": "Recovery and prevention (Week 2+)"
  }',
  natural_remedies jsonb DEFAULT '[]',
  recommended_foods jsonb DEFAULT '[]',
  medications jsonb DEFAULT '[]',
  exercises jsonb DEFAULT '[]',
  daily_schedule jsonb DEFAULT '[]',
  prevention_tips jsonb DEFAULT '[]',
  status text DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'paused')),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User alerts and notifications
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('medication_reminder', 'critical_finding', 'analysis_complete', 'treatment_update')),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  is_voice_alert boolean DEFAULT false,
  scheduled_for timestamptz,
  created_at timestamptz DEFAULT now()
);

-- E-commerce purchases
CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  treatment_plan_id uuid REFERENCES treatment_plans(id),
  item_type text NOT NULL CHECK (item_type IN ('medicine', 'food', 'supplement')),
  item_id text NOT NULL,
  item_name text NOT NULL,
  quantity integer DEFAULT 1,
  price decimal(10,2),
  currency text DEFAULT 'USD',
  payment_provider text CHECK (payment_provider IN ('stripe', 'paystack')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_info jsonb DEFAULT '{}',
  delivery_status text DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'shipped', 'delivered', 'cancelled')),
  delivery_address jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Medication reminders for voice alerts
CREATE TABLE IF NOT EXISTS medication_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  treatment_plan_id uuid REFERENCES treatment_plans(id),
  medication_name text NOT NULL,
  dosage text,
  frequency text,
  reminder_times time[] DEFAULT '{}',
  voice_message text,
  is_active boolean DEFAULT true,
  next_reminder timestamptz,
  created_at timestamptz DEFAULT now()
);

-- AI-generated prevention tips
CREATE TABLE IF NOT EXISTS prevention_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  category text,
  tip_text text NOT NULL,
  relevance_score decimal(3,2),
  based_on_history jsonb DEFAULT '{}',
  is_personalized boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE prevention_tips ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Profiles policies
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Symptoms are readable by all authenticated users
CREATE POLICY "Symptoms readable by all" ON symptoms
  FOR SELECT TO authenticated
  USING (true);

-- User symptoms policies
CREATE POLICY "Users can manage own symptoms" ON user_symptoms
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Diagnoses policies
CREATE POLICY "Users can manage own diagnoses" ON diagnoses
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Treatment plans policies
CREATE POLICY "Users can manage own treatment plans" ON treatment_plans
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Alerts policies
CREATE POLICY "Users can manage own alerts" ON alerts
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Purchases policies
CREATE POLICY "Users can manage own purchases" ON purchases
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Medication reminders policies
CREATE POLICY "Users can manage own reminders" ON medication_reminders
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Prevention tips policies
CREATE POLICY "Users can read own prevention tips" ON prevention_tips
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Functions

-- Notify user function
CREATE OR REPLACE FUNCTION notify_user(
  target_user_id uuid,
  alert_type text,
  alert_title text,
  alert_message text,
  alert_data jsonb DEFAULT '{}',
  is_voice boolean DEFAULT false,
  schedule_for timestamptz DEFAULT now()
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  alert_id uuid;
BEGIN
  INSERT INTO alerts (user_id, type, title, message, data, is_voice_alert, scheduled_for)
  VALUES (target_user_id, alert_type, alert_title, alert_message, alert_data, is_voice, schedule_for)
  RETURNING id INTO alert_id;
  
  RETURN alert_id;
END;
$$;

-- Generate daily schedule function
CREATE OR REPLACE FUNCTION generate_schedule(plan_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  plan_data jsonb;
  schedule jsonb;
BEGIN
  SELECT plan_data INTO plan_data FROM treatment_plans WHERE id = plan_id;
  
  -- Generate a sample daily schedule
  schedule := jsonb_build_array(
    jsonb_build_object(
      'time', '08:00',
      'activity', 'Morning medication',
      'type', 'medication',
      'reminder', true
    ),
    jsonb_build_object(
      'time', '12:00',
      'activity', 'Healthy lunch with recommended foods',
      'type', 'nutrition',
      'reminder', false
    ),
    jsonb_build_object(
      'time', '18:00',
      'activity', 'Evening medication',
      'type', 'medication',
      'reminder', true
    ),
    jsonb_build_object(
      'time', '20:00',
      'activity', 'Natural remedy application',
      'type', 'remedy',
      'reminder', true
    )
  );
  
  RETURN schedule;
END;
$$;

-- Fetch personalized prevention tips
CREATE OR REPLACE FUNCTION fetch_prevention_tips(target_user_id uuid)
RETURNS TABLE(tip_text text, category text, relevance_score decimal)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT pt.tip_text, pt.category, pt.relevance_score
  FROM prevention_tips pt
  WHERE pt.user_id = target_user_id
  ORDER BY pt.relevance_score DESC, pt.created_at DESC
  LIMIT 10;
END;
$$;

-- Insert sample symptoms (no foreign key dependencies)
INSERT INTO symptoms (name, category, description) VALUES
('Headache', 'neurological', 'Pain in the head or neck area'),
('Fever', 'general', 'Elevated body temperature'),
('Cough', 'respiratory', 'Forceful expulsion of air from lungs'),
('Nausea', 'gastrointestinal', 'Feeling of sickness with urge to vomit'),
('Fatigue', 'general', 'Extreme tiredness or exhaustion'),
('Skin Rash', 'dermatological', 'Changes in skin color, texture, or appearance'),
('Joint Pain', 'musculoskeletal', 'Pain in joints or surrounding areas'),
('Shortness of Breath', 'respiratory', 'Difficulty breathing or feeling breathless'),
('Chest Pain', 'cardiovascular', 'Pain or discomfort in the chest area'),
('Dizziness', 'neurological', 'Feeling lightheaded or unsteady'),
('Sore Throat', 'respiratory', 'Pain or irritation in the throat'),
('Stomach Pain', 'gastrointestinal', 'Pain in the abdominal area'),
('Back Pain', 'musculoskeletal', 'Pain in the back or spine'),
('Muscle Aches', 'musculoskeletal', 'Pain or soreness in muscles'),
('Runny Nose', 'respiratory', 'Nasal discharge or congestion')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_symptoms_user_id ON user_symptoms(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_user_id ON diagnoses(user_id);
CREATE INDEX IF NOT EXISTS idx_treatment_plans_user_id ON treatment_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_scheduled_for ON alerts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_medication_reminders_user_id ON medication_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_prevention_tips_user_id ON prevention_tips(user_id);