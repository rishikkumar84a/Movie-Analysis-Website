"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MovieCard from '@/components/MovieCard';
import { getMovieDetails, type MovieDetails } from '@/lib/api';
import { FiBookmark, FiAlertCircle } from 'react-icons/fi';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<MovieDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate fetching watchlist from local storage
  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would fetch the user's watchlist from an API or database
        // For demo purposes, we'll just load mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Load mock data - in a real app this would come from an API
        const movie1 = await getMovieDetails(1); // Inception
        const movie2 = await getMovieDetails(2); // The Dark Knight
        
        setWatchlist([movie1, movie2]);
      } catch (error) {
        console.error('Error loading watchlist:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWatchlist();
  }, []);
  
  const removeFromWatchlist = (id: number) => {
    setWatchlist(prev => prev.filter(movie => movie.id !== id));
    // In a real app, this would also update the database or API
  };
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Watchlist</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Movies you've saved to watch later
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-10 w-40 bg-gray-300 dark:bg-dark-600 rounded mb-8"></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="bg-gray-300 dark:bg-dark-600 aspect-[2/3] rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        ) : watchlist.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="p-6 rounded-full bg-gray-100 dark:bg-dark-600 mb-4">
              <FiBookmark size={36} className="text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your watchlist is empty</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
              Add movies to your watchlist by clicking the bookmark icon on movie cards or movie pages.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {watchlist.map((movie) => (
                <div key={movie.id} className="relative">
                  <MovieCard
                    id={movie.id}
                    title={movie.title}
                    posterPath={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    year={movie.release_date?.substring(0, 4) || 'Unknown'}
                    rating={movie.vote_average}
                    isInWatchlist={true}
                  />
                  <button
                    onClick={() => removeFromWatchlist(movie.id)}
                    className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors"
                    aria-label="Remove from watchlist"
                  >
                    <FiBookmark className="fill-current" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
              <div className="flex items-start">
                <FiAlertCircle className="text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    This is a demo watchlist with mock data. In a real application, your watchlist would persist between sessions.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 