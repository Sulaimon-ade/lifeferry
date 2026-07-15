import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import ResponsiveImage from '../../components/ResponsiveImage';
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
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      </PublicLayout>
    );
  }

  if (error || !program) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            <div>
              <p className="text-red-800">{error || 'Program not found.'}</p>
              <Link to="/programs" className="mt-2 inline-block font-bold text-red-700 underline">
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
      <section className="bg-deep">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-20">
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-100 transition-colors duration-200 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to programs
          </Link>

          <span
            className={`mt-6 inline-block rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${
              program.status === 'UPCOMING'
                ? 'bg-accent-500 text-white'
                : 'bg-white/15 text-brand-100'
            }`}
          >
            {program.status === 'UPCOMING' ? 'Upcoming' : 'Past event'}
          </span>

          <h1 className="heading-xl mt-4 text-white">{program.title}</h1>

          <div className="mt-7 space-y-2.5">
            <p className="flex items-start gap-3 text-lg text-brand-100">
              <Calendar className="mt-1 h-5 w-5 flex-shrink-0 text-accent-300" aria-hidden="true" />
              <time dateTime={program.event_datetime}>{formatDate(program.event_datetime)}</time>
            </p>
            {program.location && (
              <p className="flex items-start gap-3 text-lg text-brand-100">
                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-accent-300" aria-hidden="true" />
                {program.location}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {program.image_url && (
          <ResponsiveImage
            src={program.image_url}
            alt={program.title}
            fit="contain"
            containerClassName="w-full max-h-[34rem] rounded-2xl shadow-lg mb-14 bg-sand-dark"
          />
        )}

        <section className="mb-14">
          <span className="kicker mb-3">About This Program</span>
          <h2 className="heading-md text-deep">What it's about</h2>
          <div className="prose prose-lg mt-5 max-w-none">
            <p className="whitespace-pre-wrap leading-relaxed text-gray-700">{program.description}</p>
          </div>
        </section>

        {program.link && (
          <section className="rounded-2xl bg-deep p-10 text-center">
            <h2 className="heading-md text-white">
              {program.status === 'UPCOMING' ? 'Register now' : 'Learn more'}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-brand-100">
              {program.status === 'UPCOMING'
                ? 'Reserve your spot for this upcoming program.'
                : 'Find out more about this event and view related content.'}
            </p>
            <a
              href={program.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-8"
            >
              <ExternalLink className="h-5 w-5" aria-hidden="true" />
              Visit event page
            </a>
          </section>
        )}
      </div>

      <section className="bg-sand">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="heading-md text-deep">Explore more programs</h2>
          <p className="mt-3 text-gray-600">
            Discover other programs and events that might interest you.
          </p>
          <div className="mt-7">
            <Link to="/programs" className="btn-secondary">
              View all programs
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
