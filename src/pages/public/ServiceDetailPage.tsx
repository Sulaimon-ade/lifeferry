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
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      </PublicLayout>
    );
  }

  if (error || !service) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800">{error || 'Service not found.'}</p>
              <Link to="/services" className="text-red-600 hover:text-red-700 underline mt-2 inline-block">
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
      <div className="bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/services"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {service.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {service.description}
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            {service.duration && (
              <div className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm">
                <Clock className="h-5 w-5 text-teal-600 mr-2" />
                <span className="text-gray-700">{service.duration}</span>
              </div>
            )}
            {service.price && (
              <div className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm">
                <Users className="h-5 w-5 text-teal-600 mr-2" />
                <span className="text-gray-700">{service.price}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {service.details && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About This Service
            </h2>
            <div className="prose prose-lg prose-teal max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {service.details}
              </p>
            </div>
          </section>
        )}

        {service.eligibility && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Eligibility
            </h2>
            <div className="bg-teal-50 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-teal-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 whitespace-pre-wrap">
                  {service.eligibility}
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Book This Service?
          </h2>
          <p className="text-teal-50 mb-6 max-w-2xl mx-auto">
            Take the first step toward better mental health. Book a session with us today.
          </p>
          <button
            onClick={handleBookingClick}
            className="inline-flex items-center px-8 py-3 bg-white text-teal-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg shadow-lg"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Book Now
          </button>
        </section>
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Book {service.title}
            </h3>
            <p className="text-gray-600 mb-6">
              To book this service, please contact us directly. Our team will help you schedule an appointment.
            </p>
            <div className="space-y-3">
              <Link
                to="/contact"
                className="block w-full px-4 py-3 bg-teal-600 text-white text-center rounded-lg hover:bg-teal-700 transition-colors font-medium"
                onClick={() => setShowBookingModal(false)}
              >
                Go to Contact Page
              </Link>
              <button
                onClick={() => setShowBookingModal(false)}
                className="block w-full px-4 py-3 bg-gray-100 text-gray-700 text-center rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-teal-50 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Have Questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Not sure if this service is right for you? Get in touch with us.
          </p>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
