import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import { AlertCircle, Loader2, Image as ImageIcon, Video, X } from 'lucide-react';

interface MediaItem {
  id: string;
  type: 'PHOTO' | 'VIDEO';
  title: string;
  url: string;
  thumbnail_url: string;
  order_num: number;
}

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
            Media Gallery
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Explore photos and videos from our programs, events, and community activities.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'ALL'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-teal-50 border border-gray-300'
            }`}
          >
            All Media
          </button>
          <button
            onClick={() => setFilter('PHOTO')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
              filter === 'PHOTO'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-teal-50 border border-gray-300'
            }`}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Photos
          </button>
          <button
            onClick={() => setFilter('VIDEO')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
              filter === 'VIDEO'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-teal-50 border border-gray-300'
            }`}
          >
            <Video className="h-4 w-4 mr-2" />
            Videos
          </button>
        </div>

        {filteredMedia.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {filter === 'ALL'
                ? 'No media items available at this time.'
                : `No ${filter.toLowerCase()}s available at this time.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMediaClick(item)}
                className="relative group aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-gray-200"
              >
                <img
                  src={item.thumbnail_url || item.url}
                  alt={item.title || 'Media item'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  {item.type === 'VIDEO' && (
                    <div className="absolute top-3 right-3 bg-black bg-opacity-70 rounded-full p-2">
                      <Video className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.type === 'PHOTO' ? (
                      <ImageIcon className="h-12 w-12 text-white" />
                    ) : (
                      <Video className="h-12 w-12 text-white" />
                    )}
                  </div>
                </div>

                {item.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium line-clamp-2">
                      {item.title}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <X className="h-8 w-8" />
          </button>

          <div className="max-w-7xl max-h-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {selectedMedia.type === 'PHOTO' ? (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.title || 'Media item'}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            ) : (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            )}

            {selectedMedia.title && (
              <div className="mt-4 text-center">
                <p className="text-white text-lg font-medium">
                  {selectedMedia.title}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-teal-50 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Join Our Community
          </h2>
          <p className="text-gray-600 mb-6">
            Follow us on social media for more updates and behind-the-scenes content.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
