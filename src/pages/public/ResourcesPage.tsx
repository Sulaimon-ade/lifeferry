import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import PageHeader from '../../components/PageHeader';
import ResponsiveImage from '../../components/ResponsiveImage';
import { AlertCircle, Loader2, Search, Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  cover_url: string;
  download_count: number;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('id, title, slug, description, category, tags, cover_url, download_count')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['ALL', ...Array.from(new Set(resources.map((r) => r.category).filter(Boolean)))];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || resource.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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
        kicker="Tools & Guides"
        title="Resources"
        description="Download helpful resources, guides, and materials to support your mental health journey."
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-5">
          <div className="relative mx-auto max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <label htmlFor="resource-search" className="sr-only">Search resources</label>
            <input
              id="resource-search"
              type="text"
              placeholder="Search resources…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-brand-200 bg-white py-3 pl-11 pr-5 text-base"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by category">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                className={`cursor-pointer rounded-full px-5 py-2 text-sm font-bold transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-brand-800 text-white'
                    : 'border border-brand-200 bg-white text-gray-700 hover:bg-brand-50'
                }`}
              >
                {category === 'ALL' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>

        {filteredResources.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            {searchTerm || selectedCategory !== 'ALL'
              ? 'No resources match your criteria.'
              : 'No resources available at this time.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <Link
                key={resource.id}
                to={`/resources/${resource.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
              >
                {resource.cover_url ? (
                  <ResponsiveImage
                    src={resource.cover_url}
                    alt={resource.title}
                    containerClassName="w-full h-48"
                  />
                ) : (
                  <div className="flex h-48 w-full items-center justify-center bg-brand-800">
                    <FileText className="h-14 w-14 text-brand-300" aria-hidden="true" />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-7">
                  {resource.category && (
                    <span className="mb-2 self-start rounded-full bg-brand-50 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-brand-800">
                      {resource.category}
                    </span>
                  )}

                  <h3 className="font-display text-xl font-semibold leading-snug text-deep transition-colors duration-200 group-hover:text-brand-600">
                    {resource.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-relaxed text-gray-600">
                    {resource.description}
                  </p>

                  {resource.tags && resource.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {resource.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="rounded-full bg-sand-dark px-2.5 py-1 text-xs font-bold text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
                      <Download className="h-4 w-4" aria-hidden="true" />
                      {resource.download_count} downloads
                    </p>
                    <span className="font-bold text-brand-700">View details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <section className="bg-sand">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="heading-md text-deep">Need more support?</h2>
          <p className="mt-3 text-gray-600">
            Explore our services or get in touch with our team for personalized help.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link to="/services" className="btn-secondary">
              View services
            </Link>
            <Link to="/contact" className="btn-outline text-brand-800 hover:bg-brand-50">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
