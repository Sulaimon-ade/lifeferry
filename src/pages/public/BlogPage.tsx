import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import ResponsiveImage from '../../components/ResponsiveImage';
import { AlertCircle, Loader2, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_url: string;
  author_name: string;
  tags: string[];
  published_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, cover_url, author_name, tags, published_at')
        .eq('status', 'PUBLISHED')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -380 : 380, behavior: 'smooth' });
  };

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
            Blog
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Insights, stories, and guidance on mental health and well-being.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts available at this time.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-end gap-3 mb-6">
              <button
                onClick={() => scroll('left')}
                className="p-2.5 rounded-full border border-gray-200 bg-white hover:bg-teal-50 hover:border-teal-300 transition-colors shadow-sm"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2.5 rounded-full border border-gray-200 bg-white hover:bg-teal-50 hover:border-teal-300 transition-colors shadow-sm"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex-none w-[300px] md:w-[360px] snap-start"
                >
                  {post.cover_url ? (
                    <div className="overflow-hidden">
                      <ResponsiveImage
                        src={post.cover_url}
                        alt={post.title}
                        aspectRatio="video"
                        containerClassName=""
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-teal-400 to-blue-500" />
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="space-y-1.5 text-sm text-gray-500 mb-4">
                      {post.author_name && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-teal-600 shrink-0" />
                          <span>{post.author_name}</span>
                        </div>
                      )}
                      {post.published_at && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-teal-600 shrink-0" />
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                      )}
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="bg-teal-50 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Informed</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter to receive updates and new blog posts.
          </p>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Subscribe
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
