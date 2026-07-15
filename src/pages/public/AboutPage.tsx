import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

/**
 * Dignified local defaults used when a section has no image set in the CMS.
 * Replace or override per-section from Admin → Pages (image_url field).
 */
const fallbackImages: Record<string, string> = {
  mission: '/images/group-laughter.jpg',
  vision: '/images/mindfulness-sunrise.jpg',
  values: '/images/support-circle.jpg',
  story: '/images/hero-community.jpg',
};

/**
 * Legacy clip-art URLs still stored in the CMS — treated as unset so the
 * curated defaults above apply. Uploading any other image in Admin → Pages
 * replaces them as usual; this list can be deleted once the CMS entries
 * are updated with real photography.
 */
const legacyClipArt = [
  'https://urrltneoljsonozbvmbn.supabase.co/storage/v1/object/public/media/page-sections/0.4669586799477834.jpg',
  'https://urrltneoljsonozbvmbn.supabase.co/storage/v1/object/public/media/page-sections/0.9682192957582387.jpg',
  'https://i.pinimg.com/1200x/dc/a8/28/dca828d001368f4062386e07c2941db4.jpg',
];

function isUsableImage(url?: string): url is string {
  return Boolean(url) && !legacyClipArt.includes(url!);
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
      {/* Page header */}
      <section className="bg-deep">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:py-24">
          <span className="kicker-light mb-3">About Us</span>
          <h1 className="heading-xl text-white">Walking with you, every step</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-brand-100">
            Learn about our mission, vision, and commitment to mental health support.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {sections.length === 0 ? (
          <p className="py-12 text-center text-gray-500">No content available at this time.</p>
        ) : (
          <div className="space-y-20 lg:space-y-28">
            {sections.map((section, index) => {
              const image = isUsableImage(section.image_url)
                ? section.image_url
                : fallbackImages[section.section_key];
              // Alternate sides by default; explicit CMS position wins.
              const imageOnLeft = section.image_position
                ? section.image_position === 'left'
                : index % 2 === 1;

              if (!image) {
                return (
                  <section key={section.id} className="mx-auto max-w-3xl scroll-mt-24">
                    <h2 className="heading-md text-deep">{section.title}</h2>
                    <div
                      className="prose prose-lg mt-5 max-w-none leading-relaxed text-gray-700"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </section>
                );
              }

              return (
                <section key={section.id} className="scroll-mt-24">
                  <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
                    <div className={imageOnLeft ? 'lg:order-2' : ''}>
                      <span className="kicker mb-3">{String(index + 1).padStart(2, '0')}</span>
                      <h2 className="heading-md text-deep">{section.title}</h2>
                      <div
                        className="prose prose-lg mt-5 max-w-none leading-relaxed text-gray-700"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </div>
                    <div className={imageOnLeft ? 'lg:order-1' : ''}>
                      <ResponsiveImage
                        src={image}
                        alt={section.title}
                        containerClassName="w-full h-72 lg:h-[26rem] rounded-2xl shadow-lg overflow-hidden"
                      />
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* Closing CTA */}
      <section className="relative overflow-hidden">
        <img
          src="/images/support-circle.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-deep/80" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <h2 className="heading-lg text-white">Want to learn more?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
            Meet our team, explore our services, or get in touch with us.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link to="/team" className="btn-primary">
              Meet our team
            </Link>
            <Link to="/services" className="btn-outline text-white hover:bg-white/15">
              Our services
            </Link>
            <Link to="/contact" className="btn-outline text-white hover:bg-white/15">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
