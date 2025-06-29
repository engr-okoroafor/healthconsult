/*
  # Consultation Platform Database Schema

  1. New Tables
    - `consultations` - Store consultation sessions with Tavus avatars
    - `purchases` - E-commerce transactions for medicine/food
    - `subscriptions` - User subscription plans and billing
    - `recommendations` - Medicine/food items with prices
    - `doctors` - Available doctor specialties and avatars

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Secure functions for subscription management

  3. Functions
    - `check_subscription_status()` - Verify user subscription
    - `get_available_doctors()` - Get doctors based on subscription
    - `calculate_total_price()` - Calculate purchase totals
*/

-- Doctors/Specialists table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  tavus_replica_id text NOT NULL,
  tavus_persona_id text NOT NULL,
  is_premium boolean DEFAULT false,
  consultation_price decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id),
  doctor_type text NOT NULL,
  symptoms text NOT NULL,
  diagnosis jsonb DEFAULT '{}',
  session_duration integer DEFAULT 0,
  tavus_conversation_id text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  plan_type text NOT NULL CHECK (plan_type IN ('free', 'monthly', 'yearly')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  price decimal(10,2),
  currency text DEFAULT 'NGN',
  payment_provider text CHECK (payment_provider IN ('paystack', 'stripe', 'clerk')),
  payment_id text,
  auto_renew boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recommendations table (medicine/food items)
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('medicine', 'food', 'supplement')),
  description text,
  price_ngn decimal(10,2),
  price_usd decimal(10,2),
  image_url text,
  in_stock boolean DEFAULT true,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Update purchases table to include more fields
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS receiver_name text;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS phone_number text;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS items jsonb DEFAULT '[]';
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS total_price_ngn decimal(10,2);
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS total_price_usd decimal(10,2);

-- Enable Row Level Security
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Doctors are readable by all authenticated users
CREATE POLICY "Doctors readable by all" ON doctors
  FOR SELECT TO authenticated
  USING (true);

-- Consultations policies
CREATE POLICY "Users can manage own consultations" ON consultations
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Subscriptions policies
CREATE POLICY "Users can manage own subscriptions" ON subscriptions
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Recommendations are readable by all authenticated users
CREATE POLICY "Recommendations readable by all" ON recommendations
  FOR SELECT TO authenticated
  USING (true);

-- Functions

-- Check subscription status
CREATE OR REPLACE FUNCTION check_subscription_status(target_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  subscription_status text;
  subscription_end timestamptz;
BEGIN
  SELECT status, end_date INTO subscription_status, subscription_end
  FROM subscriptions 
  WHERE user_id = target_user_id 
    AND status = 'active'
  ORDER BY created_at DESC 
  LIMIT 1;
  
  IF subscription_status IS NULL THEN
    RETURN 'free';
  END IF;
  
  IF subscription_end IS NOT NULL AND subscription_end < now() THEN
    UPDATE subscriptions 
    SET status = 'expired' 
    WHERE user_id = target_user_id AND status = 'active';
    RETURN 'free';
  END IF;
  
  SELECT plan_type INTO subscription_status
  FROM subscriptions 
  WHERE user_id = target_user_id 
    AND status = 'active'
  ORDER BY created_at DESC 
  LIMIT 1;
  
  RETURN COALESCE(subscription_status, 'free');
END;
$$;

-- Get available doctors based on subscription
CREATE OR REPLACE FUNCTION get_available_doctors(target_user_id uuid)
RETURNS TABLE(
  id uuid,
  name text,
  specialty text,
  description text,
  icon text,
  tavus_replica_id text,
  tavus_persona_id text,
  is_premium boolean,
  is_available boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_plan text;
BEGIN
  user_plan := check_subscription_status(target_user_id);
  
  RETURN QUERY
  SELECT 
    d.id,
    d.name,
    d.specialty,
    d.description,
    d.icon,
    d.tavus_replica_id,
    d.tavus_persona_id,
    d.is_premium,
    CASE 
      WHEN d.is_premium = false THEN true
      WHEN user_plan IN ('monthly', 'yearly') THEN true
      ELSE false
    END as is_available
  FROM doctors d
  ORDER BY d.is_premium ASC, d.name ASC;
END;
$$;

-- Calculate total price for purchase
CREATE OR REPLACE FUNCTION calculate_total_price(items jsonb, currency text DEFAULT 'NGN')
RETURNS decimal(10,2)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total decimal(10,2) := 0;
  item jsonb;
  item_price decimal(10,2);
  item_quantity integer;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    item_quantity := (item->>'quantity')::integer;
    
    IF currency = 'USD' THEN
      SELECT price_usd INTO item_price 
      FROM recommendations 
      WHERE id = (item->>'id')::uuid;
    ELSE
      SELECT price_ngn INTO item_price 
      FROM recommendations 
      WHERE id = (item->>'id')::uuid;
    END IF;
    
    total := total + (item_price * item_quantity);
  END LOOP;
  
  RETURN total;
END;
$$;

-- Insert sample doctors
INSERT INTO doctors (name, specialty, description, icon, tavus_replica_id, tavus_persona_id, is_premium) VALUES
('Dr. Sarah Johnson', 'General Physician', 'I can help with common health issues, symptoms analysis, and general medical advice for everyday health concerns.', '🩺', 'rb17cf590e15', 'pdcdad5c5f0e', false),
('Dr. Michael Chen', 'Cardiologist', 'I specialize in heart conditions, cardiovascular health, chest pain, and heart disease prevention and treatment.', '❤️', 'rb17cf590e16', 'pdcdad5c5f1e', true),
('Dr. Emily Rodriguez', 'Dermatologist', 'I treat skin conditions, rashes, acne, eczema, and provide skincare advice for healthy, glowing skin.', '🧴', 'rb17cf590e17', 'pdcdad5c5f2e', true),
('Dr. James Wilson', 'Neurologist', 'I specialize in brain and nervous system disorders, headaches, migraines, and neurological conditions.', '🧠', 'rb17cf590e18', 'pdcdad5c5f3e', true),
('Dr. Lisa Thompson', 'Pediatrician', 'I provide medical care for infants, children, and adolescents, focusing on their unique health needs.', '👶', 'rb17cf590e19', 'pdcdad5c5f4e', true),
('Dr. Robert Kim', 'Orthopedist', 'I treat bone, joint, and muscle problems, sports injuries, and musculoskeletal conditions.', '🦴', 'rb17cf590e20', 'pdcdad5c5f5e', true),
('Dr. Amanda Davis', 'Psychiatrist', 'I help with mental health conditions, anxiety, depression, and provide psychological support and treatment.', '🧘', 'rb17cf590e21', 'pdcdad5c5f6e', true),
('Dr. David Martinez', 'Gastroenterologist', 'I specialize in digestive system disorders, stomach issues, and gastrointestinal health.', '🫃', 'rb17cf590e22', 'pdcdad5c5f7e', true),
('Dr. Jennifer Lee', 'Radiologist', 'I interpret medical images, X-rays, MRIs, and CT scans to help diagnose various medical conditions.', '📱', 'rb17cf590e23', 'pdcdad5c5f8e', true)
ON CONFLICT DO NOTHING;

-- Insert sample recommendations
INSERT INTO recommendations (name, category, description, price_ngn, price_usd, tags) VALUES
-- Medicines
('Paracetamol 500mg', 'medicine', 'Pain relief and fever reducer', 500.00, 1.20, ARRAY['pain', 'fever', 'headache']),
('Ibuprofen 400mg', 'medicine', 'Anti-inflammatory pain reliever', 800.00, 1.90, ARRAY['pain', 'inflammation', 'fever']),
('Amoxicillin 250mg', 'medicine', 'Antibiotic for bacterial infections', 1200.00, 2.90, ARRAY['antibiotic', 'infection']),
('Vitamin C 1000mg', 'supplement', 'Immune system booster', 2500.00, 6.00, ARRAY['vitamin', 'immunity', 'antioxidant']),
('Zinc Tablets', 'supplement', 'Essential mineral for immune function', 1800.00, 4.30, ARRAY['mineral', 'immunity', 'healing']),
('Multivitamin Complex', 'supplement', 'Complete daily vitamin supplement', 3500.00, 8.40, ARRAY['vitamin', 'daily', 'health']),

-- Foods
('Organic Honey 500g', 'food', 'Natural antibacterial and healing properties', 2800.00, 6.70, ARRAY['natural', 'antibacterial', 'healing']),
('Fresh Ginger 250g', 'food', 'Anti-inflammatory and digestive aid', 800.00, 1.90, ARRAY['anti-inflammatory', 'digestive', 'natural']),
('Turmeric Powder 200g', 'food', 'Powerful anti-inflammatory spice', 1500.00, 3.60, ARRAY['anti-inflammatory', 'spice', 'healing']),
('Green Tea Bags (25)', 'food', 'Antioxidant-rich herbal tea', 1200.00, 2.90, ARRAY['antioxidant', 'tea', 'healthy']),
('Garlic Cloves 500g', 'food', 'Natural antibiotic and immune booster', 600.00, 1.40, ARRAY['antibiotic', 'immunity', 'natural']),
('Lemon (6 pieces)', 'food', 'Vitamin C rich citrus fruit', 500.00, 1.20, ARRAY['vitamin-c', 'citrus', 'immunity']),
('Spinach 500g', 'food', 'Iron-rich leafy green vegetable', 800.00, 1.90, ARRAY['iron', 'vegetable', 'nutrition']),
('Salmon Fillet 500g', 'food', 'Omega-3 rich protein source', 4500.00, 10.80, ARRAY['omega-3', 'protein', 'healthy']),
('Avocado (3 pieces)', 'food', 'Healthy fats and nutrients', 1500.00, 3.60, ARRAY['healthy-fats', 'nutrition', 'fruit']),
('Greek Yogurt 500g', 'food', 'Probiotic-rich dairy product', 2200.00, 5.30, ARRAY['probiotic', 'dairy', 'digestive'])
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_premium ON doctors(is_premium);
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_recommendations_category ON recommendations(category);
CREATE INDEX IF NOT EXISTS idx_recommendations_tags ON recommendations USING GIN(tags);