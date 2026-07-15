import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import PageHeader from '../../components/PageHeader';
import ResponsiveImage from '../../components/ResponsiveImage';
import { AlertCircle, Loader2, User, ChevronLeft, ChevronRight } from 'lucide-react';
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
        kicker="Our Blog"
        title="Insights & stories"
        description="Insights, stories, and guidance on mental health and well-being."
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <p className="py-12 text-center text-gray-500">No blog posts available at this time.</p>
        ) : (
          <>
            <div className="mb-6 flex justify-end gap-3">
              <button
                onClick={() => scroll('left')}
                className="cursor-pointer rounded-full border border-brand-200 bg-white p-2.5 transition-colors duration-200 hover:bg-brand-50"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 text-deep" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="cursor-pointer rounded-full border border-brand-200 bg-white p-2.5 transition-colors duration-200 hover:bg-brand-50"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 text-deep" />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group w-[300px] flex-none snap-start overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl md:w-[360px]"
                >
                  {post.cover_url ? (
                    <div className="overflow-hidden">
                      <ResponsiveImage
                        src={post.cover_url}
                        alt={post.title}
                        aspectRatio="video"
                        containerClassName=""
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <img
                      src="/images/mindfulness-sunrise.jpg"
                      alt=""
                      className="aspect-video w-full object-cover"
                      loading="lazy"
                    />
                  )}

                  <div className="p-6">
                    <time
                      dateTime={post.published_at}
                      className="text-sm font-bold uppercase tracking-wide text-accent-600"
                    >
                      {formatDate(post.published_at)}
                    </time>
                    <h3 className="mt-3 line-clamp-2 font-display text-xl font-semibold leading-snug text-deep transition-colors duration-200 group-hover:text-brand-600">
                      {post.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-gray-600">
                      {post.excerpt}
                    </p>

                    {post.author_name && (
                      <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-500">
                        <User className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                        {post.author_name}
                      </p>
                    )}

                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-800"
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

      <section className="bg-sand">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="heading-md text-deep">Stay informed</h2>
          <p className="mt-3 text-gray-600">
            Subscribe to our newsletter to receive updates and new blog posts.
          </p>
          <div className="mt-7">
            <Link to="/contact" className="btn-secondary">
              Subscribe
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
