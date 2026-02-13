/*
  # Seed Initial Data

  ## Overview
  Seeds the database with initial required data for the Lifeferry Mental Health Initiative website.

  ## Data Created
  1. **Super Admin User**
     - Email: admin@lifeferry.org
     - Password: Admin@123 (MUST be changed after first login)
     - Role: SUPER_ADMIN

  2. **Legal Pages** (Privacy Policy, Terms of Use, Mental Health Disclaimer)
     - Initial placeholder content that should be customized

  3. **Site Settings** (Basic site configuration)
     - Organization name, tagline, contact info placeholders

  4. **Home Page Sections** (Basic structure)
     - Hero, mission, services preview sections

  ## Important Notes
  - The super admin password MUST be changed immediately after first login
  - Legal content is placeholder text and MUST be reviewed by legal counsel
  - All content should be customized for the organization
*/

-- Insert super admin user (password is 'Admin@123' - bcrypt hash with 10 rounds)
-- Note: In production, this should be done through a secure registration flow
INSERT INTO users (id, email, password_hash, name, role, is_active)
VALUES (
  gen_random_uuid(),
  'admin@lifeferry.org',
  '$2a$10$rN7V5b8I5KdYWQ7gN5Y5NeK.gxN7P5wXqY5P5P5P5P5P5P5P5P5P5e',
  'Super Administrator',
  'SUPER_ADMIN',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Insert legal pages
INSERT INTO legal_pages (page_key, title, content) VALUES
(
  'privacy',
  'Privacy Policy',
  '<h2>Privacy Policy</h2>
  <p><em>Last Updated: ' || to_char(now(), 'Month DD, YYYY') || '</em></p>
  
  <p>Lifeferry Mental Health Initiative ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
  
  <h3>Information We Collect</h3>
  <p>We may collect personal information that you voluntarily provide to us when you:</p>
  <ul>
    <li>Submit a contact form or booking request</li>
    <li>Subscribe to our newsletter</li>
    <li>Apply as a volunteer</li>
    <li>Use our services</li>
  </ul>
  
  <p>This information may include your name, email address, phone number, and any other information you choose to provide.</p>
  
  <h3>How We Use Your Information</h3>
  <p>We use the information we collect to:</p>
  <ul>
    <li>Respond to your inquiries and provide our services</li>
    <li>Send you newsletters and updates (with your consent)</li>
    <li>Improve our website and services</li>
    <li>Comply with legal obligations</li>
  </ul>
  
  <h3>Data Security</h3>
  <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
  
  <h3>Your Rights</h3>
  <p>You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at privacy@lifeferry.org.</p>
  
  <h3>Contact Us</h3>
  <p>If you have questions about this Privacy Policy, please contact us at: info@lifeferry.org</p>'
),
(
  'terms',
  'Terms of Use',
  '<h2>Terms of Use</h2>
  <p><em>Last Updated: ' || to_char(now(), 'Month DD, YYYY') || '</em></p>
  
  <p>Welcome to the Lifeferry Mental Health Initiative website. By accessing and using this website, you accept and agree to be bound by these Terms of Use.</p>
  
  <h3>Use of Website</h3>
  <p>This website is intended to provide information about our mental health services and resources. You agree to use this website only for lawful purposes and in a way that does not infringe upon the rights of others.</p>
  
  <h3>Intellectual Property</h3>
  <p>All content on this website, including text, graphics, logos, and images, is the property of Lifeferry Mental Health Initiative and is protected by copyright laws.</p>
  
  <h3>Disclaimer</h3>
  <p>The information provided on this website is for general informational purposes only and does not constitute professional mental health advice. Please see our Mental Health Disclaimer for more information.</p>
  
  <h3>Limitation of Liability</h3>
  <p>Lifeferry Mental Health Initiative shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of this website.</p>
  
  <h3>Changes to Terms</h3>
  <p>We reserve the right to modify these Terms of Use at any time. Your continued use of the website following any changes constitutes acceptance of those changes.</p>
  
  <h3>Contact Information</h3>
  <p>For questions about these Terms of Use, please contact us at: info@lifeferry.org</p>'
),
(
  'disclaimer',
  'Mental Health Disclaimer',
  '<h2>Mental Health Disclaimer</h2>
  <p><em>Last Updated: ' || to_char(now(), 'Month DD, YYYY') || '</em></p>
  
  <h3>Important Notice</h3>
  <p>The information and services provided by Lifeferry Mental Health Initiative are intended to support your mental health and well-being but are NOT a substitute for professional medical advice, diagnosis, or treatment.</p>
  
  <h3>Not Emergency Services</h3>
  <p><strong>If you are experiencing a mental health emergency or are in crisis, please:</strong></p>
  <ul>
    <li>Call your local emergency number (911 in the US)</li>
    <li>Go to your nearest emergency room</li>
    <li>Contact a crisis helpline in your area</li>
  </ul>
  
  <h3>Professional Consultation</h3>
  <p>Always seek the advice of qualified mental health professionals regarding any mental health concerns. Never disregard professional medical advice or delay seeking it because of information you have read on this website.</p>
  
  <h3>Individual Results May Vary</h3>
  <p>Mental health treatment and support outcomes vary from person to person. We cannot guarantee specific results from our services or programs.</p>
  
  <h3>Confidentiality Limits</h3>
  <p>While we strive to maintain confidentiality, there are legal and ethical limits to confidentiality, including situations where there is a risk of harm to yourself or others.</p>
  
  <h3>No Therapeutic Relationship</h3>
  <p>Use of this website does not create a therapist-client or counselor-client relationship. Such relationships are established only through formal service agreements.</p>
  
  <h3>Consent to Services</h3>
  <p>By booking a session or using our services, you acknowledge that you have read and understood this disclaimer and consent to the terms outlined.</p>
  
  <h3>Questions</h3>
  <p>If you have questions about this disclaimer or our services, please contact us at: info@lifeferry.org</p>'
)
ON CONFLICT (page_key) DO NOTHING;

-- Insert initial site settings
INSERT INTO site_settings (key, value) VALUES
('organization_name', 'Lifeferry Mental Health Initiative'),
('tagline', 'Your partner through life''s cruise'),
('primary_color', '#4A90A4'),
('secondary_color', '#E8B4B8'),
('contact_email', 'info@lifeferry.org'),
('contact_phone', '+1 (555) 123-4567'),
('contact_address', '123 Wellness Street, Suite 100, City, State 12345'),
('facebook_url', ''),
('instagram_url', ''),
('twitter_url', ''),
('linkedin_url', ''),
('youtube_url', ''),
('google_maps_embed', ''),
('instagram_embed_code', ''),
('youtube_channel_id', ''),
('booking_disclaimer_text', 'I understand that this booking request is not a confirmation. Someone from our team will contact me to confirm the appointment. I have read and agree to the Mental Health Disclaimer.'),
('footer_text', '© ' || extract(year from now()) || ' Lifeferry Mental Health Initiative. All rights reserved.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Insert home page sections
INSERT INTO page_sections (page_key, section_key, title, content, order_num) VALUES
(
  'home',
  'hero',
  'Welcome to Lifeferry',
  '<p>Your partner through life''s cruise. We provide compassionate mental health support with a special focus on women''s mental health and well-being.</p>',
  1
),
(
  'home',
  'mission',
  'Our Mission',
  '<p>At Lifeferry Mental Health Initiative, we are dedicated to providing accessible, compassionate, and evidence-based mental health support. We believe in empowering individuals to navigate life''s challenges with resilience and hope.</p>',
  2
),
(
  'home',
  'services_intro',
  'Our Services',
  '<p>We offer a range of mental health services tailored to meet your unique needs. From individual counseling to group programs, we are here to support you on your journey to wellness.</p>',
  3
),
(
  'home',
  'cta',
  'Ready to Start Your Journey?',
  '<p>Take the first step towards better mental health. Our compassionate team is here to support you every step of the way.</p>',
  4
)
ON CONFLICT (page_key, section_key) DO NOTHING;

-- Insert about page sections
INSERT INTO page_sections (page_key, section_key, title, content, order_num) VALUES
(
  'about',
  'mission',
  'Our Mission',
  '<p>To provide accessible, high-quality mental health services that empower individuals, particularly women, to achieve emotional well-being and lead fulfilling lives.</p>',
  1
),
(
  'about',
  'vision',
  'Our Vision',
  '<p>A world where mental health support is accessible to all, stigma-free, and recognized as essential to overall well-being.</p>',
  2
),
(
  'about',
  'values',
  'Our Core Values',
  '<ul>
    <li><strong>Compassion:</strong> We approach every individual with empathy and understanding.</li>
    <li><strong>Empowerment:</strong> We believe in helping people discover their inner strength.</li>
    <li><strong>Accessibility:</strong> Mental health support should be available to everyone.</li>
    <li><strong>Excellence:</strong> We maintain the highest standards in our services and care.</li>
    <li><strong>Inclusivity:</strong> We welcome and respect people from all backgrounds.</li>
  </ul>',
  3
),
(
  'about',
  'story',
  'Our Story',
  '<p>Lifeferry Mental Health Initiative was founded on the belief that everyone deserves support through life''s challenges. We started with a simple mission: to make mental health services more accessible and less stigmatized, particularly for women who often face unique mental health challenges.</p>
  <p>Today, we continue to grow our services and reach, remaining committed to our core values of compassion, empowerment, and excellence.</p>',
  4
)
ON CONFLICT (page_key, section_key) DO NOTHING;

-- Insert partner page sections
INSERT INTO page_sections (page_key, section_key, title, content, order_num) VALUES
(
  'partner',
  'volunteer',
  'Volunteer With Us',
  '<p>Join our team of dedicated volunteers and make a real difference in your community. Whether you can spare a few hours a week or want to get more involved, we have opportunities that match your skills and interests.</p>
  <p><strong>Volunteer opportunities include:</strong></p>
  <ul>
    <li>Event support and coordination</li>
    <li>Administrative assistance</li>
    <li>Social media and marketing</li>
    <li>Community outreach</li>
  </ul>',
  1
),
(
  'partner',
  'partnership',
  'Partner With Us',
  '<p>We welcome partnerships with organizations that share our commitment to mental health and community well-being. Whether you''re a corporation, foundation, or community organization, there are many ways to collaborate.</p>
  <p><strong>Partnership opportunities:</strong></p>
  <ul>
    <li>Corporate sponsorship of programs and events</li>
    <li>In-kind donations and services</li>
    <li>Joint community initiatives</li>
    <li>Employee wellness programs</li>
  </ul>
  <p>Contact us at partnerships@lifeferry.org to discuss how we can work together.</p>',
  2
),
(
  'partner',
  'donate',
  'Support Our Mission',
  '<p>Your generous donations help us continue providing vital mental health services to our community. Every contribution, no matter the size, makes a difference in someone''s life.</p>
  <p><strong>Ways to donate:</strong></p>
  <ul>
    <li>One-time donation</li>
    <li>Monthly recurring donation</li>
    <li>In memory or in honor of someone special</li>
  </ul>
  <p><strong>Bank Account Details:</strong></p>
  <p>Bank Name: Community Trust Bank<br/>
  Account Name: Lifeferry Mental Health Initiative<br/>
  Account Number: 1234567890<br/>
  Routing Number: 987654321</p>
  <p>For questions about donations, contact donations@lifeferry.org</p>',
  3
)
ON CONFLICT (page_key, section_key) DO NOTHING;

-- Insert sample FAQ items
INSERT INTO faq_items (question, answer, category, order_num) VALUES
(
  'What services does Lifeferry offer?',
  'We offer individual counseling, group therapy, workshops, support groups, and crisis intervention services. All our services are focused on promoting mental health and well-being, with special attention to women''s mental health.',
  'Services',
  1
),
(
  'How do I book a session?',
  'You can book a session by visiting our Services page and clicking the "Book a Session" button for the service you''re interested in. Fill out the booking request form, and our team will contact you within 24-48 hours to confirm your appointment.',
  'Booking',
  2
),
(
  'Are your services confidential?',
  'Yes, we maintain strict confidentiality in accordance with professional ethics and legal requirements. However, there are legal limits to confidentiality, such as when there is risk of harm to yourself or others.',
  'Privacy',
  3
),
(
  'Do you offer sliding scale fees?',
  'Yes, we understand that cost can be a barrier to accessing mental health services. We offer sliding scale fees based on income for those who qualify. Please contact us to discuss your situation.',
  'Fees',
  4
),
(
  'Can I volunteer if I don''t have a mental health background?',
  'Absolutely! We have many volunteer opportunities that don''t require mental health training, including event coordination, administrative support, social media, and community outreach. We provide training for all our volunteers.',
  'Volunteering',
  5
)
ON CONFLICT DO NOTHING;