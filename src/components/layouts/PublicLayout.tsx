import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Youtube, Linkedin, ChevronDown } from 'lucide-react';
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
    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
      {item.children!.map((child) => (
        <Link
          key={child.href}
          to={child.href}
          onClick={onClose}
          className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
            location.pathname === child.href
              ? 'text-teal-600 bg-teal-50'
              : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (item.href) {
    return (
      <Link
        to={item.href}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'text-teal-600 bg-teal-50'
            : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
        }`}
      >
        {item.name}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'text-teal-600 bg-teal-50'
            : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
        }`}
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
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/lifeferry_logo.jpeg"
                alt="Lifeferry Logo"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <div className="text-xl font-semibold text-gray-900">Lifeferry</div>
                <div className="text-xs text-gray-500">Mental Health Initiative</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <NavItemDesktop key={item.name} item={item} />
              ))}
            </div>

            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => {
                if (item.href) {
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                        location.pathname === item.href
                          ? 'text-teal-600 bg-teal-50'
                          : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
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
                      className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
                    >
                      {item.name}
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-teal-100 pl-3">
                        {item.children!.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                              location.pathname === child.href
                                ? 'text-teal-600 bg-teal-50'
                                : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
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
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="/lifeferry_logo.jpeg"
                  alt="Lifeferry Logo"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-lg font-semibold text-white">Lifeferry</div>
                  <div className="text-sm text-gray-400">Mental Health Initiative</div>
                </div>
              </div>
              <p className="text-sm text-gray-400 max-w-md">
                Your partner through life's cruise. Providing compassionate mental health support with a special focus on women's mental health and well-being.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-8 col-span-1 md:col-span-2">
              <div>
                <h3 className="text-white font-semibold mb-4">About</h3>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-sm hover:text-teal-400 transition-colors">About Us</Link></li>
                  <li><Link to="/services" className="text-sm hover:text-teal-400 transition-colors">Services</Link></li>
                  <li><Link to="/team" className="text-sm hover:text-teal-400 transition-colors">Our Team</Link></li>
                  <li><Link to="/partner" className="text-sm hover:text-teal-400 transition-colors">Partner With Us</Link></li>
                  <li><Link to="/contact" className="text-sm hover:text-teal-400 transition-colors">Contact</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><Link to="/resources" className="text-sm hover:text-teal-400 transition-colors">Resources & Guides</Link></li>
                  <li><Link to="/programs" className="text-sm hover:text-teal-400 transition-colors">Programs & Events</Link></li>
                  <li><Link to="/media" className="text-sm hover:text-teal-400 transition-colors">Media</Link></li>
                  <li><Link to="/blog" className="text-sm hover:text-teal-400 transition-colors">Blog</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-white text-sm font-semibold">Follow Us</span>
                <div className="flex items-center space-x-3">
                  <a
                    href="https://www.instagram.com/lifeferryng"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 rounded-full hover:bg-teal-600 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.youtube.com/@Joycethebeloved"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 rounded-full hover:bg-teal-600 transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/life-ferry-769918376/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 rounded-full hover:bg-teal-600 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <Link to="/faq" className="hover:text-teal-400 transition-colors">FAQ</Link>
                <Link to="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-teal-400 transition-colors">Terms of Use</Link>
                <Link to="/disclaimer" className="hover:text-teal-400 transition-colors">Disclaimer</Link>
              </div>
            </div>

            <p className="text-sm text-gray-400 mt-6 text-center">
              © {new Date().getFullYear()} Lifeferry Mental Health Initiative. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
