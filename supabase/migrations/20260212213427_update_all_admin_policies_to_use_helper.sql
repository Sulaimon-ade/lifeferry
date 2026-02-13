/*
  # Update All Admin Policies to Use Helper Function

  1. Changes
    - Drop all admin policies that use inline profile checks
    - Recreate them using the is_admin() helper function
    
  2. Benefits
    - Prevents any future RLS recursion issues
    - Cleaner, more maintainable policy definitions
    - Consistent admin checking across all tables
*/

-- Contact messages policies
DROP POLICY IF EXISTS "Admins can view all contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can update contact messages" ON contact_messages;

CREATE POLICY "Admins can view all contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Booking requests policies
DROP POLICY IF EXISTS "Admins can view all booking requests" ON booking_requests;
DROP POLICY IF EXISTS "Admins can update booking requests" ON booking_requests;

CREATE POLICY "Admins can view all booking requests"
  ON booking_requests FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update booking requests"
  ON booking_requests FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Volunteer applications policies
DROP POLICY IF EXISTS "Admins can view volunteer applications" ON volunteer_applications;
DROP POLICY IF EXISTS "Admins can update volunteer applications" ON volunteer_applications;

CREATE POLICY "Admins can view volunteer applications"
  ON volunteer_applications FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update volunteer applications"
  ON volunteer_applications FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Subscribers policies
DROP POLICY IF EXISTS "Admins can view subscribers" ON subscribers;
DROP POLICY IF EXISTS "Admins can update subscribers" ON subscribers;

CREATE POLICY "Admins can view subscribers"
  ON subscribers FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update subscribers"
  ON subscribers FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Blog posts policies
DROP POLICY IF EXISTS "Admins can view all blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can delete blog posts" ON blog_posts;

CREATE POLICY "Admins can view all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (is_admin());

-- Services policies
DROP POLICY IF EXISTS "Admins can view all services" ON services;
DROP POLICY IF EXISTS "Admins can insert services" ON services;
DROP POLICY IF EXISTS "Admins can update services" ON services;
DROP POLICY IF EXISTS "Admins can delete services" ON services;

CREATE POLICY "Admins can view all services"
  ON services FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (is_admin());

-- Program events policies
DROP POLICY IF EXISTS "Admins can view all program events" ON program_events;
DROP POLICY IF EXISTS "Admins can insert program events" ON program_events;
DROP POLICY IF EXISTS "Admins can update program events" ON program_events;
DROP POLICY IF EXISTS "Admins can delete program events" ON program_events;

CREATE POLICY "Admins can view all program events"
  ON program_events FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert program events"
  ON program_events FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update program events"
  ON program_events FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete program events"
  ON program_events FOR DELETE
  TO authenticated
  USING (is_admin());

-- Resources policies
DROP POLICY IF EXISTS "Admins can view all resources" ON resources;
DROP POLICY IF EXISTS "Admins can insert resources" ON resources;
DROP POLICY IF EXISTS "Admins can update resources" ON resources;
DROP POLICY IF EXISTS "Admins can delete resources" ON resources;

CREATE POLICY "Admins can view all resources"
  ON resources FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert resources"
  ON resources FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update resources"
  ON resources FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete resources"
  ON resources FOR DELETE
  TO authenticated
  USING (is_admin());

-- Team members policies
DROP POLICY IF EXISTS "Admins can view all team members" ON team_members;
DROP POLICY IF EXISTS "Admins can insert team members" ON team_members;
DROP POLICY IF EXISTS "Admins can update team members" ON team_members;
DROP POLICY IF EXISTS "Admins can delete team members" ON team_members;

CREATE POLICY "Admins can view all team members"
  ON team_members FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert team members"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update team members"
  ON team_members FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete team members"
  ON team_members FOR DELETE
  TO authenticated
  USING (is_admin());

-- Media items policies
DROP POLICY IF EXISTS "Admins can view all media items" ON media_items;
DROP POLICY IF EXISTS "Admins can insert media items" ON media_items;
DROP POLICY IF EXISTS "Admins can update media items" ON media_items;
DROP POLICY IF EXISTS "Admins can delete media items" ON media_items;

CREATE POLICY "Admins can view all media items"
  ON media_items FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert media items"
  ON media_items FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update media items"
  ON media_items FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete media items"
  ON media_items FOR DELETE
  TO authenticated
  USING (is_admin());

-- FAQ items policies
DROP POLICY IF EXISTS "Admins can view all FAQ items" ON faq_items;
DROP POLICY IF EXISTS "Admins can insert FAQ items" ON faq_items;
DROP POLICY IF EXISTS "Admins can update FAQ items" ON faq_items;
DROP POLICY IF EXISTS "Admins can delete FAQ items" ON faq_items;

CREATE POLICY "Admins can view all FAQ items"
  ON faq_items FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert FAQ items"
  ON faq_items FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update FAQ items"
  ON faq_items FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete FAQ items"
  ON faq_items FOR DELETE
  TO authenticated
  USING (is_admin());

-- Legal pages policies
DROP POLICY IF EXISTS "Admins can update legal pages" ON legal_pages;

CREATE POLICY "Admins can update legal pages"
  ON legal_pages FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Page sections policies
DROP POLICY IF EXISTS "Admins can view all page sections" ON page_sections;
DROP POLICY IF EXISTS "Admins can insert page sections" ON page_sections;
DROP POLICY IF EXISTS "Admins can update page sections" ON page_sections;
DROP POLICY IF EXISTS "Admins can delete page sections" ON page_sections;

CREATE POLICY "Admins can view all page sections"
  ON page_sections FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert page sections"
  ON page_sections FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update page sections"
  ON page_sections FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete page sections"
  ON page_sections FOR DELETE
  TO authenticated
  USING (is_admin());

-- Site settings policies
DROP POLICY IF EXISTS "Admins can insert site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can delete site settings" ON site_settings;

CREATE POLICY "Admins can insert site settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update site settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete site settings"
  ON site_settings FOR DELETE
  TO authenticated
  USING (is_admin());
