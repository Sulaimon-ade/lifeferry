import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/layouts/PublicLayout';
import HeroCarousel from '../../components/HeroCarousel';
import ResponsiveImage from '../../components/ResponsiveImage';
import { supabase } from '../../lib/supabase';
import { Calendar, ArrowRight, Users, Target, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

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
  image_url?: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_url: string;
  published_at: string;
}

/** Local, curated photography for services (the services table has no image field). */
const serviceImages = [
  '/images/mindfulness-sunrise.jpg',
  '/images/wellness-beach.jpg',
  '/images/women-portrait.jpg',
  '/images/support-circle.jpg',
  '/images/group-laughter.jpg',
  '/images/hero-community.jpg',
];

const pillars = [
  {
    icon: Heart,
    title: 'Compassionate Care',
    text: 'We approach every individual with empathy, understanding, and respect.',
  },
  {
    icon: Users,
    title: 'Accessible Support',
    text: 'Mental health services should be available and welcoming to everyone.',
  },
  {
    icon: Target,
    title: 'Empowerment',
    text: 'We help people discover their inner strength and resilience.',
  },
];

function BlogSlider({ posts }: { posts: BlogPost[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  };

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <span className="kicker mb-3">From Our Blog</span>
            <h2 className="heading-lg text-deep">Insights & stories</h2>
            <p className="mt-3 text-lg text-gray-600">
              Practical guidance and honest conversations about mental health
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
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
            <Link
              to="/blog"
              className="hidden items-center gap-2 font-bold text-brand-700 transition-colors duration-200 hover:text-brand-600 md:inline-flex"
            >
              View all <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
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
              {post.cover_url && (
                <div className="overflow-hidden">
                  <ResponsiveImage
                    src={post.cover_url}
                    alt={post.title}
                    aspectRatio="video"
                    containerClassName=""
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <time
                  dateTime={post.published_at}
                  className="text-sm font-bold uppercase tracking-wide text-accent-600"
                >
                  {new Date(post.published_at).toLocaleDateString('en-NG', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
                <h3 className="mt-3 line-clamp-2 font-display text-xl font-semibold leading-snug text-deep transition-colors duration-200 group-hover:text-brand-600">
                  {post.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-gray-600">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link to="/blog" className="inline-flex items-center gap-2 font-bold text-brand-700">
            View all posts <ArrowRight className="h-5 w-5" />
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

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [sectionsData, servicesData, eventsData, postsData] = await Promise.all([
        supabase.from('page_sections').select('*').eq('page_key', 'home').eq('is_active', true).order('order_num'),
        supabase.from('services').select('id, title, slug, description').eq('is_active', true).order('order_num').limit(6),
        supabase.from('program_events').select('id, title, slug, description, event_datetime, image_url').eq('is_active', true).eq('status', 'UPCOMING').order('event_datetime').limit(3),
        supabase.from('blog_posts').select('id, title, slug, excerpt, cover_url, published_at').eq('status', 'PUBLISHED').order('published_at', { ascending: false }).limit(6),
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

      {/* Mission — photo-anchored */}
      <section className="bg-sand py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <img
              src="/images/group-laughter.jpg"
              alt="Three people laughing together around a table"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <span className="kicker mb-3">Who We Are</span>
            <h2 className="heading-lg text-deep">{sections.mission?.title ?? 'Our Mission'}</h2>
            {sections.mission ? (
              <div
                className="prose prose-lg mt-5 max-w-none leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: sections.mission.content }}
              />
            ) : (
              <p className="mt-5 text-lg leading-relaxed text-gray-700">
                Providing accessible, compassionate mental health support to
                empower individuals on their wellness journey.
              </p>
            )}
            <Link
              to="/about"
              className="mt-7 inline-flex items-center gap-2 font-bold text-brand-700 transition-colors duration-200 hover:text-brand-600"
            >
              Learn more about us <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Pillars */}
        <div className="mx-auto mt-16 grid max-w-7xl gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="border-l-4 border-accent-500 pl-5">
              <pillar.icon className="h-6 w-6 text-brand-700" aria-hidden="true" />
              <h3 className="mt-3 font-display text-xl font-semibold text-deep">{pillar.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{pillar.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services — photo-anchored cards */}
      {services.length > 0 && (
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="kicker mb-3">What We Offer</span>
              <h2 className="heading-lg text-deep">Our services</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                Comprehensive mental health support tailored to your unique needs
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <Link
                  key={service.id}
                  to={`/services/${service.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="overflow-hidden">
                    <img
                      src={serviceImages[index % serviceImages.length]}
                      alt=""
                      className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="font-display text-xl font-semibold leading-snug text-deep transition-colors duration-200 group-hover:text-brand-600">
                      {service.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-relaxed text-gray-600">
                      {service.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 font-bold text-brand-700">
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link to="/services" className="btn-secondary">
                View all services <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming programs & events */}
      {events.length > 0 && (
        <section className="bg-sand py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="kicker mb-3">Join Us</span>
                <h2 className="heading-lg text-deep">Programs & events</h2>
                <p className="mt-3 text-lg text-gray-600">
                  Workshops, support groups, and community gatherings
                </p>
              </div>
              <Link
                to="/programs"
                className="hidden items-center gap-2 font-bold text-brand-700 transition-colors duration-200 hover:text-brand-600 md:inline-flex"
              >
                View all <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {events.map((event) => (
                <Link
                  key={event.id}
                  to={`/programs/${event.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="overflow-hidden">
                    <img
                      src={event.image_url || '/images/wellness-beach.jpg'}
                      alt=""
                      className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-accent-600">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      <time dateTime={event.event_datetime}>
                        {new Date(event.event_datetime).toLocaleDateString('en-NG', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </time>
                    </p>
                    <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-deep transition-colors duration-200 group-hover:text-brand-600">
                      {event.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-gray-600">
                      {event.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center md:hidden">
              <Link to="/programs" className="inline-flex items-center gap-2 font-bold text-brand-700">
                View all programs <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {posts.length > 0 && <BlogSlider posts={posts} />}

      {/* Newsletter */}
      <section className="bg-sand-dark py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="kicker mb-3">Newsletter</span>
          <h2 className="heading-lg text-deep">Stay connected</h2>
          <p className="mt-4 text-lg text-gray-600">
            Mental health tips, event updates, and community news — straight to your inbox.
          </p>

          <form onSubmit={handleSubscribe} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full flex-1 rounded-full border border-brand-200 bg-white px-6 py-3.5 text-base"
              disabled={subscribeStatus === 'loading'}
            />
            <button
              type="submit"
              disabled={subscribeStatus === 'loading'}
              className="btn-primary disabled:cursor-wait disabled:opacity-70"
            >
              {subscribeStatus === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>

          <p role="status" aria-live="polite" className="mt-4 text-sm font-bold text-brand-800">
            {subscribeStatus === 'success' && 'Thank you for subscribing!'}
            {subscribeStatus === 'exists' && "You're already subscribed!"}
            {subscribeStatus === 'error' && 'Something went wrong. Please try again.'}
          </p>
        </div>
      </section>

      {/* Closing CTA — photo band */}
      <section className="relative overflow-hidden">
        <img
          src="/images/hero-community.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-deep/80" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:py-32">
          <span className="kicker-light mb-3">Get Started</span>
          <h2 className="heading-lg text-white">Ready to start your journey?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-brand-100">
            Take the first step towards better mental health. Our compassionate
            team is here to support you.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/services" className="btn-primary">
              Book a session
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
