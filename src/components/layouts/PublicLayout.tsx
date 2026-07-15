import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Youtube, Linkedin, ChevronDown, HeartHandshake } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

interface DropdownItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href?: string;
  children?: DropdownItem[];
}

const navigation: NavItem[] = [
  { name: 'Home', href: '/' },
  {
    name: 'About',
    children: [
      { name: 'About Us', href: '/about' },
      { name: 'Services', href: '/services' },
      { name: 'Our Team', href: '/team' },
      { name: 'Partner With Us', href: '/partner' },
      { name: 'Contact', href: '/contact' },
    ],
  },
  { name: 'Blog', href: '/blog' },
  {
    name: 'Resources',
    children: [
      { name: 'Resources & Guides', href: '/resources' },
      { name: 'Programs & Events', href: '/programs' },
      { name: 'Media', href: '/media' },
    ],
  },
];

function DropdownMenu({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const location = useLocation();

  return (
    <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-2xl border border-brand-100 bg-white py-2 shadow-xl">
      {item.children!.map((child) => (
        <Link
          key={child.href}
          to={child.href}
          onClick={onClose}
          className={`block px-5 py-2.5 text-sm font-semibold transition-colors duration-200 ${
            location.pathname === child.href
              ? 'bg-brand-50 text-brand-700'
              : 'text-gray-700 hover:bg-brand-50 hover:text-brand-700'
          }`}
        >
          {child.name}
        </Link>
      ))}
    </div>
  );
}

function NavItemDesktop({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isActive =
    item.href === location.pathname ||
    item.children?.some((c) => c.href === location.pathname);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const baseClass =
    'px-3.5 py-2 text-[15px] font-bold rounded-full transition-colors duration-200 cursor-pointer';
  const stateClass = isActive
    ? 'text-brand-700'
    : 'text-gray-700 hover:text-brand-700';

  if (item.href) {
    return (
      <Link to={item.href} className={`${baseClass} ${stateClass}`}>
        {item.name}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-1 ${baseClass} ${stateClass}`}
      >
        {item.name}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <DropdownMenu item={item} onClose={() => setOpen(false)} />}
    </div>
  );
}

function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <img
        src="/lifeferry_logo.jpeg"
        alt=""
        className="h-11 w-11 rounded-full object-cover"
      />
      <span className="leading-tight">
        <span className={`block font-display text-xl font-semibold ${dark ? 'text-white' : 'text-deep'}`}>
          Lifeferry
        </span>
        <span className={`block text-[11px] font-bold uppercase tracking-[0.16em] ${dark ? 'text-accent-300' : 'text-accent-600'}`}>
          Mental Health Initiative
        </span>
      </span>
    </span>
  );
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileExpanded(null);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-deep focus:px-5 focus:py-2.5 focus:text-white"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/95 backdrop-blur">
        <nav aria-label="Main navigation" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link to="/" className="rounded-2xl" aria-label="Lifeferry Mental Health Initiative — home">
              <Wordmark />
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center gap-1 lg:flex">
              {navigation.map((item) => (
                <NavItemDesktop key={item.name} item={item} />
              ))}
              <Link to="/contact" className="btn-primary ml-4 !px-6 !py-2.5 text-[15px]">
                Get Support
              </Link>
            </div>

            <button
              type="button"
              className="cursor-pointer rounded-full p-2 text-deep hover:bg-brand-50 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="border-t border-brand-100 bg-white lg:hidden">
            <div className="space-y-1 px-4 py-4">
              {navigation.map((item) => {
                if (item.href) {
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block rounded-xl px-4 py-3 text-base font-bold transition-colors duration-200 ${
                        location.pathname === item.href
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-gray-800 hover:bg-brand-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                }

                const isExpanded = mobileExpanded === item.name;
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => setMobileExpanded(isExpanded ? null : item.name)}
                      aria-expanded={isExpanded}
                      className="flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-base font-bold text-gray-800 transition-colors duration-200 hover:bg-brand-50"
                    >
                      {item.name}
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-accent-300 pl-3">
                        {item.children!.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className={`block rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                              location.pathname === child.href
                                ? 'bg-brand-50 text-brand-700'
                                : 'text-gray-600 hover:bg-brand-50 hover:text-brand-700'
                            }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <Link to="/contact" className="btn-primary mt-3 w-full">
                Get Support
              </Link>
            </div>
          </div>
        )}
      </header>

      <main id="main-content" className="flex-grow">{children}</main>

      <footer className="bg-deep text-brand-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Wordmark dark />
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-100/90">
                Your partner through life's cruise. Providing compassionate
                mental health support with a special focus on women's mental
                health and well-being.
              </p>
            </div>

            <nav aria-label="About links">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-accent-300">About</h3>
              <ul className="mt-4 space-y-2.5">
                <li><Link to="/about" className="text-sm font-semibold transition-colors duration-200 hover:text-white">About Us</Link></li>
                <li><Link to="/services" className="text-sm font-semibold transition-colors duration-200 hover:text-white">Services</Link></li>
                <li><Link to="/team" className="text-sm font-semibold transition-colors duration-200 hover:text-white">Our Team</Link></li>
                <li><Link to="/partner" className="text-sm font-semibold transition-colors duration-200 hover:text-white">Partner With Us</Link></li>
                <li><Link to="/contact" className="text-sm font-semibold transition-colors duration-200 hover:text-white">Contact</Link></li>
              </ul>
            </nav>

            <nav aria-label="Resource links">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-accent-300">Resources</h3>
              <ul className="mt-4 space-y-2.5">
                <li><Link to="/resources" className="text-sm font-semibold transition-colors duration-200 hover:text-white">Resources & Guides</Link></li>
                <li><Link to="/programs" className="text-sm font-semibold transition-colors duration-200 hover:text-white">Programs & Events</Link></li>
                <li><Link to="/media" className="text-sm font-semibold transition-colors duration-200 hover:text-white">Media</Link></li>
                <li><Link to="/blog" className="text-sm font-semibold transition-colors duration-200 hover:text-white">Blog</Link></li>
              </ul>
            </nav>

            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-accent-300">In a difficult moment?</h3>
              <p className="mt-4 flex items-start gap-2.5 text-sm leading-relaxed text-brand-100/90">
                <HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" />
                <span>
                  You are not alone. Reach out through our{' '}
                  <Link to="/contact" className="font-bold text-white underline decoration-accent-500 underline-offset-2 hover:decoration-2">
                    contact page
                  </Link>{' '}
                  or explore our{' '}
                  <Link to="/resources" className="font-bold text-white underline decoration-accent-500 underline-offset-2 hover:decoration-2">
                    support resources
                  </Link>
                  .
                </span>
              </p>
              <div className="mt-6 flex items-center gap-3" aria-label="Social media">
                <a
                  href="https://www.instagram.com/lifeferryng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/10 p-2.5 transition-colors duration-200 hover:bg-accent-500"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.youtube.com/@Joycethebeloved"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/10 p-2.5 transition-colors duration-200 hover:bg-accent-500"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/life-ferry-769918376/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/10 p-2.5 transition-colors duration-200 hover:bg-accent-500"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-xs text-brand-100/80">
                © {new Date().getFullYear()} Lifeferry Mental Health Initiative. All rights reserved.
              </p>
              <div className="flex flex-wrap gap-5 text-xs font-semibold">
                <Link to="/faq" className="transition-colors duration-200 hover:text-white">FAQ</Link>
                <Link to="/privacy" className="transition-colors duration-200 hover:text-white">Privacy Policy</Link>
                <Link to="/terms" className="transition-colors duration-200 hover:text-white">Terms of Use</Link>
                <Link to="/disclaimer" className="transition-colors duration-200 hover:text-white">Disclaimer</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
