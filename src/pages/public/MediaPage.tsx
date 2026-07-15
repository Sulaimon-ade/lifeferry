import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import PageHeader from '../../components/PageHeader';
import ResponsiveImage from '../../components/ResponsiveImage';
import { AlertCircle, Loader2, Image as ImageIcon, Video, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MediaItem {
  id: string;
  type: 'PHOTO' | 'VIDEO';
  title: string;
  url: string;
  thumbnail_url: string;
  order_num: number;
}

const FILTERS = [
  { key: 'ALL', label: 'All media', icon: null },
  { key: 'PHOTO', label: 'Photos', icon: ImageIcon },
  { key: 'VIDEO', label: 'Videos', icon: Video },
] as const;

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'PHOTO' | 'VIDEO'>('ALL');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('is_active', true)
        .order('order_num');

      if (error) throw error;
      setMediaItems(data || []);
    } catch (err) {
      console.error('Error fetching media items:', err);
      setError('Failed to load media gallery. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredMedia = mediaItems.filter((item) => {
    if (filter === 'ALL') return true;
    return item.type === filter;
  });

  const handleMediaClick = (item: MediaItem) => {
    setSelectedMedia(item);
  };

  const closeModal = () => {
    setSelectedMedia(null);
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
      <PageHeader
        kicker="Gallery"
        title="Media gallery"
        description="Explore photos and videos from our programs, events, and community activities."
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-wrap justify-center gap-3" role="group" aria-label="Filter media">
          {FILTERS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`flex cursor-pointer items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-colors duration-200 ${
                filter === key
                  ? 'bg-brand-800 text-white'
                  : 'border border-brand-200 bg-white text-gray-700 hover:bg-brand-50'
              }`}
            >
              {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
              {label}
            </button>
          ))}
        </div>

        {filteredMedia.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            {filter === 'ALL'
              ? 'No media items available at this time.'
              : `No ${filter.toLowerCase()}s available at this time.`}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMedia.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMediaClick(item)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-xl"
              >
                <ResponsiveImage
                  src={item.thumbnail_url || item.url}
                  alt={item.title || 'Media item'}
                  aspectRatio="square"
                  className="transition-transform duration-300 group-hover:scale-105"
                />

                {item.type === 'VIDEO' && (
                  <div className="absolute right-3 top-3 rounded-full bg-deep/80 p-2">
                    <Video className="h-4 w-4 text-white" aria-hidden="true" />
                  </div>
                )}

                {item.title && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep/90 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="line-clamp-2 text-sm font-bold text-white">{item.title}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep/95 p-4"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 cursor-pointer rounded-full p-2 text-white transition-colors duration-200 hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-7 w-7" />
          </button>

          <div className="flex max-h-full max-w-7xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {selectedMedia.type === 'PHOTO' ? (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.title || 'Media item'}
                className="max-h-[85vh] max-w-full rounded-2xl object-contain"
              />
            ) : (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className="max-h-[85vh] max-w-full rounded-2xl"
              >
                Your browser does not support the video tag.
              </video>
            )}

            {selectedMedia.title && (
              <p className="mt-4 text-center text-lg font-bold text-white">{selectedMedia.title}</p>
            )}
          </div>
        </div>
      )}

      <section className="bg-sand">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="heading-md text-deep">Join our community</h2>
          <p className="mt-3 text-gray-600">
            Follow us on social media for more updates and behind-the-scenes content.
          </p>
          <div className="mt-7">
            <Link to="/contact" className="btn-secondary">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
