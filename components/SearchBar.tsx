"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  isMobile?: boolean;
}

export default function SearchBar({ isMobile = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Dummy suggestions - In a real app, this would come from an API call
  const dummySuggestions = [
    'The Dark Knight',
    'Inception',
    'Interstellar',
    'Pulp Fiction',
    'The Godfather'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      // Simulate API call with dummy data
      const timer = setTimeout(() => {
        const filteredSuggestions = dummySuggestions.filter(
          item => item.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsExpanded(false);
      setQuery('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
    setIsExpanded(false);
    setQuery('');
  };

  return (
    <div 
      ref={searchRef}
      className={`relative ${isMobile ? 'w-full' : ''}`}
    >
      <div className={`flex items-center rounded-full border border-gray-300 dark:border-dark-500 ${
        isExpanded 
          ? 'bg-white dark:bg-dark-700 shadow-md' 
          : 'bg-gray-100 dark:bg-dark-600'
      } ${
        isMobile 
          ? 'w-full' 
          : isExpanded ? 'w-72' : 'w-40'
      } transition-all duration-300`}>
        
        {!isMobile && !isExpanded ? (
          <button 
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center justify-between px-3 py-2"
            aria-label="Expand search"
          >
            <span className="text-gray-500">Search</span>
            <FiSearch className="text-gray-500" />
          </button>
        ) : (
          <>
            <div className="flex-1 flex items-center pl-3">
              <FiSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full py-2 bg-transparent focus:outline-none"
                autoFocus={isExpanded}
              />
            </div>
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Clear search"
              >
                <FiX size={18} />
              </button>
            )}
            <button
              onClick={handleSearch}
              className="p-2 px-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="Search"
            >
              Search
            </button>
          </>
        )}
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isExpanded && (query.length > 2) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute mt-1 w-full bg-white dark:bg-dark-700 shadow-lg rounded-lg overflow-hidden z-10"
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                Loading...
              </div>
            ) : suggestions.length > 0 ? (
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No results found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 