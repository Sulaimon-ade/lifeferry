import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useSiteSettings } from '../hooks/useSiteSettings';
import PublicLayout from './layouts/PublicLayout';
import { AlertCircle, Loader2, AlertTriangle, HeartHandshake } from 'lucide-react';

interface LegalPageData {
  id: string;
  page_key: string;
  title: string;
  content: string;
  updated_at: string;
}

interface LegalPageProps {
  pageKey: 'privacy' | 'terms' | 'disclaimer';
  kicker: string;
  errorText: string;
  /** Shows the amber "Important Notice" callout and the emergency band. */
  withNotice?: boolean;
}

/** Shared CMS-driven legal page (privacy, terms, disclaimer). */
export default function LegalPage({ pageKey, kicker, errorText, withNotice = false }: LegalPageProps) {
  const { settings } = useSiteSettings();
  const [page, setPage] = useState<LegalPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('legal_pages')
          .select('*')
          .eq('page_key', pageKey)
          .single();

        if (error) throw error;
        if (!cancelled) setPage(data);
      } catch (err) {
        console.error(`Error fetching ${pageKey} page:`, err);
        if (!cancelled) setError(errorText);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pageKey, errorText]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  if (error || !page) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            <p className="text-red-800">{error || errorText}</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <section className="bg-deep">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <span className="kicker-light mb-3">{kicker}</span>
          <h1 className="heading-xl text-white">{page.title}</h1>
          <p className="mt-4 text-brand-100">Last updated: {formatDate(page.updated_at)}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        {withNotice && (
          <div className="mb-10 rounded-2xl border-l-4 border-accent-500 bg-accent-100 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-accent-700" aria-hidden="true" />
              <div>
                <h2 className="font-display text-lg font-semibold text-deep">Important notice</h2>
                <p className="mt-1 leading-relaxed text-gray-700">
                  Please read this disclaimer carefully before using our
                  services. This information is essential for understanding the
                  scope and limitations of the support we provide.
                </p>
              </div>
            </div>
          </div>
        )}

        <div
          className="prose prose-lg max-w-none text-gray-700 prose-headings:font-display prose-headings:text-deep prose-a:text-brand-700"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>

      {withNotice && (
        <section className="bg-sand">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
            <HeartHandshake className="mx-auto h-10 w-10 text-accent-600" aria-hidden="true" />
            <h2 className="heading-md mt-4 text-deep">In case of emergency</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              If you or someone you know is in immediate danger or experiencing
              a mental health crisis, please contact your local emergency
              services or a crisis helpline right away.
            </p>
            {settings.contact_phone && (
              <div className="mx-auto mt-7 max-w-md rounded-2xl bg-white p-6 shadow-md">
                <p className="text-sm font-extrabold uppercase tracking-wide text-deep">Lifeferry helpline</p>
                <a
                  href={`tel:${settings.contact_phone.replace(/[^+\d]/g, '')}`}
                  className="mt-1 inline-block font-display text-3xl font-semibold text-brand-700 transition-colors duration-200 hover:text-brand-600"
                >
                  {settings.contact_phone}
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      <section className={withNotice ? 'bg-white' : 'bg-sand'}>
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="heading-md text-deep">Have questions?</h2>
          <p className="mt-3 text-gray-600">
            If you have any concerns or questions, please don't hesitate to contact us.
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
