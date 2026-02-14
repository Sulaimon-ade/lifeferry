import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import ResponsiveImage from '../../components/ResponsiveImage';
import { AlertCircle, Loader2 } from 'lucide-react';

interface PageSection {
  id: string;
  section_key: string;
  title: string;
  content: string;
  order_num: number;
  image_url?: string;
  image_position?: string;
}

export default function AboutPage() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAboutSections();
  }, []);

  const fetchAboutSections = async () => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_key', 'about')
        .eq('is_active', true)
        .order('order_num');

      if (error) throw error;
      setSections(data || []);
    } catch (err) {
      console.error('Error fetching about sections:', err);
      setError('Failed to load about content. Please try again later.');
    } finally {
      setLoading(false);
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6">
            About Us
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Learn about our mission, vision, and commitment to mental health support.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {sections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No content available at this time.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {sections.map((section) => {
              const hasImage = section.image_url;
              const imageOnLeft = section.image_position === 'left';

              if (!hasImage) {
                return (
                  <section key={section.id} className="scroll-mt-20 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      {section.title}
                    </h2>
                    <div
                      className="prose prose-lg prose-teal max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </section>
                );
              }

              return (
                <section key={section.id} className="scroll-mt-20">
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center ${
                    imageOnLeft ? 'lg:flex-row-reverse' : ''
                  }`}>
                    <div className={`order-1 ${imageOnLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        {section.title}
                      </h2>
                      <div
                        className="prose prose-lg prose-teal max-w-none text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </div>
                    <div className={`order-2 ${imageOnLeft ? 'lg:order-1' : 'lg:order-2'}`}>
                      <ResponsiveImage
                        src={section.image_url}
                        alt={section.title}
                        containerClassName="w-full h-64 lg:h-96 rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-teal-50 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Want to Learn More?
          </h2>
          <p className="text-gray-600 mb-6">
            Meet our team, explore our services, or get in touch with us.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/team"
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              Meet Our Team
            </a>
            <a
              href="/services"
              className="px-6 py-3 bg-white text-teal-600 border-2 border-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium"
            >
              Our Services
            </a>
            <a
              href="/contact"
              className="px-6 py-3 bg-white text-teal-600 border-2 border-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
