import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'How it Works', href: '#how-it-works' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isHomePage = location.pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center overflow-hidden group-hover:shadow-glow transition-shadow duration-300">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className={`font-display font-bold text-xl transition-colors ${
              isScrolled ? 'text-navy-950' : 'text-navy-950'
            }`}>
              CashSupport<span className="text-purple-600">Shipment</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {isHomePage ? (
              <>
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    className={`text-sm font-medium transition-colors hover:text-purple-600 relative group ${
                      isScrolled ? 'text-navy-800' : 'text-navy-800'
                    }`}
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
                  </button>
                ))}
              </>
            ) : (
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                  isScrolled ? 'text-navy-800' : 'text-navy-800'
                }`}
              >
                Home
              </Link>
            )}
            <Link
              to="/track"
              className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                isScrolled ? 'text-navy-800' : 'text-navy-800'
              }`}
            >
              Track
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/login">
              <Button
                variant="ghost"
                className={`text-sm font-medium ${
                  isScrolled ? 'text-navy-800' : 'text-navy-800'
                }`}
              >
                Login
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button className="bg-gradient-brand text-white hover:opacity-90 shadow-lg hover:shadow-glow transition-all duration-300">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-navy-800" />
            ) : (
              <Menu className="w-6 h-6 text-navy-800" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'
          }`}
        >
          <div className="bg-white rounded-2xl shadow-xl p-4 space-y-2">
            {isHomePage && (
              <>
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    className="block w-full text-left px-4 py-3 text-navy-800 hover:bg-purple-50 rounded-xl transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </>
            )}
            <Link
              to="/track"
              className="block px-4 py-3 text-navy-800 hover:bg-purple-50 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Track Package
            </Link>
            <hr className="my-2" />
            <Link
              to="/login"
              className="block px-4 py-3 text-navy-800 hover:bg-purple-50 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/sign-up"
              className="block px-4 py-3 bg-gradient-brand text-white rounded-xl text-center font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
