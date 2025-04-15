"use client";

import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import SearchBar from './SearchBar';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glassmorphism shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-heading font-bold text-xl">MovieInsight</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="font-medium hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="/trending" className="font-medium hover:text-primary-600 transition-colors">
              Trending
            </Link>
            <Link href="/compare" className="font-medium hover:text-primary-600 transition-colors">
              Compare
            </Link>
            <Link href="/watchlist" className="font-medium hover:text-primary-600 transition-colors">
              Watchlist
            </Link>
          </nav>

          {/* Search and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <SearchBar />
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-dark-600">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="font-medium hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/trending" 
                className="font-medium hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trending
              </Link>
              <Link 
                href="/compare" 
                className="font-medium hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Compare
              </Link>
              <Link 
                href="/watchlist" 
                className="font-medium hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Watchlist
              </Link>
              <div className="pt-2 flex items-center justify-between">
                <SearchBar isMobile />
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 