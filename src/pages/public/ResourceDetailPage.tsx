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
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      </PublicLayout>
    );
  }

  if (error || !resource) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800">{error || 'Resource not found.'}</p>
              <Link to="/resources" className="text-red-600 hover:text-red-700 underline mt-2 inline-block">
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
      <div className="bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/resources"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </Link>

          {resource.category && (
            <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-sm font-semibold rounded mb-4">
              {resource.category}
            </span>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {resource.title}
          </h1>

          <div className="flex items-center text-gray-500 mb-8">
            <Download className="h-5 w-5 mr-2" />
            <span>{resource.download_count} downloads</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {resource.cover_url && (
          <ResponsiveImage
            src={resource.cover_url}
            alt={resource.title}
            containerClassName="w-full h-64 sm:h-80 md:h-96 rounded-lg shadow-lg mb-12"
          />
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            About This Resource
          </h2>
          <div className="prose prose-lg prose-teal max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {resource.description}
            </p>
          </div>
        </section>

        {resource.tags && resource.tags.length > 0 && (
          <section className="mb-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg p-8 text-center text-white">
          <div className="flex justify-center mb-4">
            <FileText className="h-16 w-16 text-white opacity-80" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Download This Resource
          </h2>
          <p className="text-teal-50 mb-6 max-w-2xl mx-auto">
            Access this resource to support your mental health journey.
          </p>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center px-8 py-3 bg-white text-teal-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" />
                Download Now
              </>
            )}
          </button>
        </section>
      </div>

      <div className="bg-teal-50 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Explore More Resources
          </h2>
          <p className="text-gray-600 mb-6">
            Browse our collection of helpful materials and guides.
          </p>
          <Link
            to="/resources"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            View All Resources
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
