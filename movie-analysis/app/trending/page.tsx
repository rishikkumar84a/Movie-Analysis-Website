"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { getTrendingMovies, DEFAULT_REGION } from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import RegionSelector from '@/components/RegionSelector';
import { FiFilter, FiGlobe } from 'react-icons/fi';

export default function TrendingPage() {
  const [selectedRegion, setSelectedRegion] = useState(DEFAULT_REGION);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch trending movies when the component mounts or region changes
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const movies = await getTrendingMovies(selectedRegion);
        setTrendingMovies(movies);
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovies();
  }, [selectedRegion]);
  
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
  };
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Trending Movies</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Discover the most popular movies right now
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 dark:bg-dark-600 rounded-lg aspect-[2/3] mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-dark-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-dark-600 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center">
              <FiGlobe className="mr-2 text-primary-600" />
              <span className="text-sm font-medium">Showing trending movies in {selectedRegion}</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {trendingMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.original_language && movie.original_language !== 'en' && movie.original_title ? 
                    `${movie.title} (${movie.original_title})` : movie.title}
                  posterPath={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  year={movie.release_date?.substring(0, 4) || 'Unknown'}
                  rating={movie.vote_average}
                />
              ))}
            </div>
            
            <div className="mt-10 flex justify-center">
              <button className="btn-primary">
                Load More
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}