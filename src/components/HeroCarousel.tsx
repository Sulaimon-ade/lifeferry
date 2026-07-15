import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Slide {
  id: number;
  image: string;
  imagePosition?: string;
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: {
    text: string;
    link: string;
  };
  secondaryCTA: {
    text: string;
    link: string;
  };
}

const slides: Slide[] = [
  {
    id: 1,
    image: '/images/support-circle.jpg',
    title: 'Individual Therapy & Counseling',
    subtitle: "Your partner through life's cruise",
    description: 'Professional one-on-one support tailored to your unique mental health journey',
    primaryCTA: { text: 'Book a Session', link: '/services' },
    secondaryCTA: { text: 'Learn More', link: '/services' },
  },
  {
    id: 2,
    image: '/images/women-portrait.jpg',
    imagePosition: 'center 25%',
    title: "Women's Mental Health Support",
    subtitle: 'Empowering women through every stage',
    description: 'Specialized care for the unique mental health challenges women face',
    primaryCTA: { text: 'Explore Services', link: '/services' },
    secondaryCTA: { text: 'View Programs', link: '/programs' },
  },
  {
    id: 3,
    image: '/images/hero-community.jpg',
    title: 'Group Therapy & Support',
    subtitle: 'Healing together, growing stronger',
    description: 'Connect with others on similar journeys in a safe, supportive environment',
    primaryCTA: { text: 'Join a Group', link: '/programs' },
    secondaryCTA: { text: 'See Schedule', link: '/programs' },
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative flex min-h-[560px] items-center overflow-hidden bg-deep lg:min-h-[78vh]">
      <div className="absolute inset-0">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={index !== currentSlide}
          >
            <img
              src={s.image}
              alt=""
              className="h-full w-full object-cover"
              style={s.imagePosition ? { objectPosition: s.imagePosition } : undefined}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-deep/95 via-deep/60 to-deep/20" />
          </div>
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-2xl" key={slide.id}>
          <p className="kicker-light animate-fadeIn mb-4">{slide.subtitle}</p>
          <h1 className="heading-xl animate-fadeIn-d1 text-white">{slide.title}</h1>
          <p className="animate-fadeIn-d2 mt-6 max-w-xl text-lg leading-relaxed text-brand-100 sm:text-xl">
            {slide.description}
          </p>
          <div className="animate-fadeIn-d3 mt-9 flex flex-wrap gap-4">
            <Link to={slide.primaryCTA.link} className="btn-primary">
              {slide.primaryCTA.text}
            </Link>
            <Link to={slide.secondaryCTA.link} className="btn-outline text-white hover:bg-white/15">
              {slide.secondaryCTA.text}
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3" role="tablist" aria-label="Hero slides">
        {slides.map((s, index) => (
          <button
            key={s.id}
            onClick={() => goToSlide(index)}
            role="tab"
            aria-selected={index === currentSlide}
            className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-10 bg-accent-500' : 'w-2.5 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}: ${s.title}`}
          />
        ))}
      </div>
    </section>
  );
}
