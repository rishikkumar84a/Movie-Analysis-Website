import Header from '@/components/Header';
import { getTrendingMovies } from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import { FiPlay, FiBarChart2, FiUsers, FiZap } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const trendingMovies = await getTrendingMovies();
  
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg"
            alt="Movie backdrop"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 backdrop-blur-sm" />
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Deep Insights for Every Movie
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100">
              Discover comprehensive analysis, aggregated ratings, and community opinions for any movie worldwide.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/trending" className="btn-primary flex items-center">
                <FiBarChart2 className="mr-2" />
                Explore Trending
              </Link>
              <Link href="/compare" className="btn-secondary flex items-center">
                <FiZap className="mr-2" />
                Compare Movies
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-dark-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why MovieInsight?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-neumorphic flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                <FiBarChart2 size={28} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get AI-generated insights, detailed reviews, and aggregated ratings from multiple platforms.
              </p>
            </div>
            
            <div className="card-neumorphic flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                <FiUsers size={28} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Opinions</h3>
              <p className="text-gray-600 dark:text-gray-300">
                See what real viewers think with comments and reviews from multiple platforms in one place.
              </p>
            </div>
            
            <div className="card-neumorphic flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                <FiPlay size={28} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rich Content</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enjoy trailers, image galleries, and detailed information about cast, crew, and production.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trending Movies Section */}
      <section className="py-16 bg-gray-50 dark:bg-dark-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Trending Movies</h2>
            <Link href="/trending" className="text-primary-600 hover:text-primary-700 font-medium">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trendingMovies.slice(0, 5).map((movie) => (
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
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to explore?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Search for any movie to get comprehensive analysis, ratings, and insights from across the web.
          </p>
          <Link href="/trending" className="inline-block bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors">
            Start Exploring
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-dark-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-heading font-bold text-lg">MovieInsight</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} MovieInsight. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
} 