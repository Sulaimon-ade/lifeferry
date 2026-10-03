import { useEffect, useState, FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import PageHeader from '../../components/PageHeader';
import { AlertCircle, Loader2, CheckCircle, CalendarCheck, ShieldCheck, Clock } from 'lucide-react';

const inputClass =
  'w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-base text-gray-800 placeholder:text-gray-400';

const labelClass = 'mb-1.5 block text-sm font-bold text-deep';

// What kind of support someone is asking for. Deliberately broader than the
// three services on /services — people book by need, not by service page.
const serviceTypes = [
  'Marriage & family life counseling',
  'Addiction therapy',
  'General mental health therapy',
  'Personal growth & coaching',
  'Anxiety & depression support',
  'Grief & bereavement support',
  'Trauma counseling',
  'Youth & adolescent counseling',
  'Workplace stress & burnout',
  'Something else / not sure yet',
];

const assurances = [
  {
    icon: ShieldCheck,
    title: 'Confidential',
    text: 'Everything you share stays between you and our counselling team.',
  },
  {
    icon: Clock,
    title: 'We respond quickly',
    text: 'A member of our team will contact you to confirm your session.',
  },
  {
    icon: CalendarCheck,
    title: 'Flexible timing',
    text: 'Tell us when suits you and we will do our best to accommodate it.',
  },
];

export default function BookSessionPage() {
  const [searchParams] = useSearchParams();
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_id: '',
    service_type: '',
    preferred_datetime: '',
    message: '',
    disclaimer_accepted: false,
  });

  // Someone arriving from a service page (/book?service=slug) carries that
  // service through as provenance. It is not shown — they pick what they want
  // support with below — but it tells us which page sent them.
  useEffect(() => {
    const slug = searchParams.get('service');
    if (!slug) return;

    const linkService = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id')
          .eq('slug', slug)
          .eq('is_active', true)
          .maybeSingle();

        if (error) throw error;
        if (data) setFormData((prev) => ({ ...prev, service_id: data.id }));
      } catch (err) {
        console.error('Error resolving service from URL:', err);
      }
    };

    linkService();
  }, [searchParams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    try {
      // service_id is a uuid FK — send null rather than an empty string
      const payload = { ...formData, service_id: formData.service_id || null };

      const { error } = await supabase.from('booking_requests').insert([payload]);

      if (error) throw error;

      // Fire notification email — non-blocking
      supabase.functions.invoke('send-notification', {
        body: { type: 'booking', data: payload },
      }).catch(console.error);

      setFormSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service_id: '',
        service_type: '',
        preferred_datetime: '',
        message: '',
        disclaimer_accepted: false,
      });
    } catch (err) {
      console.error('Error submitting booking request:', err);
      setFormError('Failed to submit your booking request. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <PageHeader
        kicker="Book a Session"
        title="Book a counselling session"
        description="Take the first step toward better mental health. Tell us a little about yourself and we'll be in touch to confirm your appointment."
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {assurances.map((item) => (
            <div key={item.title} className="rounded-2xl border border-brand-200 bg-brand-50 p-6">
              <item.icon className="h-6 w-6 text-brand-700" aria-hidden="true" />
              <h2 className="mt-3 font-display text-lg font-semibold text-deep">{item.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="heading-md text-deep">Request your session</h2>
          <p className="mt-3 text-gray-700">
            Fields marked with an asterisk are required.
          </p>

          {formSuccess ? (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-6">
              <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-brand-700" aria-hidden="true" />
              <div>
                <h3 className="font-display text-lg font-semibold text-deep">Booking request received!</h3>
                <p className="mt-1 text-gray-700">
                  Thank you for reaching out. Our team will contact you shortly to
                  confirm your session. If your situation is urgent, please call us
                  directly rather than waiting for a reply.
                </p>
                <button
                  onClick={() => setFormSuccess(false)}
                  className="mt-4 cursor-pointer font-bold text-brand-700 underline transition-colors duration-200 hover:text-brand-600"
                >
                  Book another session
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

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="phone" className={labelClass}>WhatsApp number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    autoComplete="tel"
                    placeholder="e.g. +234 801 234 5678"
                    className={inputClass}
                  />
                  <p className="mt-1.5 text-sm text-gray-600">
                    Include your country code so we can reach you on WhatsApp.
                  </p>
                </div>

                <div>
                  <label htmlFor="service_type" className={labelClass}>
                    What would you like support with? *
                  </label>
                  <select
                    id="service_type"
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleInputChange}
                    required
                    className={inputClass}
                  >
                    <option value="">Please choose…</option>
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="preferred_datetime" className={labelClass}>
                  Preferred date and time *
                </label>
                <input
                  type="text"
                  id="preferred_datetime"
                  name="preferred_datetime"
                  value={formData.preferred_datetime}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Weekday mornings, or Tuesday 15th at 2pm"
                  className={inputClass}
                />
                <p className="mt-1.5 text-sm text-gray-600">
                  Tell us when works for you. We'll confirm the exact time by email or phone.
                </p>
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>
                  Anything you'd like us to know?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Share as much or as little as you're comfortable with."
                  className={inputClass}
                />
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4">
                <input
                  type="checkbox"
                  id="disclaimer_accepted"
                  name="disclaimer_accepted"
                  checked={formData.disclaimer_accepted}
                  onChange={handleInputChange}
                  required
                  className="mt-1 h-5 w-5 flex-shrink-0 rounded border-brand-300 text-brand-700"
                />
                <label htmlFor="disclaimer_accepted" className="text-sm leading-relaxed text-gray-700">
                  I understand that submitting this form is a request for an
                  appointment, not a confirmed booking, and that this service is
                  not an emergency or crisis line. If I am in immediate danger I
                  will contact emergency services. *
                </label>
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
                  'Request this session'
                )}
              </button>
            </form>
          )}
        </section>
      </div>
    </PublicLayout>
  );
}
