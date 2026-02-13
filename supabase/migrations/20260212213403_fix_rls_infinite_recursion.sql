/*
  # Fix RLS Infinite Recursion in Profiles Table

  1. Changes
    - Drop problematic admin policies on profiles table
    - Create a security definer function to check admin status
    - Recreate admin policies using the helper function
    
  2. Solution
    - The helper function bypasses RLS by using SECURITY DEFINER
    - This prevents the infinite recursion when checking admin status
    
  3. Security
    - Function is SECURITY DEFINER but only returns a boolean
    - No data exposure risk as it only checks the current user's role
*/

-- Drop existing admin policies on profiles that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;

-- Create a helper function to check if current user is admin
-- SECURITY DEFINER bypasses RLS to prevent recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate admin policies using the helper function
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete profiles"
  ON profiles FOR DELETE
  TO authenticated
  USING (is_admin());
