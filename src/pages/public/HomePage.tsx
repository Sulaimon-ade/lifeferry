import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/layouts/PublicLayout';
import HeroCarousel from '../../components/HeroCarousel';
import ResponsiveImage from '../../components/ResponsiveImage';
import { supabase } from '../../lib/supabase';
import { Calendar, BookOpen, ArrowRight, Users, Target, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

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

function BlogSlider({ posts }: { posts: BlogPost[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref: headingRef, inView: headingInView } = useInView();

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  };

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-white to-rose-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headingRef} className="flex items-end justify-between mb-12 gap-6">
          <div className={`transition-all duration-700 ${headingInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-block text-xs font-semibold tracking-widest text-rose-600 uppercase mb-3 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">From Our Blog</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">Latest from Our Blog</h2>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">Insights, tips, and stories about mental health</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
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
            <Link
              to="/blog"
              className="hidden md:inline-flex items-center gap-2 text-teal-600 text-base font-semibold hover:gap-3 transition-all"
            >
              View All <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
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
              className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-rose-100/30 hover:border-rose-200 group flex-none w-[300px] md:w-[360px] snap-start"
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
              <div className="p-6">
                <div className="flex items-center gap-2 text-gray-500 mb-3">
                  <div className="p-1.5 bg-rose-50 rounded-lg">
                    <BookOpen className="h-4 w-4 text-rose-600" />
                  </div>
                  <span className="text-sm font-medium">{new Date(post.published_at).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors leading-tight line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-base text-gray-600 line-clamp-3 leading-relaxed">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link to="/blog" className="inline-flex items-center gap-2 text-teal-600 text-lg font-semibold">
            View All Posts <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [sections, setSections] = useState<Record<string, PageSection>>({});
  const [services, setServices] = useState<Service[]>([]);
  const [events, setEvents] = useState<ProgramEvent[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('');

  const { ref: missionRef, inView: missionInView } = useInView();
  const { ref: servicesRef, inView: servicesInView } = useInView();
  const { ref: eventsRef, inView: eventsInView } = useInView();
  const { ref: newsletterRef, inView: newsletterInView } = useInView();
  const { ref: ctaRef, inView: ctaInView } = useInView();

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
        // Fire notification email — non-blocking
        supabase.functions.invoke('send-notification', {
          body: { type: 'newsletter', data: { email } },
        }).catch(console.error);

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
  <div ref={missionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl text-center">
      <span className={`inline-block text-xs font-semibold tracking-widest text-teal-600 uppercase mb-3 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 transition-all duration-700 ${missionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Who We Are</span>
      <h2 className={`mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight transition-all duration-700 delay-75 ${missionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {sections.mission?.title ?? "Our Mission"}
      </h2>

      <div className={`mt-6 mx-auto max-w-4xl rounded-3xl glass-card p-6 md:p-10 transition-all duration-700 delay-100 ${missionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
      <div
        className={`glass-card rounded-3xl p-6 md:p-8 text-center hover:shadow-lg transition-all duration-700 ${missionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ transitionDelay: missionInView ? '200ms' : '0ms' }}
      >
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
      <div
        className={`glass-card rounded-3xl p-6 md:p-8 text-center hover:shadow-lg transition-all duration-700 ${missionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ transitionDelay: missionInView ? '340ms' : '0ms' }}
      >
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
      <div
        className={`glass-card rounded-3xl p-6 md:p-8 text-center hover:shadow-lg transition-all duration-700 ${missionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ transitionDelay: missionInView ? '480ms' : '0ms' }}
      >
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
          <div ref={servicesRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center mb-12 transition-all duration-700 ${servicesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-block text-xs font-semibold tracking-widest text-teal-600 uppercase mb-3 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">What We Offer</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">Our Services</h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Comprehensive mental health support tailored to your unique needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {services.map((service, index) => (
                <Link
                  key={service.id}
                  to={`/services/${service.slug}`}
                  className={`bg-white rounded-2xl p-8 lg:p-10 hover:shadow-2xl transition-all duration-700 border border-teal-100/30 hover:border-teal-200 hover:bg-teal-50/30 group ${servicesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: servicesInView ? `${index * 100 + 150}ms` : '0ms' }}
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

            <div className="text-center mt-10">
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
          <div ref={eventsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6 transition-all duration-700 ${eventsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="max-w-3xl">
                <span className="inline-block text-xs font-semibold tracking-widest text-teal-600 uppercase mb-3 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Join Us</span>
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
              {events.map((event, index) => (
                <Link
                  key={event.id}
                  to={`/programs/${event.slug}`}
                  className={`bg-white rounded-2xl p-8 lg:p-10 hover:shadow-2xl transition-all duration-700 border border-blue-100/50 hover:border-blue-200 hover:bg-blue-50/20 group ${eventsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: eventsInView ? `${index * 120 + 150}ms` : '0ms' }}
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
        <BlogSlider posts={posts} />
      )}

      <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 45%, #1d4ed8 100%)' }}>
        {/* decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-teal-300/10 rounded-full blur-2xl pointer-events-none" />

        <div ref={newsletterRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className={`text-center transition-all duration-700 ${newsletterInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-block text-xs font-semibold tracking-widest text-white/80 uppercase mb-3 bg-white/10 px-3 py-1 rounded-full border border-white/20">Newsletter</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Stay Connected</h2>
            <p className="text-xl md:text-2xl text-teal-50/90 mb-12 leading-relaxed">
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
                className="px-10 py-4 bg-white text-teal-700 rounded-xl text-lg font-bold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50"
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
        <div ref={ctaRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className={`inline-block text-xs font-semibold tracking-widest text-teal-600 uppercase mb-3 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 transition-all duration-700 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Get Started</span>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight transition-all duration-700 delay-75 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>Ready to Start Your Journey?</h2>
          <p className={`text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-100 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Take the first step towards better mental health. Our compassionate team is here to support you.
          </p>
          <div className={`flex flex-col sm:flex-row justify-center gap-6 transition-all duration-700 delay-200 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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