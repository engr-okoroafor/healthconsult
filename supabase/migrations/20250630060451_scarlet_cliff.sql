/*
  # Create consultations table

  1. New Tables
    - `consultations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `doctor_id` (uuid, foreign key to doctors)
      - `doctor_type` (text)
      - `symptoms` (text)
      - `diagnosis` (jsonb)
      - `session_duration` (integer)
      - `tavus_conversation_id` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `completed_at` (timestamptz)
  2. Security
    - Enable RLS on `consultations` table
    - Add policies for authenticated users to manage their own consultations
*/

-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id),
  doctor_type text NOT NULL,
  symptoms text NOT NULL,
  diagnosis jsonb DEFAULT '{}'::jsonb,
  session_duration integer DEFAULT 0,
  tavus_conversation_id text,
  status text DEFAULT 'active'::text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT consultations_status_check CHECK (status = ANY (ARRAY['active'::text, 'completed'::text, 'cancelled'::text]))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);

-- Enable Row Level Security
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own consultations"
  ON consultations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own consultations"
  ON consultations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own consultations"
  ON consultations
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own consultations"
  ON consultations
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());