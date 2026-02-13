import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import { AlertCircle, Loader2, AlertTriangle } from 'lucide-react';

interface LegalPage {
  id: string;
  page_key: string;
  title: string;
  content: string;
  updated_at: string;
}

export default function DisclaimerPage() {
  const [page, setPage] = useState<LegalPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDisclaimerPage();
  }, []);

  const fetchDisclaimerPage = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_pages')
        .select('*')
        .eq('page_key', 'disclaimer')
        .single();

      if (error) throw error;
      setPage(data);
    } catch (err) {
      console.error('Error fetching disclaimer page:', err);
      setError('Failed to load mental health disclaimer. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  if (error || !page) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-800">{error || 'Mental health disclaimer not found.'}</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-amber-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4">
            {page.title}
          </h1>
          <p className="text-gray-600 text-center">
            Last updated: {formatDate(page.updated_at)}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-amber-900 mb-2">
                Important Notice
              </h2>
              <p className="text-amber-800">
                Please read this disclaimer carefully before using our services. This information is essential for understanding the scope and limitations of the support we provide.
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-lg prose-teal max-w-none">
          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>

      <div className="bg-red-50 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-900 mb-4">
              In Case of Emergency
            </h2>
            <p className="text-red-800 mb-6">
              If you or someone you know is in immediate danger or experiencing a mental health crisis, please seek help immediately.
            </p>
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto shadow-md">
              <p className="font-semibold text-gray-900 mb-2">National Crisis Hotline</p>
              <a href="tel:988" className="text-3xl font-bold text-red-600 hover:text-red-700 block mb-4">
                988
              </a>
              <p className="text-sm text-gray-600">
                Available 24/7 for free and confidential support
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-teal-50 mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Have Questions?
          </h2>
          <p className="text-gray-600 mb-6">
            If you have any concerns or questions about our services, please contact us.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Contact Us
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}