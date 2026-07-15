import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import PageHeader from '../../components/PageHeader';
import { AlertCircle, Loader2, Heart, Users, HandCoins, CheckCircle } from 'lucide-react';

interface PageSection {
  id: string;
  section_key: string;
  title: string;
  content: string;
  order_num: number;
}

const inputClass =
  'w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-base text-gray-800 placeholder:text-gray-400';

const labelClass = 'mb-1.5 block text-sm font-bold text-deep';

const ways = [
  {
    icon: Heart,
    title: 'Volunteer',
    text: 'Share your time and skills to support our mission.',
  },
  {
    icon: Users,
    title: 'Partnership',
    text: 'Collaborate with us on programs and initiatives.',
  },
  {
    icon: HandCoins,
    title: 'Donate',
    text: 'Support our work with a financial contribution.',
  },
];

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

      // Fire notification email — non-blocking
      supabase.functions.invoke('send-notification', {
        body: { type: 'volunteer', data: formData },
      }).catch(console.error);

      setFormSuccess(true);
      setFormData({ name: '', email: '', phone: '', interest_area: '', message: '' });
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
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
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
      <PageHeader
        kicker="Get Involved"
        title="Partner with us"
        description="Join us in making a difference in mental health support and awareness."
      />

      {/* Ways to help — photo-anchored intro */}
      <section className="bg-sand py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <img
              src="/images/volunteer.jpg"
              alt="A volunteer in a brightly coloured shirt at a community event"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="space-y-8">
            {ways.map((way) => (
              <div key={way.title} className="border-l-4 border-accent-500 pl-5">
                <way.icon className="h-6 w-6 text-brand-700" aria-hidden="true" />
                <h3 className="mt-2 font-display text-xl font-semibold text-deep">{way.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-gray-600">{way.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {volunteerSection && (
          <section className="mb-14">
            <span className="kicker mb-3">Volunteer</span>
            <h2 className="heading-md text-deep">{volunteerSection.title}</h2>
            <div
              className="prose prose-lg mt-5 max-w-none leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: volunteerSection.content }}
            />
          </section>
        )}

        <section className="mb-14 rounded-2xl bg-white p-8 shadow-md sm:p-10">
          <h2 className="heading-md text-deep">Volunteer application</h2>

          {formSuccess ? (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-6">
              <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-brand-700" aria-hidden="true" />
              <div>
                <h3 className="font-display text-lg font-semibold text-deep">Application submitted!</h3>
                <p className="mt-1 text-gray-700">
                  Thank you for your interest in volunteering with us. We'll
                  review your application and get back to you soon.
                </p>
                <button
                  onClick={() => setFormSuccess(false)}
                  className="mt-4 cursor-pointer font-bold text-brand-700 underline transition-colors duration-200 hover:text-brand-600"
                >
                  Submit another application
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-7 space-y-6">
              {formError && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4" role="alert">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                  <p className="text-red-800">{formError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>Full name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>Email address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    autoComplete="email"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>Phone number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  autoComplete="tel"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="interest_area" className={labelClass}>Area of interest</label>
                <select
                  id="interest_area"
                  name="interest_area"
                  value={formData.interest_area}
                  onChange={handleInputChange}
                  className={inputClass}
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
                <label htmlFor="message" className={labelClass}>Tell us about yourself</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className={inputClass}
                  placeholder="Share your experience, skills, and why you'd like to volunteer with us…"
                />
              </div>

              <button
                type="submit"
                disabled={formSubmitting}
                className="btn-primary w-full disabled:cursor-wait disabled:opacity-60"
              >
                {formSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    Submitting…
                  </>
                ) : (
                  'Submit application'
                )}
              </button>
            </form>
          )}
        </section>

        {partnershipSection && (
          <section className="mb-14">
            <span className="kicker mb-3">Partnership</span>
            <h2 className="heading-md text-deep">{partnershipSection.title}</h2>
            <div
              className="prose prose-lg mt-5 max-w-none leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: partnershipSection.content }}
            />
          </section>
        )}

        {donateSection && (
          <section className="rounded-2xl bg-deep p-10 text-center">
            <h2 className="heading-md text-white">{donateSection.title}</h2>
            <div
              className="prose prose-lg mx-auto mt-4 max-w-none leading-relaxed text-brand-100 prose-p:text-brand-100"
              dangerouslySetInnerHTML={{ __html: donateSection.content }}
            />
            <a href="/contact" className="btn-primary mt-8">
              Get in touch
            </a>
          </section>
        )}
      </div>
    </PublicLayout>
  );
}
