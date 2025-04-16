"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { searchMovies, type Movie, DEFAULT_REGION } from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import SearchBar from '@/components/SearchBar';
import RegionSelector from '@/components/RegionSelector';
import { FiSearch, FiFilter, FiGlobe } from 'react-icons/fi';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [selectedRegion, setSelectedRegion] = useState(DEFAULT_REGION);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
  };
  
  useEffect(() => {
    const fetchMovies = async () => {
      if (!query) {
        setMovies([]);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        const results = await searchMovies(query, selectedRegion);
        setMovies(results);
      } catch (err) {
        console.error('Error searching movies:', err);
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovies();
  }, [query, selectedRegion]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {query ? `Showing results for "${query}"` : 'Enter a search term to find movies'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <RegionSelector 
            selectedRegion={selectedRegion}
            onRegionChange={handleRegionChange}
          />
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-dark-500 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors">
            <FiFilter className="mr-2" />
            Filter
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-40 bg-gray-300 dark:bg-dark-600 rounded mb-8"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="bg-gray-300 dark:bg-dark-600 aspect-[2/3] rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="p-6 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <FiSearch size={36} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-md">{error}</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="p-6 rounded-full bg-gray-100 dark:bg-dark-600 mb-4">
            <FiSearch size={36} className="text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-md">
            {query 
              ? `We couldn't find any movies matching "${query}" in ${selectedRegion}. Try a different search term.` 
              : 'Enter a search term to find movies.'}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center">
            <FiGlobe className="mr-2 text-primary-600" />
            <span className="text-sm font-medium">Showing search results for "{query}" in {selectedRegion}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                year={movie.release_date?.substring(0, 4) || 'Unknown'}
                rating={movie.vote_average}
              />
            ))}
          </div>
        </>
      )}
      
      {movies.length > 0 && (
        <div className="mt-10 flex justify-center">
          <button className="btn-primary">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-800">
      <Header />
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-10 w-40 bg-gray-300 dark:bg-dark-600 rounded mb-8"></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="bg-gray-300 dark:bg-dark-600 aspect-[2/3] rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </div>
  );
}