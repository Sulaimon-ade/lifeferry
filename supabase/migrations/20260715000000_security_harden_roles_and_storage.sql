/*
  # Security hardening: role assignment and media storage

  Closes three privilege-escalation holes:

  1. Sign-up trigger trusted a client-supplied role. Anyone calling the public
     signup API with `role: 'admin'` in user metadata became an admin. New
     profiles are now ALWAYS created as 'user'.

  2. The "Users can update own profile" policy allowed a user to update any
     column of their own row — including `role` — so a plain user could
     promote themselves to admin. A BEFORE UPDATE trigger now reverts any role
     change attempted by a non-admin, regardless of how the update is made.

  3. Media storage write policies allowed ANY authenticated user to upload,
     overwrite, and delete files. Writes are now restricted to admins.

  Safe to run more than once.
*/

-- ---------------------------------------------------------------------------
-- 1. Sign-up trigger always assigns role 'user'
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'  -- never trust a client-supplied role
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- 2. Block role changes by non-admins
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the role is unchanged, allow.
  IF NEW.role IS NOT DISTINCT FROM OLD.role THEN
    RETURN NEW;
  END IF;
  -- Only an existing admin may change any profile's role.
  IF is_admin() THEN
    RETURN NEW;
  END IF;
  -- Otherwise silently keep the old role.
  NEW.role := OLD.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_role_change ON public.profiles;
CREATE TRIGGER enforce_role_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- ---------------------------------------------------------------------------
-- 3. Restrict media storage writes to admins (reads stay public)
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON storage.objects;

CREATE POLICY "Admins can upload media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media' AND is_admin());

CREATE POLICY "Admins can update media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media' AND is_admin())
  WITH CHECK (bucket_id = 'media' AND is_admin());

CREATE POLICY "Admins can delete media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media' AND is_admin());

-- ---------------------------------------------------------------------------
-- 4. Audit: list every admin account. Review this output — any admin you do
--    not recognise may have been created through the holes above. To demote
--    one: UPDATE profiles SET role = 'user' WHERE id = '<uuid>';
-- ---------------------------------------------------------------------------

SELECT id, email, full_name, role, created_at
FROM public.profiles
WHERE role = 'admin'
ORDER BY created_at;
