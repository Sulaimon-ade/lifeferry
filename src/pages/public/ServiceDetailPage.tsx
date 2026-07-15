import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import { AlertCircle, Loader2, Clock, Users, CheckCircle, ArrowLeft, Calendar } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  details: string;
  duration: string;
  eligibility: string;
  price: string;
}

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchService();
    }
  }, [slug]);

  const fetchService = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setService(data);
    } catch (err) {
      console.error('Error fetching service:', err);
      setError('Service not found or unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingClick = () => {
    setShowBookingModal(true);
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

  if (error || !service) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            <div>
              <p className="text-red-800">{error || 'Service not found.'}</p>
              <Link to="/services" className="mt-2 inline-block font-bold text-red-700 underline">
                Back to Services
              </Link>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Header */}
      <section className="bg-deep">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-20">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-100 transition-colors duration-200 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to services
          </Link>

          <h1 className="heading-xl mt-6 text-white">{service.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-100">
            {service.description}
          </p>

          {(service.duration || service.price) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {service.duration && (
                <p className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white">
                  <Clock className="h-4 w-4 text-accent-300" aria-hidden="true" />
                  {service.duration}
                </p>
              )}
              {service.price && (
                <p className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white">
                  <Users className="h-4 w-4 text-accent-300" aria-hidden="true" />
                  {service.price}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {service.details && (
          <section className="mb-14">
            <span className="kicker mb-3">About This Service</span>
            <h2 className="heading-md text-deep">What to expect</h2>
            <div className="prose prose-lg mt-5 max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed text-gray-700">{service.details}</p>
            </div>
          </section>
        )}

        {service.eligibility && (
          <section className="mb-14">
            <h2 className="heading-md text-deep">Eligibility</h2>
            <div className="mt-5 rounded-2xl border-l-4 border-brand-600 bg-brand-50 p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-brand-700" aria-hidden="true" />
                <p className="whitespace-pre-wrap leading-relaxed text-gray-700">{service.eligibility}</p>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-2xl bg-deep p-10 text-center">
          <h2 className="heading-md text-white">Ready to book this service?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-brand-100">
            Take the first step toward better mental health. Book a session with us today.
          </p>
          <button onClick={handleBookingClick} className="btn-primary mt-8">
            <Calendar className="h-5 w-5" aria-hidden="true" />
            Book now
          </button>
        </section>
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep/70 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8">
            <h3 className="heading-md text-deep">Book {service.title}</h3>
            <p className="mt-4 text-gray-600">
              To book this service, please contact us directly. Our team will
              help you schedule an appointment.
            </p>
            <div className="mt-7 space-y-3">
              <Link
                to="/contact"
                className="btn-primary w-full"
                onClick={() => setShowBookingModal(false)}
              >
                Go to contact page
              </Link>
              <button
                onClick={() => setShowBookingModal(false)}
                className="btn-outline w-full text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="bg-sand">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="heading-md text-deep">Have questions?</h2>
          <p className="mt-3 text-gray-600">
            Not sure if this service is right for you? Get in touch with us.
          </p>
          <div className="mt-7">
            <Link to="/contact" className="btn-secondary">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
