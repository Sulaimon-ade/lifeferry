import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import ResponsiveImage from '../../components/ResponsiveImage';
import { AlertCircle, Loader2, Calendar, User, ArrowLeft } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_url: string;
  author_name: string;
  tags: string[];
  published_at: string;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'PUBLISHED')
        .single();

      if (error) throw error;
      setPost(data);
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setError('Blog post not found or unavailable.');
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
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      </PublicLayout>
    );
  }

  if (error || !post) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            <div>
              <p className="text-red-800">{error || 'Blog post not found.'}</p>
              <Link to="/blog" className="mt-2 inline-block font-bold text-red-700 underline">
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article>
        <section className="bg-deep">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-20">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-100 transition-colors duration-200 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to blog
            </Link>

            <h1 className="heading-xl mt-6 text-white">{post.title}</h1>

            <div className="mt-6 flex flex-wrap gap-5 text-brand-100">
              {post.author_name && (
                <p className="flex items-center gap-2 font-semibold">
                  <User className="h-4 w-4 text-accent-300" aria-hidden="true" />
                  {post.author_name}
                </p>
              )}
              {post.published_at && (
                <p className="flex items-center gap-2 font-semibold">
                  <Calendar className="h-4 w-4 text-accent-300" aria-hidden="true" />
                  <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                </p>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-brand-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {post.cover_url && (
          <div className="mx-auto -mt-0 max-w-5xl px-4 pt-10 sm:px-6 lg:px-8">
            <ResponsiveImage
              src={post.cover_url}
              alt={post.title}
              containerClassName="w-full h-64 sm:h-80 md:h-[28rem] rounded-2xl shadow-lg"
            />
          </div>
        )}

        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <div
            className="prose prose-lg max-w-none text-gray-700 prose-headings:font-display prose-headings:text-deep prose-a:text-brand-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        <div className="mx-auto max-w-3xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-brand-100 pt-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-bold text-brand-700 transition-colors duration-200 hover:text-brand-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </Link>

            <div className="flex gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition-colors duration-200 hover:bg-brand-50"
              >
                Share on X
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition-colors duration-200 hover:bg-brand-50"
              >
                Share on Facebook
              </a>
            </div>
          </div>
        </div>
      </article>

      <section className="bg-sand">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="heading-md text-deep">Explore more content</h2>
          <p className="mt-3 text-gray-600">
            Read more articles on mental health and well-being.
          </p>
          <div className="mt-7">
            <Link to="/blog" className="btn-secondary">
              View all blog posts
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
