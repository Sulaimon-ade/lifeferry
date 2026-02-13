import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/layouts/PublicLayout';
import HeroCarousel from '../../components/HeroCarousel';
import { supabase } from '../../lib/supabase';
import { Calendar, BookOpen, ArrowRight, Users, Target, Lightbulb } from 'lucide-react';

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

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {sections.mission ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{sections.mission.title}</h2>
                <div
                  className="text-lg text-gray-600 max-w-3xl mx-auto"
                  dangerouslySetInnerHTML={{ __html: sections.mission.content }}
                />
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Providing accessible, compassionate mental health support to empower individuals on their wellness journey.
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-teal-100 rounded-full">
                  <Target className="h-8 w-8 text-teal-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Compassionate Care</h3>
              <p className="text-gray-600">
                We approach every individual with empathy, understanding, and respect.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Accessible Support</h3>
              <p className="text-gray-600">
                Mental health services should be available and welcoming to everyone.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Lightbulb className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Empowerment</h3>
              <p className="text-gray-600">
                We help people discover their inner strength and resilience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {services.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Comprehensive mental health support tailored to your unique needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link
                  key={service.id}
                  to={`/services/${service.slug}`}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-200 group"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
                  <span className="text-teal-600 font-medium flex items-center group-hover:gap-2 transition-all">
                    Learn More <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/services"
                className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                View All Services <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {events.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Programs & Events</h2>
                <p className="text-lg text-gray-600">Join us for workshops, support groups, and community events</p>
              </div>
              <Link
                to="/programs"
                className="hidden md:flex items-center text-teal-600 font-semibold hover:text-teal-700"
              >
                View All <ArrowRight className="h-5 w-5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link
                  key={event.id}
                  to={`/programs/${event.slug}`}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all border border-gray-200 group"
                >
                  <div className="flex items-center space-x-2 text-teal-600 mb-3">
                    <Calendar className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      {new Date(event.event_datetime).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3">{event.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest from Our Blog</h2>
                <p className="text-lg text-gray-600">Insights, tips, and stories about mental health</p>
              </div>
              <Link
                to="/blog"
                className="hidden md:flex items-center text-teal-600 font-semibold hover:text-teal-700"
              >
                View All <ArrowRight className="h-5 w-5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-200 group"
                >
                  {post.cover_url && (
                    <div className="aspect-video bg-gray-200 overflow-hidden">
                      <img
                        src={post.cover_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-gray-500 text-sm mb-3">
                      <BookOpen className="h-4 w-4" />
                      <span>{new Date(post.published_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Connected</h2>
            <p className="text-teal-100 mb-8">
              Subscribe to our newsletter for mental health tips, event updates, and community news
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
                disabled={subscribeStatus === 'loading'}
              />
              <button
                type="submit"
                disabled={subscribeStatus === 'loading'}
                className="px-8 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>

            {subscribeStatus === 'success' && (
              <p className="mt-4 text-white font-medium">Thank you for subscribing!</p>
            )}
            {subscribeStatus === 'exists' && (
              <p className="mt-4 text-white font-medium">You're already subscribed!</p>
            )}
            {subscribeStatus === 'error' && (
              <p className="mt-4 text-white font-medium">Something went wrong. Please try again.</p>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Start Your Journey?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Take the first step towards better mental health. Our compassionate team is here to support you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/services"
              className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Book a Session
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 bg-white text-teal-600 border-2 border-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
