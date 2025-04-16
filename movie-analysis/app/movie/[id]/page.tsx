"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { FiStar, FiClock, FiCalendar, FiDollarSign, FiThumbsUp, FiThumbsDown, FiInfo, FiUsers, FiBookmark, FiGlobe, FiMap } from 'react-icons/fi';
import RegionSelector from '@/components/RegionSelector';
import Header from '@/components/Header';
import { getMovieDetails, getOmdbData, generateMovieAnalysis, DEFAULT_REGION, type MovieDetails, type OmdbData, type MovieAnalysis } from '@/lib/api';
import { motion } from 'framer-motion';

export default function MoviePage() {
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  
  const [selectedRegion, setSelectedRegion] = useState(DEFAULT_REGION);
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
          setIsLoading(true);
          const details = await getMovieDetails(parseInt(id), selectedRegion);
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
  }, [id, selectedRegion]);
  
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
  };

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
    ? (ratings.reduce((acc, rating) => {
        // Convert different rating formats to a scale of 0-10
        if (rating.Source === 'Internet Movie Database') {
          return acc + (parseFloat(rating.Value.split('/')[0]) || 0);
        } else if (rating.Source === 'Rotten Tomatoes') {
          return acc + (parseInt(rating.Value) / 10 || 0);
        } else if (rating.Source === 'Metacritic') {
          return acc + (parseInt(rating.Value.split('/')[0]) / 10 || 0);
        }
        return acc;
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
          <div className="flex justify-between items-center">
            <div className="flex-1 flex overflow-x-auto scrollbar-hide">
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
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-4 font-medium transition-colors ${
                activeTab === 'reviews' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Reviews
            </button>
            </div>
            
            <div className="ml-4">
              <RegionSelector 
                selectedRegion={selectedRegion}
                onRegionChange={handleRegionChange}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {movieDetails.overview}
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-white dark:bg-dark-700 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <FiCalendar className="text-primary-600 mr-2" />
                    <h3 className="font-medium">Release Date</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{movieDetails.release_date}</p>
                </div>
                
                <div className="p-4 bg-white dark:bg-dark-700 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <FiClock className="text-primary-600 mr-2" />
                    <h3 className="font-medium">Runtime</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{movieDetails.runtime} min</p>
                </div>
                
                <div className="p-4 bg-white dark:bg-dark-700 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <FiDollarSign className="text-primary-600 mr-2" />
                    <h3 className="font-medium">Budget</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {movieDetails.budget ? `$${(movieDetails.budget / 1000000).toFixed(1)}M` : 'N/A'}
                  </p>
                </div>
                
                <div className="p-4 bg-white dark:bg-dark-700 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <FiDollarSign className="text-primary-600 mr-2" />
                    <h3 className="font-medium">Revenue</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {movieDetails.revenue ? `$${(movieDetails.revenue / 1000000).toFixed(1)}M` : 'N/A'}
                  </p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-3">Production Companies</h3>
              <div className="flex flex-wrap gap-4 mb-8">
                {movieDetails.production_companies?.map((company) => (
                  <div key={company.id} className="flex items-center p-3 bg-white dark:bg-dark-700 rounded-lg shadow-sm">
                    {company.logo_path ? (
                      <Image 
                        src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                        alt={company.name}
                        width={60}
                        height={30}
                        className="object-contain mr-2"
                      />
                    ) : (
                      <div className="w-[60px] h-[30px] bg-gray-200 dark:bg-dark-600 rounded flex items-center justify-center mr-2">
                        <FiInfo size={16} className="text-gray-400" />
                      </div>
                    )}
                    <span className="text-sm font-medium">{company.name}</span>
                  </div>
                ))}
              </div>
              
              <h3 className="text-xl font-bold mb-3">Production Countries</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {movieDetails.production_countries?.map((country) => (
                  <div key={country.iso_3166_1} className="flex items-center px-3 py-1 bg-white dark:bg-dark-700 rounded-full shadow-sm">
                    <FiMap className="mr-1 text-primary-600" />
                    <span className="text-sm">{country.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="bg-white dark:bg-dark-700 rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Ratings</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">TMDB</span>
                      <span className="text-sm font-medium">{movieDetails.vote_average.toFixed(1)}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${(movieDetails.vote_average / 10) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {movieDetails.vote_count.toLocaleString()} votes
                    </div>
                  </div>
                  
                  {omdbData?.Ratings?.map((rating, index) => {
                    let score = 0;
                    let outOf = '';
                    
                    if (rating.Source === 'Internet Movie Database') {
                      const [value, max] = rating.Value.split('/');
                      score = (parseFloat(value) / parseFloat(max)) * 100;
                      outOf = rating.Value;
                    } else if (rating.Source === 'Rotten Tomatoes') {
                      score = parseInt(rating.Value);
                      outOf = rating.Value;
                    } else if (rating.Source === 'Metacritic') {
                      const [value, max] = rating.Value.split('/');
                      score = (parseInt(value) / parseInt(max)) * 100;
                      outOf = rating.Value;
                    }
                    
                    return (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{rating.Source}</span>
                          <span className="text-sm font-medium">{outOf}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {omdbData && (
                <div className="bg-white dark:bg-dark-700 rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-bold mb-4">Additional Info</h3>
                  
                  <div className="space-y-3">
                    {omdbData.Director && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Director</h4>
                        <p className="text-gray-800 dark:text-gray-200">{omdbData.Director}</p>
                      </div>
                    )}
                    
                    {omdbData.Writer && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Writer</h4>
                        <p className="text-gray-800 dark:text-gray-200">{omdbData.Writer}</p>
                      </div>
                    )}
                    
                    {omdbData.Actors && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Actors</h4>
                        <p className="text-gray-800 dark:text-gray-200">{omdbData.Actors}</p>
                      </div>
                    )}
                    
                    {omdbData.Awards && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Awards</h4>
                        <p className="text-gray-800 dark:text-gray-200">{omdbData.Awards}</p>
                      </div>
                    )}
                    
                    {omdbData.BoxOffice && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Box Office</h4>
                        <p className="text-gray-800 dark:text-gray-200">{omdbData.BoxOffice}</p>
                      </div>
                    )}
                    
                    {omdbData.DVD && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">DVD Release</h4>
                        <p className="text-gray-800 dark:text-gray-200">{omdbData.DVD}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'analysis' && analysis && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Movie Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-dark-700 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FiThumbsUp className="text-green-500 mr-2" />
                  Strengths
                </h3>
                <ul className="space-y-3">
                  {analysis?.strengths?.map((strength, index) => (
                    <li key={index} className="flex">
                      <span className="text-green-500 mr-2">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white dark:bg-dark-700 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FiThumbsDown className="text-red-500 mr-2" />
                  Weaknesses
                </h3>
                <ul className="space-y-3">
                  {analysis?.weaknesses?.map((weakness, index) => (
                    <li key={index} className="flex">
                      <span className="text-red-500 mr-2">•</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-white dark:bg-dark-700 rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Critical Analysis</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{analysis?.criticalAnalysis}</p>
              
              <h4 className="text-lg font-semibold mb-2">Target Audience</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {analysis?.targetAudience?.map((audience, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-gray-100 dark:bg-dark-600 rounded-full text-sm"
                  >
                    <FiUsers className="inline mr-1" />
                    {audience}
                  </span>
                ))}
              </div>
              
              <h4 className="text-lg font-semibold mb-2">Cultural Impact</h4>
              <p className="text-gray-700 dark:text-gray-300">{analysis?.culturalImpact}</p>
            </div>
            
            <div className="bg-white dark:bg-dark-700 rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">Similar Movies You Might Enjoy</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {analysis?.similarMovies?.map((movie, index) => (
                  <div key={index} className="space-y-2">
                    <div className="aspect-[2/3] bg-gray-200 dark:bg-dark-600 rounded-lg overflow-hidden relative">
                      {/* In a real app, we would use actual movie posters */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{movie.title}</span>
                      </div>
                    </div>
                    <h4 className="text-sm font-medium truncate">{movie.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{movie.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'cast' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Cast & Crew</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              This is a demo page. In a real application, this section would display the cast and crew information.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-dark-700 rounded-lg shadow-sm overflow-hidden">
                  <div className="aspect-[2/3] bg-gray-200 dark:bg-dark-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Actor {index + 1}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium">Actor Name</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Character Name</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              This is a demo page. In a real application, this section would display user and critic reviews.
            </p>
            
            <div className="space-y-6">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-dark-700 rounded-lg shadow-sm p-6">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-dark-600 mr-3"></div>
                      <div>
                        <h4 className="font-medium">Reviewer Name</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">June 1, 2023</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiStar className="text-yellow-500 mr-1" />
                      <span className="font-medium">{(Math.random() * 5 + 5).toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}