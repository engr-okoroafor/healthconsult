/*
  # Fix Consultations RLS Policies

  1. Security Updates
    - Add INSERT policy for authenticated users to create consultations
    - Ensure proper RLS policies for all consultation operations
    - Fix any missing policies that prevent consultation creation

  2. Policy Details
    - Allow authenticated users to insert their own consultations
    - Maintain existing read/update/delete policies
    - Ensure user_id matches authenticated user's ID
*/

-- Drop existing policies if they exist to recreate them properly
DROP POLICY IF EXISTS "Users can insert own consultations" ON consultations;
DROP POLICY IF EXISTS "Users can read own consultations" ON consultations;
DROP POLICY IF EXISTS "Users can update own consultations" ON consultations;
DROP POLICY IF EXISTS "Users can delete own consultations" ON consultations;

-- Create comprehensive RLS policies for consultations table
CREATE POLICY "Users can insert own consultations"
  ON consultations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own consultations"
  ON consultations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own consultations"
  ON consultations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own consultations"
  ON consultations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure RLS is enabled on consultations table
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;