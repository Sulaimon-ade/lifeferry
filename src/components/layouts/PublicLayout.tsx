import { Link } from 'react-router-dom';
import { Menu, X, Instagram, Youtube, Linkedin } from 'lucide-react';
import { useState } from 'react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Team', href: '/team' },
    { name: 'Services', href: '/services' },
    { name: 'Programs & Events', href: '/programs' },
    { name: 'Resources', href: '/resources' },
    { name: 'Blog', href: '/blog' },
    { name: 'Partner With Us', href: '/partner' },
    { name: 'Media', href: '/media' },
    { name: 'Contact', href: '/contact' },
  ];

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

            <div className="hidden lg:flex space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
                >
                  {item.name}
                </Link>
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

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
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
                <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/about" className="text-sm hover:text-teal-400 transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/services" className="text-sm hover:text-teal-400 transition-colors">
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link to="/programs" className="text-sm hover:text-teal-400 transition-colors">
                      Programs & Events
                    </Link>
                  </li>
                  <li>
                    <Link to="/partner" className="text-sm hover:text-teal-400 transition-colors">
                      Partner With Us
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/faq" className="text-sm hover:text-teal-400 transition-colors">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="text-sm hover:text-teal-400 transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-sm hover:text-teal-400 transition-colors">
                      Terms of Use
                    </Link>
                  </li>
                  <li>
                    <Link to="/disclaimer" className="text-sm hover:text-teal-400 transition-colors">
                      Mental Health Disclaimer
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col items-center space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-3 text-center">Follow Us</h3>
                <div className="flex items-center space-x-4">
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

              <p className="text-sm text-gray-400 text-center">
                © {new Date().getFullYear()} Lifeferry Mental Health Initiative. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
