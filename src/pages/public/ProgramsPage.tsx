import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import { AlertCircle, Loader2, Calendar, MapPin, ExternalLink } from 'lucide-react';
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

  return (
    <PublicLayout>
      <div className="bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6">
            Programs & Events
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Join our community programs and events designed to support mental health and well-being.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'ALL'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-teal-50 border border-gray-300'
            }`}
          >
            All Programs
          </button>
          <button
            onClick={() => setFilter('UPCOMING')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'UPCOMING'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-teal-50 border border-gray-300'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('PAST')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'PAST'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-teal-50 border border-gray-300'
            }`}
          >
            Past Events
          </button>
        </div>

        {filteredPrograms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {filter === 'ALL'
                ? 'No programs or events available at this time.'
                : `No ${filter.toLowerCase()} programs or events available.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <Link
                key={program.id}
                to={`/programs/${program.slug}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {program.image_url ? (
                  <img
                    src={program.image_url}
                    alt={program.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                    <Calendar className="h-16 w-16 text-white opacity-50" />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        program.status === 'UPCOMING'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {program.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {program.title}
                  </h3>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-start text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>{formatDate(program.event_datetime)}</span>
                    </div>
                    {program.location && (
                      <div className="flex items-start text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span>{program.location}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {program.description}
                  </p>

                  <div className="flex items-center text-teal-600 font-medium">
                    <span>View Details</span>
                    <ExternalLink className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="bg-teal-50 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-6">
            Don't miss out on our upcoming programs and events. Subscribe to our newsletter.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
