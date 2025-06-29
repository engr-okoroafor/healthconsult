/*
  # Create get_available_doctors RPC function

  1. New Functions
    - `get_available_doctors` - Returns available doctors based on user subscription status
  
  2. Security
    - Function is accessible to authenticated users
    - Checks user subscription status for premium doctors
  
  3. Logic
    - Returns all free doctors to all users
    - Returns premium doctors only to users with active subscriptions
*/

CREATE OR REPLACE FUNCTION get_available_doctors(target_user_id uuid)
RETURNS TABLE (
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
  user_has_premium boolean := false;
BEGIN
  -- Check if user has active premium subscription
  SELECT EXISTS (
    SELECT 1 FROM subscriptions s 
    WHERE s.user_id = target_user_id 
    AND s.status = 'active' 
    AND s.plan_type IN ('monthly', 'yearly')
  ) INTO user_has_premium;

  -- Return doctors based on subscription status
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
      WHEN d.is_premium = true AND user_has_premium = true THEN true
      ELSE false
    END as is_available
  FROM doctors d
  ORDER BY d.is_premium ASC, d.name ASC;
END;
$$;