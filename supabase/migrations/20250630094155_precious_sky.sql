/*
  # Fix consultations table policies

  1. Security
    - Enable RLS on `consultations` table if not already enabled
    - Add policies for authenticated users to manage their own consultations
*/

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'consultations' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create insert policy if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'consultations' 
    AND policyname = 'Users can insert own consultations'
  ) THEN
    CREATE POLICY "Users can insert own consultations" 
    ON consultations 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create select policy if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'consultations' 
    AND policyname = 'Users can select own consultations'
  ) THEN
    CREATE POLICY "Users can select own consultations" 
    ON consultations 
    FOR SELECT 
    TO authenticated 
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create update policy if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'consultations' 
    AND policyname = 'Users can update own consultations'
  ) THEN
    CREATE POLICY "Users can update own consultations" 
    ON consultations 
    FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create delete policy if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'consultations' 
    AND policyname = 'Users can delete own consultations'
  ) THEN
    CREATE POLICY "Users can delete own consultations" 
    ON consultations 
    FOR DELETE 
    TO authenticated 
    USING (auth.uid() = user_id);
  END IF;
END $$;