import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Button from './Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="#" className="text-2xl font-bold text-indigo-600">
              Horizon
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#testimonials">Testimonials</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#" hasDropdown={true}>Resources</NavLink>
            <Button href="#" variant="secondary" size="sm">Log in</Button>
            <Button href="#" variant="primary" size="sm">Sign up</Button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 px-2">
            <div className="flex flex-col space-y-3">
              <MobileNavLink href="#features">Features</MobileNavLink>
              <MobileNavLink href="#testimonials">Testimonials</MobileNavLink>
              <MobileNavLink href="#pricing">Pricing</MobileNavLink>
              <MobileNavLink href="#">Resources</MobileNavLink>
              <div className="pt-2 flex flex-col space-y-2">
                <Button href="#" variant="secondary" size="sm" fullWidth>Log in</Button>
                <Button href="#" variant="primary" size="sm" fullWidth>Sign up</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const NavLink = ({ href, children, hasDropdown = false }) => (
  <a
    href={href}
    className="text-gray-700 hover:text-indigo-600 transition-colors font-medium flex items-center"
  >
    {children}
    {hasDropdown && <ChevronDown className="h-4 w-4 ml-1" />}
  </a>
);

const MobileNavLink = ({ href, children }) => (
  <a
    href={href}
    className="text-gray-700 hover:text-indigo-600 transition-colors text-lg font-medium py-2 block"
  >
    {children}
  </a>
);

export default Header;