/*
  # Create Admin Login Function

  ## Overview
  Creates a PostgreSQL function to handle admin authentication using custom users table.

  ## Function Details
  - `admin_login(p_email text, p_password text)` - Authenticates admin users
  - Returns JSON with success status and user data
  - Uses pgcrypto extension for password verification (bcrypt)

  ## Security
  - Function executes with SECURITY DEFINER to access users table
  - Password verification done server-side
  - Returns minimal user data, excludes password_hash
*/

-- Enable pgcrypto extension for password hashing (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create admin login function
CREATE OR REPLACE FUNCTION admin_login(p_email text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_record RECORD;
  v_password_match boolean;
BEGIN
  -- Find user by email
  SELECT id, email, password_hash, name, role, is_active, created_at
  INTO v_user_record
  FROM users
  WHERE email = p_email;

  -- Check if user exists
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Invalid email or password'
    );
  END IF;

  -- Check if user is active
  IF NOT v_user_record.is_active THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Account is inactive. Please contact support.'
    );
  END IF;

  -- Verify password using crypt
  v_password_match := v_user_record.password_hash = crypt(p_password, v_user_record.password_hash);

  IF NOT v_password_match THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Invalid email or password'
    );
  END IF;

  -- Return success with user data (excluding password_hash)
  RETURN json_build_object(
    'success', true,
    'user', json_build_object(
      'id', v_user_record.id,
      'email', v_user_record.email,
      'name', v_user_record.name,
      'role', v_user_record.role,
      'is_active', v_user_record.is_active,
      'created_at', v_user_record.created_at
    )
  );
END;
$$;

-- Create function to hash passwords for user creation
CREATE OR REPLACE FUNCTION hash_password(password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf', 10));
END;
$$;

-- Update the seed data with properly hashed password
UPDATE users
SET password_hash = crypt('Admin@123', gen_salt('bf', 10))
WHERE email = 'admin@lifeferry.org';
