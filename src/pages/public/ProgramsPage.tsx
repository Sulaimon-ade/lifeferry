import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import PageHeader from '../../components/PageHeader';
import { AlertCircle, Loader2, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProgramEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  event_datetime: string;
  location: string;
  link: string;
  image_url: string;
  status: 'UPCOMING' | 'PAST';
}

const FILTERS = [
  { key: 'ALL', label: 'All programs' },
  { key: 'UPCOMING', label: 'Upcoming' },
  { key: 'PAST', label: 'Past events' },
] as const;

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<ProgramEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'PAST'>('ALL');

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('program_events')
        .select('*')
        .eq('is_active', true)
        .order('event_datetime', { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError('Failed to load programs and events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPrograms = programs.filter((program) => {
    if (filter === 'ALL') return true;
    return program.status === filter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
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
        kicker="Join Us"
        title="Programs & events"
        description="Join our community programs and events designed to support mental health and well-being."
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div
          className="mb-12 flex flex-wrap justify-center gap-3"
          role="group"
          aria-label="Filter programs"
        >
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`cursor-pointer rounded-full px-6 py-2.5 text-sm font-bold transition-colors duration-200 ${
                filter === key
                  ? 'bg-brand-800 text-white'
                  : 'border border-brand-200 bg-white text-gray-700 hover:bg-brand-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filteredPrograms.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            {filter === 'ALL'
              ? 'No programs or events available at this time.'
              : `No ${filter.toLowerCase()} programs or events available.`}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrograms.map((program) => (
              <Link
                key={program.id}
                to={`/programs/${program.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={program.image_url || '/images/wellness-beach.jpg'}
                    alt=""
                    className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span
                    className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${
                      program.status === 'UPCOMING'
                        ? 'bg-accent-500 text-white'
                        : 'bg-white/90 text-gray-600'
                    }`}
                  >
                    {program.status === 'UPCOMING' ? 'Upcoming' : 'Past'}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-xl font-semibold leading-snug text-deep transition-colors duration-200 group-hover:text-brand-600">
                    {program.title}
                  </h3>

                  <div className="mt-3 space-y-1.5">
                    <p className="flex items-start gap-2 text-sm font-semibold text-gray-600">
                      <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600" aria-hidden="true" />
                      <time dateTime={program.event_datetime}>{formatDate(program.event_datetime)}</time>
                    </p>
                    {program.location && (
                      <p className="flex items-start gap-2 text-sm font-semibold text-gray-600">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600" aria-hidden="true" />
                        {program.location}
                      </p>
                    )}
                  </div>

                  <p className="mt-3 line-clamp-2 flex-1 text-[15px] leading-relaxed text-gray-600">
                    {program.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 font-bold text-brand-700">
                    View details
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <section className="bg-sand">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="heading-md text-deep">Stay updated</h2>
          <p className="mt-3 text-gray-600">
            Don't miss out on our upcoming programs and events. Subscribe to our newsletter.
          </p>
          <div className="mt-7">
            <Link to="/contact" className="btn-secondary">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
