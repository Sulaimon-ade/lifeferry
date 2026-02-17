import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Slide {
  id: number;
  image: string;
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
    image: 'https://i.pinimg.com/1200x/6c/83/09/6c83098252234bf0127c6079dd96838e.jpg',
    title: 'Individual Therapy & Counseling',
    subtitle: 'Your partner through life\'s cruise',
    description: 'Professional one-on-one support tailored to your unique mental health journey',
    primaryCTA: { text: 'Book a Session', link: '/services' },
    secondaryCTA: { text: 'Learn More', link: '/services' },
  },
  {
    id: 2,
    image: 'https://i.pinimg.com/736x/78/28/d0/7828d06c688ff79573acac2747afb0ba.jpg',
    title: 'Women\'s Mental Health Support',
    subtitle: 'Empowering women through every stage',
    description: 'Specialized care for the unique mental health challenges women face',
    primaryCTA: { text: 'Explore Services', link: '/services' },
    secondaryCTA: { text: 'View Programs', link: '/programs' },
  },
  {
    id: 3,
    image: 'https://i.pinimg.com/736x/d1/70/9a/d1709a3f13641000cfdd81ba8d042a83.jpg',
    title: 'Group Therapy & Support',
    subtitle: 'Healing together, growing stronger',
    description: 'Connect with others on similar journeys in a safe, supportive environment',
    primaryCTA: { text: 'Join a Group', link: '/programs' },
    secondaryCTA: { text: 'See Schedule', link: '/programs' },
  },
  {
    id: 4,
    image: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Crisis Intervention',
    subtitle: 'Immediate support when you need it most',
    description: 'Rapid response and stabilization services for mental health emergencies',
    primaryCTA: { text: 'Get Help Now', link: '/services' },
    secondaryCTA: { text: 'Crisis Resources', link: '/resources' },
  },
  {
    id: 5,
    image: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Mental Health Resources',
    subtitle: 'Knowledge is empowerment',
    description: 'Access tools, guides, and educational materials for your wellness journey',
    primaryCTA: { text: 'Explore Resources', link: '/resources' },
    secondaryCTA: { text: 'Read Our Blog', link: '/blog' },
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative h-[600px] lg:h-[700px] overflow-hidden bg-gray-900">
      <div className="absolute inset-0">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>
        ))}
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center h-full max-w-2xl">
          <div
            key={slide.id}
            className="animate-fadeIn"
          >
            <p className="text-teal-300 text-lg font-medium mb-3 italic">
              {slide.subtitle}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {slide.title}
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              {slide.description}
            </p>

            <div className="flex gap-2 sm:gap-4">
              <Link
                to={slide.primaryCTA.link}
                className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-teal-600 text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-teal-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform"
              >
                {slide.primaryCTA.text}
              </Link>
              <Link
                to={slide.secondaryCTA.link}
                className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg text-sm sm:text-base font-semibold hover:bg-white/20 transition-all shadow-xl"
              >
                {slide.secondaryCTA.text}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-12 bg-teal-400'
                : 'w-2 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
