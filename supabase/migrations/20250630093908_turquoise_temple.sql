/*
  # Create consultations table policies

  1. Security
    - Enable RLS on `consultations` table
    - Add policies for authenticated users to manage their own consultations
*/

-- Enable RLS
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert own consultations" 
ON consultations 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select own consultations" 
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