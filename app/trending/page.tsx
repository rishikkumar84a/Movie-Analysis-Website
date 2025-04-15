import Header from '@/components/Header';
import { getTrendingMovies } from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import { FiFilter } from 'react-icons/fi';

export default async function TrendingPage() {
  const trendingMovies = await getTrendingMovies();
  
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
          
          <div className="mt-4 md:mt-0">
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-dark-500 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors">
              <FiFilter className="mr-2" />
              Filter
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {trendingMovies.map((movie) => (
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
        
        <div className="mt-10 flex justify-center">
          <button className="btn-primary">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
} 