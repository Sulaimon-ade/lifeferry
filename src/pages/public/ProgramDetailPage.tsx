import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import { AlertCircle, Loader2, Calendar, MapPin, ExternalLink, ArrowLeft } from 'lucide-react';

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

export default function ProgramDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [program, setProgram] = useState<ProgramEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchProgram();
    }
  }, [slug]);

  const fetchProgram = async () => {
    try {
      const { data, error } = await supabase
        .from('program_events')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setProgram(data);
    } catch (err) {
      console.error('Error fetching program:', err);
      setError('Program not found or unavailable.');
    } finally {
      setLoading(false);
    }
  };

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

  if (error || !program) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800">{error || 'Program not found.'}</p>
              <Link to="/programs" className="text-red-600 hover:text-red-700 underline mt-2 inline-block">
                Back to Programs
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
            to="/programs"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Programs
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span
              className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                program.status === 'UPCOMING'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {program.status}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {program.title}
          </h1>

          <div className="space-y-3 mb-8">
            <div className="flex items-start text-lg text-gray-700">
              <Calendar className="h-6 w-6 mr-3 text-teal-600 mt-0.5 flex-shrink-0" />
              <span>{formatDate(program.event_datetime)}</span>
            </div>
            {program.location && (
              <div className="flex items-start text-lg text-gray-700">
                <MapPin className="h-6 w-6 mr-3 text-teal-600 mt-0.5 flex-shrink-0" />
                <span>{program.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {program.image_url && (
          <img
            src={program.image_url}
            alt={program.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg mb-12"
          />
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            About This Program
          </h2>
          <div className="prose prose-lg prose-teal max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {program.description}
            </p>
          </div>
        </section>

        {program.link && (
          <section className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              {program.status === 'UPCOMING' ? 'Register Now' : 'Learn More'}
            </h2>
            <p className="text-teal-50 mb-6 max-w-2xl mx-auto">
              {program.status === 'UPCOMING'
                ? 'Reserve your spot for this upcoming program.'
                : 'Find out more about this event and view related content.'}
            </p>
            <a
              href={program.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-white text-teal-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg shadow-lg"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Visit Event Page
            </a>
          </section>
        )}
      </div>

      <div className="bg-teal-50 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Explore More Programs
          </h2>
          <p className="text-gray-600 mb-6">
            Discover other programs and events that might interest you.
          </p>
          <Link
            to="/programs"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            View All Programs
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
