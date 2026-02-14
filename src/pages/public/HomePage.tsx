import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/layouts/PublicLayout';
import HeroCarousel from '../../components/HeroCarousel';
import ResponsiveImage from '../../components/ResponsiveImage';
import { supabase } from '../../lib/supabase';
import { Calendar, BookOpen, ArrowRight, Users, Target, Heart } from 'lucide-react';

interface PageSection {
  title: string;
  content: string;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
}

interface ProgramEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  event_datetime: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_url: string;
  published_at: string;
}

export default function HomePage() {
  const [sections, setSections] = useState<Record<string, PageSection>>({});
  const [services, setServices] = useState<Service[]>([]);
  const [events, setEvents] = useState<ProgramEvent[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [sectionsData, servicesData, eventsData, postsData] = await Promise.all([
        supabase.from('page_sections').select('*').eq('page_key', 'home').eq('is_active', true).order('order_num'),
        supabase.from('services').select('id, title, slug, description').eq('is_active', true).order('order_num').limit(6),
        supabase.from('program_events').select('id, title, slug, description, event_datetime').eq('is_active', true).eq('status', 'UPCOMING').order('event_datetime').limit(3),
        supabase.from('blog_posts').select('id, title, slug, excerpt, cover_url, published_at').eq('status', 'PUBLISHED').order('published_at', { ascending: false }).limit(3),
      ]);

      if (sectionsData.data) {
        const sectionsMap: Record<string, PageSection> = {};
        sectionsData.data.forEach((section) => {
          sectionsMap[section.section_key] = {
            title: section.title,
            content: section.content,
          };
        });
        setSections(sectionsMap);
      }

      if (servicesData.data) setServices(servicesData.data);
      if (eventsData.data) setEvents(eventsData.data);
      if (postsData.data) setPosts(postsData.data);
    } catch (error) {
      console.error('Failed to load content:', error);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus('loading');

    try {
      const { error } = await supabase
        .from('subscribers')
        .insert({ email, consent: true });

      if (error) {
        if (error.code === '23505') {
          setSubscribeStatus('exists');
        } else {
          throw error;
        }
      } else {
        setSubscribeStatus('success');
        setEmail('');
      }
    } catch (error) {
      console.error('Subscription failed:', error);
      setSubscribeStatus('error');
    }

    setTimeout(() => setSubscribeStatus(''), 3000);
  };

  return (
    <PublicLayout>
      <HeroCarousel />

      <section className="section-soft-gradient py-16 md:py-20 lg:py-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl text-center">
      <p className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-black/5">
        Lifeferry Mental Health Initiative
      </p>

      <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
        {sections.mission?.title ?? "Our Mission"}
      </h2>

      <div className="mt-6 mx-auto max-w-4xl rounded-3xl glass-card p-6 md:p-10">
        {sections.mission ? (
          <div
            className="text-lg md:text-xl text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sections.mission.content }}
          />
        ) : (
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Providing accessible, compassionate mental health support to empower individuals on their wellness journey.
          </p>
        )}
      </div>
    </div>

    <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {/* Card 1 */}
      <div className="glass-card rounded-3xl p-6 md:p-8 text-center hover:shadow-lg transition-all duration-300">
        <div className="flex justify-center mb-5">
          <div className="p-4 rounded-2xl bg-white/70 ring-1 ring-black/5">
            <div className="p-3 rounded-full bg-gradient-to-br from-teal-100 to-teal-200">
              <Target className="h-8 w-8 text-teal-700" />
            </div>
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          Compassionate Care
        </h3>
        <p className="text-base text-gray-700 leading-relaxed">
          We approach every individual with empathy, understanding, and respect.
        </p>
      </div>

      {/* Card 2 */}
      <div className="glass-card rounded-3xl p-6 md:p-8 text-center hover:shadow-lg transition-all duration-300">
        <div className="flex justify-center mb-5">
          <div className="p-4 rounded-2xl bg-white/70 ring-1 ring-black/5">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
              <Users className="h-8 w-8 text-blue-700" />
            </div>
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          Accessible Support
        </h3>
        <p className="text-base text-gray-700 leading-relaxed">
          Mental health services should be available and welcoming to everyone.
        </p>
      </div>

      {/* Card 3 */}
      <div className="glass-card rounded-3xl p-6 md:p-8 text-center hover:shadow-lg transition-all duration-300">
        <div className="flex justify-center mb-5">
          <div className="p-4 rounded-2xl bg-white/70 ring-1 ring-black/5">
            <div className="p-3 rounded-full bg-gradient-to-br from-rose-100 to-rose-200">
              <Heart className="h-8 w-8 text-rose-700" />
            </div>
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          Empowerment
        </h3>
        <p className="text-base text-gray-700 leading-relaxed">
          We help people discover their inner strength and resilience.
        </p>
      </div>
    </div>
  </div>
</section>


      {services.length > 0 && (
        <section className="py-24 lg:py-32 bg-gradient-to-b from-white to-teal-50/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">Our Services</h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Comprehensive mental health support tailored to your unique needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {services.map((service) => (
                <Link
                  key={service.id}
                  to={`/services/${service.slug}`}
                  className="bg-white rounded-2xl p-8 lg:p-10 hover:shadow-2xl transition-all duration-300 border border-teal-100/30 hover:border-teal-200 hover:bg-teal-50/30 group"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-teal-600 transition-colors leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6 line-clamp-3 leading-relaxed">{service.description}</p>
                  <span className="text-teal-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                    Learn More <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link
                to="/services"
                className="inline-flex items-center px-10 py-4 bg-teal-600 text-white text-lg rounded-xl font-semibold hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                View All Services <ArrowRight className="h-6 w-6 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {events.length > 0 && (
        <section className="py-24 lg:py-32 bg-gradient-to-b from-blue-50/20 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
              <div className="max-w-3xl">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">Upcoming Programs & Events</h2>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">Join us for workshops, support groups, and community events</p>
              </div>
              <Link
                to="/programs"
                className="hidden md:inline-flex items-center text-teal-600 text-lg font-semibold hover:text-teal-700 hover:gap-3 gap-2 transition-all"
              >
                View All <ArrowRight className="h-6 w-6" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {events.map((event) => (
                <Link
                  key={event.id}
                  to={`/programs/${event.slug}`}
                  className="bg-white rounded-2xl p-8 lg:p-10 hover:shadow-2xl transition-all duration-300 border border-blue-100/50 hover:border-blue-200 hover:bg-blue-50/20 group"
                >
                  <div className="flex items-center gap-3 text-teal-600 mb-6">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <span className="text-base font-semibold">
                      {new Date(event.event_datetime).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-teal-600 transition-colors leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-lg text-gray-600 line-clamp-3 leading-relaxed">{event.description}</p>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12 md:hidden">
              <Link
                to="/programs"
                className="inline-flex items-center text-teal-600 text-lg font-semibold hover:text-teal-700 hover:gap-3 gap-2 transition-all"
              >
                View All Programs <ArrowRight className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="py-24 lg:py-32 bg-gradient-to-b from-white to-rose-50/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
              <div className="max-w-3xl">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">Latest from Our Blog</h2>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">Insights, tips, and stories about mental health</p>
              </div>
              <Link
                to="/blog"
                className="hidden md:inline-flex items-center text-teal-600 text-lg font-semibold hover:text-teal-700 hover:gap-3 gap-2 transition-all"
              >
                View All <ArrowRight className="h-6 w-6" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-rose-100/30 hover:border-rose-200 hover:bg-rose-50/20 group"
                >
                  {post.cover_url && (
                    <div className="overflow-hidden">
                      <ResponsiveImage
                        src={post.cover_url}
                        alt={post.title}
                        aspectRatio="video"
                        containerClassName=""
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-8 lg:p-10">
                    <div className="flex items-center gap-3 text-gray-500 mb-4">
                      <div className="p-1.5 bg-rose-50 rounded-lg">
                        <BookOpen className="h-4 w-4 text-rose-600" />
                      </div>
                      <span className="text-sm font-medium">{new Date(post.published_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-teal-600 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-lg text-gray-600 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12 md:hidden">
              <Link
                to="/blog"
                className="inline-flex items-center text-teal-600 text-lg font-semibold hover:text-teal-700 hover:gap-3 gap-2 transition-all"
              >
                View All Posts <ArrowRight className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-24 lg:py-32 bg-gradient-to-br from-teal-600 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Stay Connected</h2>
            <p className="text-xl md:text-2xl text-teal-50 mb-12 leading-relaxed">
              Subscribe to our newsletter for mental health tips, event updates, and community news
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl text-lg focus:ring-4 focus:ring-white/50 focus:outline-none shadow-lg"
                disabled={subscribeStatus === 'loading'}
              />
              <button
                type="submit"
                disabled={subscribeStatus === 'loading'}
                className="px-10 py-4 bg-white text-teal-600 rounded-xl text-lg font-bold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50"
              >
                {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>

            {subscribeStatus === 'success' && (
              <p className="mt-6 text-white text-lg font-semibold">Thank you for subscribing!</p>
            )}
            {subscribeStatus === 'exists' && (
              <p className="mt-6 text-white text-lg font-semibold">You're already subscribed!</p>
            )}
            {subscribeStatus === 'error' && (
              <p className="mt-6 text-white text-lg font-semibold">Something went wrong. Please try again.</p>
            )}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-gradient-to-b from-teal-50/30 via-blue-50/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">Ready to Start Your Journey?</h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Take the first step towards better mental health. Our compassionate team is here to support you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-10 py-4 bg-teal-600 text-white text-lg rounded-xl font-semibold hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Book a Session
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-teal-600 border-2 border-teal-600 text-lg rounded-xl font-semibold hover:bg-teal-50 transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}