"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import { searchMovies, getMovieDetails, type Movie, type MovieDetails } from '@/lib/api';
import { FiSearch, FiX, FiStar, FiClock, FiCalendar, FiUsers } from 'react-icons/fi';

export default function ComparePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<(MovieDetails | null)[]>([null, null, null]);
  const [isSearching, setIsSearching] = useState(false);
  const [compareSlotIndex, setCompareSlotIndex] = useState<number | null>(null);
  
  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) return;
    
    setIsSearching(true);
    try {
      const results = await searchMovies(searchQuery);
      setSearchResults(results.slice(0, 10));
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSelectMovie = async (movie: Movie) => {
    if (compareSlotIndex === null) return;
    
    try {
      const details = await getMovieDetails(movie.id);
      
      // Update the selected movie at the given slot index
      setSelectedMovies(prev => {
        const updated = [...prev];
        updated[compareSlotIndex] = details;
        return updated;
      });
      
      // Clear search results and query
      setSearchResults([]);
      setSearchQuery('');
      setCompareSlotIndex(null);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleRemoveMovie = (index: number) => {
    setSelectedMovies(prev => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
  };
  
  const startCompare = (index: number) => {
    setCompareSlotIndex(index);
    setSearchResults([]);
    setSearchQuery('');
  };
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Compare Movies</h1>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-10">
            Select up to three movies to compare ratings, reviews, and details side by side.
          </p>
          
          {/* Compare Slots */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {selectedMovies.map((movie, index) => (
              <div 
                key={index}
                className="card-neumorphic flex flex-col items-center text-center p-4 aspect-[1/1.2]"
              >
                {movie ? (
                  <>
                    <div className="relative w-40 aspect-[2/3] mb-4">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleRemoveMovie(index)}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                        aria-label="Remove movie"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                    <h3 className="font-semibold text-lg line-clamp-1">{movie.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {movie.release_date?.substring(0, 4) || 'Unknown'}
                    </p>
                  </>
                ) : (
                  <div
                    onClick={() => startCompare(index)}
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-600 rounded-lg transition-colors"
                  >
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-dark-500 flex items-center justify-center mb-4">
                      <FiSearch size={24} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">Select a movie</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Search Section */}
          {compareSlotIndex !== null && (
            <div className="card-neumorphic p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Select movie for comparison slot {compareSlotIndex + 1}
              </h2>
              <div className="flex w-full mb-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search for a movie..."
                    className="w-full px-4 py-2 pr-10 rounded-l-lg border border-gray-300 dark:border-dark-500 bg-white dark:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                      aria-label="Clear search"
                    >
                      <FiX size={18} />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-r-lg transition-colors flex items-center"
                >
                  <FiSearch className="mr-2" />
                  Search
                </button>
              </div>
              
              {/* Search Results */}
              <div>
                {isSearching ? (
                  <div className="p-4 text-center">
                    <div className="animate-pulse flex justify-center">
                      <div className="h-4 w-24 bg-gray-300 dark:bg-dark-600 rounded"></div>
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {searchResults.map(movie => (
                      <div
                        key={movie.id}
                        onClick={() => handleSelectMovie(movie)}
                        className="cursor-pointer group"
                      >
                        <div className="relative aspect-[2/3] overflow-hidden rounded-lg mb-2 group-hover:ring-2 ring-primary-500 transition-all">
                          <Image
                            src={movie.poster_path 
                              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                              : '/images/movie-placeholder.jpg'
                            }
                            alt={movie.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary-600 transition-colors">
                          {movie.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {movie.release_date?.substring(0, 4) || 'Unknown'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="p-4 text-center text-gray-600 dark:text-gray-300">
                    No results found. Try a different search term.
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-600 dark:text-gray-300">
                    Search for a movie to compare.
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setCompareSlotIndex(null)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {/* Comparison Table */}
          {selectedMovies.some(movie => movie !== null) && (
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-dark-700 rounded-xl shadow-lg">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-dark-600">
                    <th className="p-4 text-left font-semibold">Feature</th>
                    {selectedMovies.map((movie, index) => (
                      <th key={index} className="p-4 text-center font-semibold">
                        {movie ? movie.title : `Movie ${index + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Release Date */}
                  <tr className="border-b border-gray-200 dark:border-dark-600">
                    <td className="p-4 flex items-center font-medium">
                      <FiCalendar className="mr-2 text-primary-600" />
                      Release Date
                    </td>
                    {selectedMovies.map((movie, index) => (
                      <td key={index} className="p-4 text-center text-gray-600 dark:text-gray-300">
                        {movie ? movie.release_date : '—'}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Rating */}
                  <tr className="border-b border-gray-200 dark:border-dark-600">
                    <td className="p-4 flex items-center font-medium">
                      <FiStar className="mr-2 text-primary-600" />
                      Rating
                    </td>
                    {selectedMovies.map((movie, index) => (
                      <td key={index} className="p-4 text-center">
                        {movie ? (
                          <div className="flex items-center justify-center">
                            <span className="flex items-center text-yellow-500">
                              <FiStar className="fill-current mr-1" /> 
                              <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                            </span>
                            <span className="text-xs text-gray-500 ml-1">/10</span>
                          </div>
                        ) : '—'}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Runtime */}
                  <tr className="border-b border-gray-200 dark:border-dark-600">
                    <td className="p-4 flex items-center font-medium">
                      <FiClock className="mr-2 text-primary-600" />
                      Runtime
                    </td>
                    {selectedMovies.map((movie, index) => (
                      <td key={index} className="p-4 text-center text-gray-600 dark:text-gray-300">
                        {movie ? `${movie.runtime} min` : '—'}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Genres */}
                  <tr className="border-b border-gray-200 dark:border-dark-600">
                    <td className="p-4 flex items-center font-medium">
                      <span className="mr-2 text-primary-600">#</span>
                      Genres
                    </td>
                    {selectedMovies.map((movie, index) => (
                      <td key={index} className="p-4 text-center text-gray-600 dark:text-gray-300">
                        {movie ? movie.genres?.map(g => g.name).join(', ') : '—'}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Director */}
                  <tr className="border-b border-gray-200 dark:border-dark-600">
                    <td className="p-4 flex items-center font-medium">
                      <FiUsers className="mr-2 text-primary-600" />
                      Director
                    </td>
                    {selectedMovies.map((movie, index) => (
                      <td key={index} className="p-4 text-center text-gray-600 dark:text-gray-300">
                        {movie ? movie.credits?.crew?.find(person => person.job === 'Director')?.name || 'Unknown' : '—'}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Overview */}
                  <tr>
                    <td className="p-4 flex items-center font-medium">
                      Overview
                    </td>
                    {selectedMovies.map((movie, index) => (
                      <td key={index} className="p-4 text-sm text-gray-600 dark:text-gray-300">
                        {movie ? (
                          <p className="line-clamp-3">{movie.overview}</p>
                        ) : '—'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 