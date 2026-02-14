import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
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
            Resources
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Download helpful resources, guides, and materials to support your mental health journey.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-teal-50 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'ALL'
                ? 'No resources match your criteria.'
                : 'No resources available at this time.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource) => (
              <Link
                key={resource.id}
                to={`/resources/${resource.slug}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {resource.cover_url ? (
                  <ResponsiveImage
                    src={resource.cover_url}
                    alt={resource.title}
                    containerClassName="w-full h-48 rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center rounded-t-lg">
                    <FileText className="h-16 w-16 text-white opacity-50" />
                  </div>
                )}

                <div className="p-6">
                  {resource.category && (
                    <span className="inline-block px-2 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded mb-2">
                      {resource.category}
                    </span>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {resource.title}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {resource.description}
                  </p>

                  {resource.tags && resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Download className="h-4 w-4 mr-1" />
                      <span>{resource.download_count} downloads</span>
                    </div>
                    <span className="text-teal-600 font-medium group-hover:underline">
                      View Details
                    </span>
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
            Need More Support?
          </h2>
          <p className="text-gray-600 mb-6">
            Explore our services or get in touch with our team for personalized help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/services"
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              View Services
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 bg-white text-teal-600 border-2 border-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
