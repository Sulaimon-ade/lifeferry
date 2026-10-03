/*
  # Restore public INSERT on booking_requests

  The "Anyone can create booking request" policy is declared in
  20260212210028_migrate_to_supabase_auth_v2.sql but is not present on the
  live database — anonymous inserts fail with 42501 while contact_messages,
  volunteer_applications and subscribers all accept them. That left the
  booking_requests table unwritable from the public site.

  This recreates the policy so the public "Book a Session" form can submit.
  Reads and updates stay admin-only; this grants INSERT only.
*/

DROP POLICY IF EXISTS "Anyone can create booking request" ON booking_requests;
DROP POLICY IF EXISTS "Anyone can create booking requests" ON booking_requests;

CREATE POLICY "Anyone can create booking request"
  ON booking_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
