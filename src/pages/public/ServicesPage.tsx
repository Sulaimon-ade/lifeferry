import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import PageHeader from '../../components/PageHeader';
import { AlertCircle, Loader2, ArrowRight, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  price: string;
  order_num: number;
}

/** Curated local photography — the services table has no image field. */
const serviceImages = [
  '/images/mindfulness-sunrise.jpg',
  '/images/wellness-beach.jpg',
  '/images/women-portrait.jpg',
  '/images/support-circle.jpg',
  '/images/group-laughter.jpg',
  '/images/hero-community.jpg',
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, title, slug, description, duration, price, order_num')
        .eq('is_active', true)
        .order('order_num');

      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
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

  return (
    <PublicLayout>
      <PageHeader
        kicker="What We Offer"
        title="Our services"
        description="Comprehensive mental health services tailored to support your well-being."
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {services.length === 0 ? (
          <p className="py-12 text-center text-gray-500">No services available at this time.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="overflow-hidden">
                  <img
                    src={serviceImages[index % serviceImages.length]}
                    alt=""
                    className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-xl font-semibold leading-snug text-deep transition-colors duration-200 group-hover:text-brand-600">
                    {service.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-relaxed text-gray-600">
                    {service.description}
                  </p>

                  {(service.duration || service.price) && (
                    <div className="mt-4 space-y-1.5">
                      {service.duration && (
                        <p className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                          <Clock className="h-4 w-4 text-brand-600" aria-hidden="true" />
                          {service.duration}
                        </p>
                      )}
                      {service.price && (
                        <p className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                          <Users className="h-4 w-4 text-brand-600" aria-hidden="true" />
                          {service.price}
                        </p>
                      )}
                    </div>
                  )}

                  <span className="mt-5 inline-flex items-center gap-2 font-bold text-brand-700">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <section className="relative overflow-hidden">
        <img
          src="/images/support-circle.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-deep/80" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <h2 className="heading-lg text-white">Ready to get started?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
            Have questions about our services? We're here to help.
          </p>
          <div className="mt-9">
            <Link to="/contact" className="btn-primary">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
