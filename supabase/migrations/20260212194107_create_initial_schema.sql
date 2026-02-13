/*
  # Lifeferry Mental Health Initiative - Initial Schema

  ## Overview
  Complete database schema for NGO website with admin CMS functionality.

  ## New Tables

  ### 1. users
  - `id` (uuid, primary key) - Auto-generated user ID
  - `email` (text, unique) - User email for login
  - `password_hash` (text) - Hashed password
  - `name` (text) - Full name
  - `role` (text) - User role: SUPER_ADMIN, ADMIN, or EDITOR
  - `is_active` (boolean) - Account status
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. page_sections
  - `id` (uuid, primary key)
  - `page_key` (text) - Page identifier (home, about, partner)
  - `section_key` (text) - Section identifier within page
  - `title` (text) - Section title
  - `content` (text) - Section content (rich text/HTML)
  - `order_num` (integer) - Display order
  - `is_active` (boolean) - Visibility status
  - `updated_at` (timestamptz)

  ### 3. team_members
  - `id` (uuid, primary key)
  - `name` (text) - Member name
  - `role_title` (text) - Job title/position
  - `category` (text) - FOUNDER, LEADERSHIP, or STAFF
  - `bio` (text) - Biography
  - `photo_url` (text) - Profile photo
  - `socials_json` (jsonb) - Social media links
  - `order_num` (integer) - Display order
  - `is_active` (boolean)
  - `created_at` (timestamptz)

  ### 4. services
  - `id` (uuid, primary key)
  - `title` (text) - Service name
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Short description
  - `details` (text) - Full details (rich text)
  - `duration` (text) - Session duration (optional)
  - `eligibility` (text) - Eligibility notes
  - `price` (text) - Price information (optional)
  - `order_num` (integer) - Display order
  - `is_active` (boolean)
  - `created_at` (timestamptz)

  ### 5. booking_requests
  - `id` (uuid, primary key)
  - `service_id` (uuid, foreign key)
  - `name` (text) - Client name
  - `email` (text) - Client email
  - `phone` (text) - Client phone
  - `preferred_datetime` (text) - Preferred date/time
  - `message` (text) - Additional message
  - `status` (text) - NEW, IN_PROGRESS, CONFIRMED, or CLOSED
  - `disclaimer_accepted` (boolean) - Mental health disclaimer acceptance
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. program_events
  - `id` (uuid, primary key)
  - `title` (text) - Event title
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Event description
  - `event_datetime` (timestamptz) - Event date and time
  - `location` (text) - Physical location or "Online"
  - `link` (text) - Registration/online meeting link
  - `image_url` (text) - Event poster image
  - `status` (text) - UPCOMING or PAST
  - `is_active` (boolean)
  - `created_at` (timestamptz)

  ### 7. resources
  - `id` (uuid, primary key)
  - `title` (text) - Resource title
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Resource description
  - `category` (text) - Resource category
  - `tags` (text[]) - Array of tags
  - `file_url` (text) - Download file URL
  - `cover_url` (text) - Cover image
  - `download_count` (integer) - Download counter
  - `is_active` (boolean)
  - `created_at` (timestamptz)

  ### 8. blog_posts
  - `id` (uuid, primary key)
  - `title` (text) - Post title
  - `slug` (text, unique) - URL-friendly identifier
  - `excerpt` (text) - Short excerpt
  - `content` (text) - Full content (rich text/markdown)
  - `cover_url` (text) - Cover image
  - `author_name` (text) - Author name
  - `tags` (text[]) - Array of tags
  - `status` (text) - DRAFT or PUBLISHED
  - `seo_title` (text) - SEO meta title
  - `seo_description` (text) - SEO meta description
  - `published_at` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 9. subscribers
  - `id` (uuid, primary key)
  - `email` (text, unique) - Subscriber email
  - `consent` (boolean) - Consent checkbox
  - `is_active` (boolean) - Subscription status
  - `created_at` (timestamptz)

  ### 10. media_items
  - `id` (uuid, primary key)
  - `type` (text) - PHOTO or VIDEO
  - `title` (text) - Media title
  - `url` (text) - Media URL
  - `thumbnail_url` (text) - Thumbnail URL
  - `order_num` (integer) - Display order
  - `is_active` (boolean)
  - `created_at` (timestamptz)

  ### 11. contact_messages
  - `id` (uuid, primary key)
  - `name` (text) - Sender name
  - `email` (text) - Sender email
  - `phone` (text) - Sender phone
  - `subject` (text) - Message subject
  - `message` (text) - Message content
  - `is_read` (boolean) - Read status
  - `created_at` (timestamptz)

  ### 12. volunteer_applications
  - `id` (uuid, primary key)
  - `name` (text) - Applicant name
  - `email` (text) - Applicant email
  - `phone` (text) - Applicant phone
  - `interest_area` (text) - Area of interest
  - `message` (text) - Application message
  - `status` (text) - NEW, REVIEWING, ACCEPTED, DECLINED
  - `created_at` (timestamptz)

  ### 13. faq_items
  - `id` (uuid, primary key)
  - `question` (text) - FAQ question
  - `answer` (text) - FAQ answer
  - `category` (text) - FAQ category
  - `order_num` (integer) - Display order
  - `is_active` (boolean)
  - `created_at` (timestamptz)

  ### 14. legal_pages
  - `id` (uuid, primary key)
  - `page_key` (text, unique) - privacy, terms, disclaimer
  - `title` (text) - Page title
  - `content` (text) - Page content (rich text)
  - `updated_at` (timestamptz)

  ### 15. site_settings
  - `id` (uuid, primary key)
  - `key` (text, unique) - Setting key
  - `value` (text) - Setting value (JSON for complex values)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add policies for admin access (authenticated users with appropriate roles)
  - Add policies for public read access where appropriate
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Super admins can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'SUPER_ADMIN'
    )
  );

CREATE POLICY "Super admins can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'SUPER_ADMIN'
    )
  );

CREATE POLICY "Super admins can update users"
  ON users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'SUPER_ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'SUPER_ADMIN'
    )
  );

-- Page sections table
CREATE TABLE IF NOT EXISTS page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL,
  section_key text NOT NULL,
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  order_num integer DEFAULT 0,
  is_active boolean DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page_key, section_key)
);

ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active page sections"
  ON page_sections FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage page sections"
  ON page_sections FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role_title text NOT NULL,
  category text NOT NULL CHECK (category IN ('FOUNDER', 'LEADERSHIP', 'STAFF')),
  bio text DEFAULT '',
  photo_url text DEFAULT '',
  socials_json jsonb DEFAULT '{}'::jsonb,
  order_num integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active team members"
  ON team_members FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage team members"
  ON team_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  details text DEFAULT '',
  duration text DEFAULT '',
  eligibility text DEFAULT '',
  price text DEFAULT '',
  order_num integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active services"
  ON services FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage services"
  ON services FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

-- Booking requests table
CREATE TABLE IF NOT EXISTS booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  preferred_datetime text NOT NULL,
  message text DEFAULT '',
  status text DEFAULT 'NEW' CHECK (status IN ('NEW', 'IN_PROGRESS', 'CONFIRMED', 'CLOSED')),
  disclaimer_accepted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create booking requests"
  ON booking_requests FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can read all booking requests"
  ON booking_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

CREATE POLICY "Admins can update booking requests"
  ON booking_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

-- Program events table
CREATE TABLE IF NOT EXISTS program_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  event_datetime timestamptz NOT NULL,
  location text DEFAULT '',
  link text DEFAULT '',
  image_url text DEFAULT '',
  status text DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING', 'PAST')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE program_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active program events"
  ON program_events FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Editors and admins can manage program events"
  ON program_events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')
    )
  );

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  category text DEFAULT '',
  tags text[] DEFAULT ARRAY[]::text[],
  file_url text NOT NULL,
  cover_url text DEFAULT '',
  download_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active resources"
  ON resources FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Anyone can increment download count"
  ON resources FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Editors and admins can manage resources"
  ON resources FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')
    )
  );

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text DEFAULT '',
  content text DEFAULT '',
  cover_url text DEFAULT '',
  author_name text DEFAULT '',
  tags text[] DEFAULT ARRAY[]::text[],
  status text DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED')),
  seo_title text DEFAULT '',
  seo_description text DEFAULT '',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts FOR SELECT
  TO public
  USING (status = 'PUBLISHED' AND published_at IS NOT NULL);

CREATE POLICY "Editors and admins can manage blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')
    )
  );

-- Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  consent boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON subscribers FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can read subscribers"
  ON subscribers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

-- Media items table
CREATE TABLE IF NOT EXISTS media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('PHOTO', 'VIDEO')),
  title text DEFAULT '',
  url text NOT NULL,
  thumbnail_url text DEFAULT '',
  order_num integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active media items"
  ON media_items FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Editors and admins can manage media items"
  ON media_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')
    )
  );

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  subject text DEFAULT '',
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create contact messages"
  ON contact_messages FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can read contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

CREATE POLICY "Admins can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

-- Volunteer applications table
CREATE TABLE IF NOT EXISTS volunteer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  interest_area text DEFAULT '',
  message text DEFAULT '',
  status text DEFAULT 'NEW' CHECK (status IN ('NEW', 'REVIEWING', 'ACCEPTED', 'DECLINED')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create volunteer applications"
  ON volunteer_applications FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can read volunteer applications"
  ON volunteer_applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

CREATE POLICY "Admins can update volunteer applications"
  ON volunteer_applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

-- FAQ items table
CREATE TABLE IF NOT EXISTS faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT '',
  order_num integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active FAQ items"
  ON faq_items FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage FAQ items"
  ON faq_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

-- Legal pages table
CREATE TABLE IF NOT EXISTS legal_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text UNIQUE NOT NULL CHECK (page_key IN ('privacy', 'terms', 'disclaimer')),
  title text NOT NULL,
  content text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read legal pages"
  ON legal_pages FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage legal pages"
  ON legal_pages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
  ON site_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Super admins can manage site settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'SUPER_ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'SUPER_ADMIN'
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_page_sections_page_key ON page_sections(page_key);
CREATE INDEX IF NOT EXISTS idx_team_members_category ON team_members(category);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_program_events_slug ON program_events(slug);
CREATE INDEX IF NOT EXISTS idx_program_events_datetime ON program_events(event_datetime);
CREATE INDEX IF NOT EXISTS idx_resources_slug ON resources(slug);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);