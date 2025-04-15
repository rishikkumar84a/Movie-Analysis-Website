"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { FiStar, FiClock, FiCalendar, FiDollarSign, FiThumbsUp, FiThumbsDown, FiInfo, FiUsers, FiBookmark } from 'react-icons/fi';
import Header from '@/components/Header';
import { getMovieDetails, getOmdbData, generateMovieAnalysis, type MovieDetails, type OmdbData, type MovieAnalysis } from '@/lib/api';
import { motion } from 'framer-motion';

export default function MoviePage() {
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [omdbData, setOmdbData] = useState<OmdbData | null>(null);
  const [analysis, setAnalysis] = useState<MovieAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        if (id) {
          const details = await getMovieDetails(parseInt(id));
          setMovieDetails(details);
          
          // In a real app, we would get the IMDB ID from the TMDB data
          // and then fetch OMDB data using that ID
          const omdb = await getOmdbData('tt1375666'); // Using a fixed IMDB ID for demo
          setOmdbData(omdb);
          
          // Generate analysis based on the movie data
          setAnalysis(generateMovieAnalysis(details, omdb));
        }
      } catch (error) {
        console.error('Error fetching movie data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovieData();
  }, [id]);

  const toggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
    // In a real app, this would update the user's watchlist in a database
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-dark-800">
        <Header />
        <div className="container mx-auto px-4 py-32 flex justify-center">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-300 dark:bg-dark-600 rounded mb-8"></div>
            <div className="h-96 w-full max-w-4xl bg-gray-300 dark:bg-dark-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-dark-800">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Movie not found</h1>
          <p>Sorry, we couldn't find the movie you're looking for.</p>
        </div>
      </div>
    );
  }

  // Calculate aggregate rating
  const ratings = omdbData?.Ratings || [];
  const aggregateRating = ratings.length > 0
    ? (ratings.reduce((sum, rating) => {
        // Convert different rating formats to a scale of 0-10
        if (rating.Source === 'Internet Movie Database') {
          return sum + (parseFloat(rating.Value.split('/')[0]) || 0);
        } else if (rating.Source === 'Rotten Tomatoes') {
          return sum + (parseInt(rating.Value) / 10 || 0);
        } else if (rating.Source === 'Metacritic') {
          return sum + (parseInt(rating.Value.split('/')[0]) / 10 || 0);
        }
        return sum;
      }, 0) / ratings.length).toFixed(1)
    : (movieDetails.vote_average / 2).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-800">
      <Header />
      
      {/* Hero Section with Backdrop */}
      <div className="relative h-[50vh] md:h-[70vh]">
        <div className="absolute inset-0">
          <Image
            src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
            alt={movieDetails.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/30" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            {/* Poster */}
            <div className="relative w-40 md:w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-xl flex-shrink-0 -mt-32 md:-mt-48 mx-auto md:mx-0">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                alt={movieDetails.title}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Movie Title and Basic Info */}
            <div className="text-white text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                {movieDetails.title}
              </h1>
              
              <div className="mt-2 text-gray-300 text-sm md:text-base">
                {omdbData?.Released} · {omdbData?.Runtime} · {omdbData?.Rated}
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                {movieDetails.genres?.map((genre) => (
                  <span 
                    key={genre.id} 
                    className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center mr-2">
                    <FiStar className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{aggregateRating}</div>
                    <div className="text-xs text-gray-300">Aggregate</div>
                  </div>
                </div>
                
                <button 
                  onClick={toggleWatchlist}
                  className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                    isInWatchlist 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <FiBookmark className={`mr-2 ${isInWatchlist ? 'fill-current' : ''}`} />
                  {isInWatchlist ? 'Saved' : 'Add to Watchlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Tabs */}
      <div className="sticky top-16 z-30 bg-white dark:bg-dark-700 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-4 font-medium transition-colors ${
                activeTab === 'overview' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-4 py-4 font-medium transition-colors ${
                activeTab === 'analysis' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Analysis
            </button>
            <button
              onClick={() => setActiveTab('cast')}
              className={`px-4 py-4 font-medium transition-colors ${
                activeTab === 'cast' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Cast & Crew
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`px-4 py-4 font-medium transition-colors ${
                activeTab === 'media' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Media
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {movieDetails.overview}
              </p>
              
              {/* Trailer */}
              {movieDetails.videos?.results?.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Trailer</h3>
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${movieDetails.videos.results[0].key}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <div className="card-neumorphic">
                <h3 className="text-xl font-semibold mb-4">Movie Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FiCalendar className="mt-1 mr-3 text-primary-600" />
                    <div>
                      <div className="font-medium">Release Date</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {omdbData?.Released || movieDetails.release_date}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiClock className="mt-1 mr-3 text-primary-600" />
                    <div>
                      <div className="font-medium">Runtime</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {omdbData?.Runtime || `${movieDetails.runtime} minutes`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiUsers className="mt-1 mr-3 text-primary-600" />
                    <div>
                      <div className="font-medium">Director</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {omdbData?.Director || movieDetails.credits?.crew?.find(person => person.job === 'Director')?.name || 'Unknown'}
                      </div>
                    </div>
                  </div>
                  
                  {(movieDetails.budget > 0 || movieDetails.revenue > 0) && (
                    <div className="flex items-start">
                      <FiDollarSign className="mt-1 mr-3 text-primary-600" />
                      <div>
                        <div className="font-medium">Box Office</div>
                        <div className="text-gray-600 dark:text-gray-400">
                          {omdbData?.BoxOffice || `$${(movieDetails.revenue / 1000000).toFixed(1)}M`}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Ratings */}
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Ratings</h4>
                  <div className="space-y-2">
                    {omdbData?.Ratings?.map((rating, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">{rating.Source}</span>
                        <span className="font-medium">{rating.Value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">TMDB</span>
                      <span className="font-medium">{movieDetails.vote_average.toFixed(1)}/10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && analysis && (
          <div className="max-w-4xl mx-auto">
            <div className="card-neumorphic mb-8">
              <h2 className="text-2xl font-bold mb-6">AI-Generated Analysis</h2>
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold mb-2">Verdict</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  {analysis.verdict}
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-lg font-medium flex items-center text-green-600 mb-2">
                      <FiThumbsUp className="mr-2" /> Pros
                    </h4>
                    <ul className="space-y-2">
                      {analysis.pros.map((pro, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium flex items-center text-red-600 mb-2">
                      <FiThumbsDown className="mr-2" /> Cons
                    </h4>
                    <ul className="space-y-2">
                      {analysis.cons.map((con, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mt-2 mr-2"></span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-gray-100 dark:bg-dark-600 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Recommended Age</div>
                    <div className="font-semibold">{analysis.recommendedAge}</div>
                  </div>
                  
                  <div className="p-4 bg-gray-100 dark:bg-dark-600 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Movie Type</div>
                    <div className="font-semibold">{analysis.movieType}</div>
                  </div>
                  
                  <div className="p-4 bg-gray-100 dark:bg-dark-600 rounded-lg col-span-2 md:col-span-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Detected Genres</div>
                    <div className="font-semibold">{analysis.detectedGenres.join(', ')}</div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="flex items-start">
                    <FiInfo className="text-blue-600 dark:text-blue-400 mt-1 mr-3" />
                    <div>
                      <div className="font-medium text-blue-800 dark:text-blue-300">Note</div>
                      <div className="text-blue-700 dark:text-blue-400 text-sm">
                        This analysis is generated using AI based on aggregated ratings and reviews. It may not reflect every individual's experience with the movie.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cast & Crew Tab */}
        {activeTab === 'cast' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Cast & Crew</h2>
            
            <h3 className="text-xl font-semibold mb-4">Cast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              {movieDetails.credits?.cast?.slice(0, 10).map((person) => (
                <motion.div 
                  key={person.id}
                  className="card bg-white dark:bg-dark-700"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-t-xl">
                    <Image
                      src={person.profile_path 
                        ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                        : '/images/person-placeholder.jpg'
                      }
                      alt={person.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold line-clamp-1">{person.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                      {person.character}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <h3 className="text-xl font-semibold mb-4">Key Crew</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {movieDetails.credits?.crew
                ?.filter(person => ['Director', 'Producer', 'Screenplay', 'Writer'].includes(person.job))
                .slice(0, 8)
                .map((person) => (
                  <div key={`${person.id}-${person.job}`} className="flex items-center p-3 bg-gray-100 dark:bg-dark-600 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{person.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{person.job}</div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Media</h2>
            
            <h3 className="text-xl font-semibold mb-4">Backdrops</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {movieDetails.images?.backdrops?.slice(0, 6).map((image, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={`https://image.tmdb.org/t/p/original${image.file_path}`}
                    alt={`Backdrop ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            
            <h3 className="text-xl font-semibold mb-4">Videos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {movieDetails.videos?.results?.slice(0, 4).map((video) => (
                <div key={video.key} className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 