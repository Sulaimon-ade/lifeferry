import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import { AlertCircle, Loader2, Heart, Users, DollarSign, CheckCircle } from 'lucide-react';

interface PageSection {
  id: string;
  section_key: string;
  title: string;
  content: string;
  order_num: number;
}

export default function PartnerPage() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest_area: '',
    message: '',
  });

  useEffect(() => {
    fetchPartnerSections();
  }, []);

  const fetchPartnerSections = async () => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_key', 'partner')
        .eq('is_active', true)
        .order('order_num');

      if (error) throw error;
      setSections(data || []);
    } catch (err) {
      console.error('Error fetching partner sections:', err);
      setError('Failed to load content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    try {
      const { error } = await supabase
        .from('volunteer_applications')
        .insert([formData]);

      if (error) throw error;

      setFormSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        interest_area: '',
        message: '',
      });
    } catch (err) {
      console.error('Error submitting volunteer application:', err);
      setFormError('Failed to submit application. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const getSectionByKey = (key: string) => {
    return sections.find((s) => s.section_key === key);
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const volunteerSection = getSectionByKey('volunteer');
  const partnershipSection = getSectionByKey('partnership');
  const donateSection = getSectionByKey('donate');

  return (
    <PublicLayout>
      <div className="bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6">
            Partner With Us
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Join us in making a difference in mental health support and awareness.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <Heart className="h-12 w-12 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Volunteer</h3>
            <p className="text-gray-600">
              Share your time and skills to support our mission.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <Users className="h-12 w-12 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Partnership</h3>
            <p className="text-gray-600">
              Collaborate with us on programs and initiatives.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <DollarSign className="h-12 w-12 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Donate</h3>
            <p className="text-gray-600">
              Support our work with a financial contribution.
            </p>
          </div>
        </div>

        {volunteerSection && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {volunteerSection.title}
            </h2>
            <div
              className="prose prose-lg prose-teal max-w-none mb-8 text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: volunteerSection.content }}
            />
          </section>
        )}

        <section className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Volunteer Application
          </h2>

          {formSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Application Submitted!
                </h3>
                <p className="text-green-800">
                  Thank you for your interest in volunteering with us. We'll review your application and get back to you soon.
                </p>
                <button
                  onClick={() => setFormSuccess(false)}
                  className="mt-4 text-green-600 hover:text-green-700 font-medium underline"
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-800">{formError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="interest_area" className="block text-sm font-medium text-gray-700 mb-2">
                  Area of Interest
                </label>
                <select
                  id="interest_area"
                  name="interest_area"
                  value={formData.interest_area}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select an area</option>
                  <option value="Counseling Support">Counseling Support</option>
                  <option value="Community Outreach">Community Outreach</option>
                  <option value="Event Coordination">Event Coordination</option>
                  <option value="Social Media & Marketing">Social Media & Marketing</option>
                  <option value="Administrative Support">Administrative Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Tell Us About Yourself
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Share your experience, skills, and why you'd like to volunteer with us..."
                />
              </div>

              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
            </form>
          )}
        </section>

        {partnershipSection && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {partnershipSection.title}
            </h2>
            <div
              className="prose prose-lg prose-teal max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: partnershipSection.content }}
            />
          </section>
        )}

        {donateSection && (
          <section className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              {donateSection.title}
            </h2>
            <div
              className="prose prose-lg max-w-none mb-6 text-teal-50 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: donateSection.content }}
            />
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-white text-teal-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg shadow-lg"
            >
              Get in Touch
            </a>
          </section>
        )}
      </div>
    </PublicLayout>
  );
}
