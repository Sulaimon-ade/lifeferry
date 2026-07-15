import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import ResponsiveImage from '../../components/ResponsiveImage';
import { AlertCircle, Loader2, Download, ArrowLeft, FileText } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  file_url: string;
  cover_url: string;
  download_count: number;
}

export default function ResourceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchResource();
    }
  }, [slug]);

  const fetchResource = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setResource(data);
    } catch (err) {
      console.error('Error fetching resource:', err);
      setError('Resource not found or unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!resource) return;

    setDownloading(true);

    try {
      // Increment download count
      const { error } = await supabase
        .from('resources')
        .update({ download_count: resource.download_count + 1 })
        .eq('id', resource.id);

      if (error) throw error;

      // Update local state
      setResource({ ...resource, download_count: resource.download_count + 1 });

      // Open file in new tab
      window.open(resource.file_url, '_blank');
    } catch (err) {
      console.error('Error updating download count:', err);
      // Still allow download even if count update fails
      window.open(resource.file_url, '_blank');
    } finally {
      setDownloading(false);
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

  if (error || !resource) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            <div>
              <p className="text-red-800">{error || 'Resource not found.'}</p>
              <Link to="/resources" className="mt-2 inline-block font-bold text-red-700 underline">
                Back to Resources
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
            to="/resources"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-100 transition-colors duration-200 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to resources
          </Link>

          {resource.category && (
            <span className="mt-6 inline-block rounded-full bg-accent-500 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
              {resource.category}
            </span>
          )}

          <h1 className="heading-xl mt-4 text-white">{resource.title}</h1>

          <p className="mt-6 flex items-center gap-2 font-semibold text-brand-100">
            <Download className="h-4 w-4 text-accent-300" aria-hidden="true" />
            {resource.download_count} downloads
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {resource.cover_url && (
          <ResponsiveImage
            src={resource.cover_url}
            alt={resource.title}
            fit="contain"
            containerClassName="w-full max-h-[34rem] rounded-2xl shadow-lg mb-14 bg-sand-dark"
          />
        )}

        <section className="mb-14">
          <span className="kicker mb-3">About This Resource</span>
          <h2 className="heading-md text-deep">What's inside</h2>
          <div className="prose prose-lg mt-5 max-w-none">
            <p className="whitespace-pre-wrap leading-relaxed text-gray-700">{resource.description}</p>
          </div>
        </section>

        {resource.tags && resource.tags.length > 0 && (
          <section className="mb-14">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-500">Tags</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {resource.tags.map((tag, index) => (
                <span key={index} className="rounded-full bg-sand-dark px-3 py-1 text-sm font-bold text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl bg-deep p-10 text-center">
          <FileText className="mx-auto h-14 w-14 text-accent-300" aria-hidden="true" />
          <h2 className="heading-md mt-4 text-white">Download this resource</h2>
          <p className="mx-auto mt-4 max-w-2xl text-brand-100">
            Access this resource to support your mental health journey.
          </p>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn-primary mt-8 disabled:cursor-wait disabled:opacity-60"
          >
            {downloading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Downloading…
              </>
            ) : (
              <>
                <Download className="h-5 w-5" aria-hidden="true" />
                Download now
              </>
            )}
          </button>
        </section>
      </div>

      <section className="bg-sand">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="heading-md text-deep">Explore more resources</h2>
          <p className="mt-3 text-gray-600">
            Browse our collection of helpful materials and guides.
          </p>
          <div className="mt-7">
            <Link to="/resources" className="btn-secondary">
              View all resources
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
