import { useState, FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import PublicLayout from '../../components/layouts/PublicLayout';
import PageHeader from '../../components/PageHeader';
import { AlertCircle, Loader2, Mail, Phone, MapPin, CheckCircle, HeartHandshake } from 'lucide-react';

const inputClass =
  'w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-base text-gray-800 placeholder:text-gray-400';

const labelClass = 'mb-1.5 block text-sm font-bold text-deep';

export default function ContactPage() {
  const { settings } = useSiteSettings();
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

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
        .from('contact_messages')
        .insert([formData]);

      if (error) throw error;

      // Fire notification email — non-blocking
      supabase.functions.invoke('send-notification', {
        body: { type: 'contact', data: formData },
      }).catch(console.error);

      setFormSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setFormError('Failed to send message. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const contactCards = [
    { icon: Mail, label: 'Email', value: settings.contact_email || 'info@lifeferry.org' },
    { icon: Phone, label: 'Phone', value: settings.contact_phone || '' },
    { icon: MapPin, label: 'Location', value: settings.contact_address || '' },
  ].filter((card) => card.value);

  return (
    <PublicLayout>
      <PageHeader
        kicker="Get in Touch"
        title="We're here to help"
        description="Reach out to us with any questions or concerns — we'll respond as soon as we can."
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {contactCards.length > 0 && (
          <div className="mb-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {contactCards.map((card) => (
              <div key={card.label} className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-md">
                <div className="flex-shrink-0 rounded-full bg-brand-50 p-3">
                  <card.icon className="h-5 w-5 text-brand-700" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wide text-deep">{card.label}</h3>
                  <p className="mt-1 break-words text-gray-600">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-md sm:p-10">
          <h2 className="heading-md text-deep">Send us a message</h2>

          {formSuccess ? (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-6">
              <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-brand-700" aria-hidden="true" />
              <div>
                <h3 className="font-display text-lg font-semibold text-deep">Message sent!</h3>
                <p className="mt-1 text-gray-700">
                  Thank you for reaching out to us. We'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setFormSuccess(false)}
                  className="mt-4 cursor-pointer font-bold text-brand-700 underline transition-colors duration-200 hover:text-brand-600"
                >
                  Send another message
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
                  <label htmlFor="phone" className={labelClass}>Phone number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    autoComplete="tel"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className={labelClass}>Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Service Information">Service Information</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Support">Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className={inputClass}
                  placeholder="Tell us how we can help…"
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
                    Sending…
                  </>
                ) : (
                  'Send message'
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <section className="bg-sand">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <HeartHandshake className="mx-auto h-10 w-10 text-accent-600" aria-hidden="true" />
          <h2 className="heading-md mt-4 text-deep">Need immediate support?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            If you're in crisis or need immediate assistance, please contact
            your local emergency services or a crisis helpline right away.
            {settings.contact_phone && (
              <>
                {' '}You can also call us directly during working hours.
              </>
            )}
          </p>
          {settings.contact_phone && (
            <div className="mx-auto mt-7 max-w-md rounded-2xl bg-white p-6 shadow-md">
              <p className="text-sm font-extrabold uppercase tracking-wide text-deep">Lifeferry helpline</p>
              <a
                href={`tel:${settings.contact_phone.replace(/[^+\d]/g, '')}`}
                className="mt-1 inline-block font-display text-3xl font-semibold text-brand-700 transition-colors duration-200 hover:text-brand-600"
              >
                {settings.contact_phone}
              </a>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
