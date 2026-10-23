import React, { useState, useEffect } from 'react';
import { Link, useLocation } from '../router';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { BRAND_CONFIG } from '../data/tailoringData';

interface HeaderProps {
  onOpenConsultation: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenConsultation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Collections', path: '/collections' },
    { label: 'Bespoke', path: '/bespoke' },
    { label: 'The Process', path: '/process' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] py-3.5 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]'
            : 'bg-white border-b border-[#E5E5E5]/60 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <Link
            to="/"
            className="flex flex-col tracking-tight text-[#111111] hover:opacity-80 transition-opacity shrink-0"
            aria-label="KRAYS DHAKA Homepage"
          >
            <span className="font-editorial text-2xl sm:text-2xl tracking-[0.18em] uppercase font-semibold leading-none">
              KRAYS DHAKA
            </span>
            <span className="text-[9px] tracking-[0.26em] uppercase text-[#777777] font-sans-ui mt-0.5">
              Bespoke & Made to Measure
            </span>
          </Link>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav
            className="hidden md:flex items-center gap-7 text-xs font-medium tracking-[0.12em] uppercase text-[#444444]"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-1 transition-colors duration-150 whitespace-nowrap shrink-0 hover:text-[#111111] ${
                    isActive ? 'text-[#111111] font-semibold' : ''
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#111111]"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Mobile Menu Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenConsultation}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium tracking-[0.14em] uppercase text-white bg-[#111111] hover:bg-[#282828] active:bg-[#000000] transition-colors whitespace-nowrap shrink-0 rounded-none cursor-pointer"
            >
              <span>Book Consultation</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#111111] hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-black/40 backdrop-blur-xs flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div className="bg-white w-full max-h-[85vh] overflow-y-auto px-6 py-8 border-t border-[#E5E5E5] flex flex-col">
            <div className="flex items-center justify-between pb-6 border-b border-[#E5E5E5]">
              <div>
                <p className="font-editorial text-xl tracking-[0.16em] uppercase font-semibold text-[#111111]">
                  KRAYS DHAKA
                </p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#777777] font-sans-ui">
                  Dhaka, Bangladesh
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#111111] hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex flex-col py-6 space-y-4" aria-label="Mobile links">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-base tracking-[0.1em] uppercase font-sans-ui py-2 border-b border-neutral-100 ${
                      isActive ? 'text-[#111111] font-semibold' : 'text-[#555555]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full py-3.5 text-center text-xs tracking-[0.15em] uppercase font-semibold text-white bg-[#111111] hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book a Consultation</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <p className="text-center text-xs text-[#777777] font-sans-ui mt-2">
                37, Avenue-1, Mirpur-10 · Dhaka
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
