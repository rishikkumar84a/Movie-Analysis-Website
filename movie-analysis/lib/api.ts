import axios from 'axios';

// API keys directly included for development purposes
// In production, these should be environment variables
const TMDB_API_KEY = '1b4126b986b05b3b5a5ea09a86276211';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const OMDB_API_KEY = '6abe85c6';
const OMDB_BASE_URL = 'https://www.omdbapi.com';

// Supported regions with their ISO 3166-1 codes
export const SUPPORTED_REGIONS = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  // Added more regions
  { code: 'RU', name: 'Russia' },
  { code: 'CN', name: 'China' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'TH', name: 'Thailand' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'PL', name: 'Poland' },
  { code: 'TR', name: 'Turkey' },
  { code: 'IL', name: 'Israel' },
  { code: 'NZ', name: 'New Zealand' }
];

// Default region
export const DEFAULT_REGION = 'US';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
  region?: string; // ISO 3166-1 region code
  original_language?: string;
  original_title?: string;
}

export interface RegionalRelease {
  region_code: string;
  region_name: string;
  release_date: string;
  certification?: string; // Movie rating/certification in that region
  local_title?: string; // Title in local language if different
}

export interface MovieDetails extends Movie {
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country?: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  spoken_languages: {
    iso_639_1: string;
    name: string;
    english_name?: string;
  }[];
  regional_releases?: RegionalRelease[];
  regional_box_office?: {
    region_code: string;
    currency: string;
    revenue: number;
  }[];
  videos: {
    results: {
      key: string;
      site: string;
      type: string;
      name: string;
    }[];
  };
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      profile_path: string | null;
    }[];
  };
  images: {
    backdrops: {
      file_path: string;
      width: number;
      height: number;
    }[];
  };
}

export interface OmdbData {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: {
    Source: string;
    Value: string;
  }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response: string;
}

export interface CombinedMovieData {
  tmdb: MovieDetails;
  omdb: OmdbData;
  analysis: MovieAnalysis;
  region: string;
  regionalData?: {
    localTitle?: string;
    localReleaseDate?: string;
    localCertification?: string;
    localBoxOffice?: string;
  };
}

export interface MovieAnalysis {
  verdict: string;
  pros: string[];
  cons: string[];
  recommendedAge: string;
  movieType: string;
  detectedGenres: string[];
}

// Get trending movies
export const getTrendingMovies = async (region: string = DEFAULT_REGION): Promise<Movie[]> => {
  // During build time, just return mock data to avoid API rate limiting
  if (typeof window === 'undefined') {
    return getMockTrendingMovies(region);
  }

  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&region=${region}`
    );
    
    // Add region to each movie object
    const moviesWithRegion = response.data.results.map((movie: any) => ({
      ...movie,
      region
    }));
    
    return moviesWithRegion;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    // Return mock data for demo purposes
    return getMockTrendingMovies(region);
  }
};

// Get trending movies for multiple regions
export const getTrendingMoviesByRegion = async (regions: string[] = [DEFAULT_REGION]): Promise<{[key: string]: Movie[]}> => {
  const results: {[key: string]: Movie[]} = {};
  
  // Use Promise.all to fetch data for all regions concurrently
  await Promise.all(
    regions.map(async (region) => {
      const movies = await getTrendingMovies(region);
      results[region] = movies;
    })
  );
  
  return results;
};

// Search movies
export const searchMovies = async (query: string, region: string = DEFAULT_REGION): Promise<Movie[]> => {
  // During build time, just return mock data to avoid API rate limiting
  if (typeof window === 'undefined') {
    return getMockSearchMovies(query, region);
  }
  
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${query}&region=${region}`
    );
    
    // Add region to each movie object
    const moviesWithRegion = response.data.results.map((movie: any) => ({
      ...movie,
      region
    }));
    
    return moviesWithRegion;
  } catch (error) {
    console.error('Error searching movies:', error);
    // Return mock data for demo purposes
    return getMockSearchMovies(query, region);
  }
};

// Search movies across multiple regions
export const searchMoviesMultiRegion = async (query: string, regions: string[] = [DEFAULT_REGION]): Promise<{[key: string]: Movie[]}> => {
  const results: {[key: string]: Movie[]} = {};
  
  // Use Promise.all to fetch data for all regions concurrently
  await Promise.all(
    regions.map(async (region) => {
      const movies = await searchMovies(query, region);
      results[region] = movies;
    })
  );
  
  return results;
};

// Get movie details from TMDB
export const getMovieDetails = async (id: number, region: string = DEFAULT_REGION): Promise<MovieDetails> => {
  // During build time, just return mock data to avoid API rate limiting
  if (typeof window === 'undefined') {
    return getMockMovieDetails(id, region);
  }
  
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,images,release_dates&region=${region}`
    );
    
    // Process the data to extract regional information
    const movieData = response.data;
    
    // Add region to the movie object
    movieData.region = region;
    
    // Extract regional release dates if available
    if (movieData.release_dates && movieData.release_dates.results) {
      const regionalReleases: RegionalRelease[] = movieData.release_dates.results.map((item: any) => {
        const regionInfo = SUPPORTED_REGIONS.find(r => r.code === item.iso_3166_1) || 
                          { code: item.iso_3166_1, name: item.iso_3166_1 };
        
        // Get the primary release date and certification for this region
        const primaryRelease = item.release_dates && item.release_dates.length > 0 ? 
                              item.release_dates[0] : { release_date: '', certification: '' };
        
        return {
          region_code: item.iso_3166_1,
          region_name: regionInfo.name,
          release_date: primaryRelease.release_date || '',
          certification: primaryRelease.certification || ''
        };
      });
      
      movieData.regional_releases = regionalReleases;
    }
    
    return movieData;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${id}:`, error);
    // Return mock data for demo purposes
    return getMockMovieDetails(id, region);
  }
};

// Get movie details for multiple regions
export const getMovieDetailsMultiRegion = async (id: number, regions: string[] = [DEFAULT_REGION]): Promise<{[key: string]: MovieDetails}> => {
  const results: {[key: string]: MovieDetails} = {};
  
  // Use Promise.all to fetch data for all regions concurrently
  await Promise.all(
    regions.map(async (region) => {
      const details = await getMovieDetails(id, region);
      results[region] = details;
    })
  );
  
  return results;
};

// Get movie details from OMDB
export const getOmdbData = async (imdbId: string): Promise<OmdbData> => {
  // During build time, just return mock data to avoid API rate limiting
  if (typeof window === 'undefined') {
    return getMockOmdbData();
  }
  
  try {
    const response = await axios.get(
      `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&i=${imdbId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching OMDB data for IMDB ID ${imdbId}:`, error);
    // Return mock data for demo purposes
    return getMockOmdbData();
  }
};

// Generate movie analysis
export const generateMovieAnalysis = (tmdb: MovieDetails, omdb: OmdbData): MovieAnalysis => {
  // In a real application, this would make a call to an AI service
  // For demo purposes, we'll return mock data
  return {
    verdict: "This critically acclaimed masterpiece blends stunning visuals with a thought-provoking narrative, earning widespread praise from both critics and audiences.",
    pros: [
      "Exceptional performances from the entire cast",
      "Stunning cinematography and visual effects",
      "Intriguing and original storyline",
      "Emotional depth and character development"
    ],
    cons: [
      "Complex narrative might be confusing for some viewers",
      "Pacing can feel slow in the middle act",
      "Some plot points left unresolved"
    ],
    recommendedAge: "13+",
    movieType: "Feature Film",
    detectedGenres: ["Sci-Fi", "Drama", "Adventure"]
  };
};

// Mock data for demonstration purposes
const getMockTrendingMovies = (region: string = DEFAULT_REGION): Movie[] => {
  // Base movies that are available in all regions
  const baseMovies = [
    {
      id: 1,
      title: "Inception",
      overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      poster_path: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      release_date: "2010-07-16",
      vote_average: 8.4,
      vote_count: 31345
    },
    {
      id: 2,
      title: "The Dark Knight",
      overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      poster_path: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
      release_date: "2008-07-18",
      vote_average: 8.5,
      vote_count: 28975
    },
    {
      id: 3,
      title: "Interstellar",
      overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      poster_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
      release_date: "2014-11-05",
      vote_average: 8.3,
      vote_count: 29530
    }
  ];
  
  // Add region to each movie
  const moviesWithRegion = baseMovies.map(movie => ({
    ...movie,
    region
  }));
  
  // Add region-specific movies
  if (region === 'IN') {
    // Indian movies
    moviesWithRegion.push({
      id: 101,
      title: "RRR",
      overview: "A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in the 1920s.",
      poster_path: "https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/original/zGLHX92Gk96O1DJvLil7ObJTbaL.jpg",
      release_date: "2022-03-24",
      vote_average: 7.8,
      vote_count: 1234,
      region: "IN",
      original_language: "te",
      original_title: "రౌద్రం రణం రుధిరం"
    });
  } else if (region === 'KR') {
    // Korean movies
    moviesWithRegion.push({
      id: 102,
      title: "Parasite",
      overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
      poster_path: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg",
      release_date: "2019-05-30",
      vote_average: 8.5,
      vote_count: 14567,
      region: "KR",
      original_language: "ko",
      original_title: "기생충"
    });
  } else if (region === 'JP') {
    // Japanese movies
    moviesWithRegion.push({
      id: 103,
      title: "Your Name",
      overview: "High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places.",
      poster_path: "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/original/mMtUybQ6hL24FXo0F3Z4j2KG7kZ.jpg",
      release_date: "2016-08-26",
      vote_average: 8.4,
      vote_count: 8765,
      region: "JP",
      original_language: "ja",
      original_title: "君の名は。"
    });
  } else if (region === 'FR') {
    // French movies
    moviesWithRegion.push({
      id: 104,
      title: "Amélie",
      overview: "At a tiny Parisian café, the adorable yet painfully shy Amélie accidentally discovers a gift for helping others.",
      poster_path: "https://image.tmdb.org/t/p/w500/f0uorE7K7ggHfr8r7pUTOmWRBHX.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/original/oQnXkAF5QWwmEX7xbMuHuISBXGE.jpg",
      release_date: "2001-04-25",
      vote_average: 7.9,
      vote_count: 9876,
      region: "FR",
      original_language: "fr",
      original_title: "Le Fabuleux Destin d'Amélie Poulain"
    });
  } else if (region === 'CN') {
    // Chinese movies
    moviesWithRegion.push({
      id: 105,
      title: "The Wandering Earth",
      overview: "When the Sun begins to expand and devour the Earth, humans build enormous engines to propel the planet to a new solar system, with a group of heroes fighting for the survival of humankind.",
      poster_path: "https://image.tmdb.org/t/p/w500/yHuTyYKaVqOw0VYQQesZgIoUUpX.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/original/w0tJot6O0UtLVBRIPAdg3dQ2oNO.jpg",
      release_date: "2019-02-05",
      vote_average: 7.3,
      vote_count: 1256,
      region: "CN",
      original_language: "zh",
      original_title: "流浪地球"
    });
  } else if (region === 'ES') {
    // Spanish movies
    moviesWithRegion.push({
      id: 106,
      title: "Pain and Glory",
      overview: "A film director reflects on the choices he's made in life as past and present come crashing down around him.",
      poster_path: "https://image.tmdb.org/t/p/w500/cMlueArJXXwZbeLpb4NhC3pxmJj.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/original/xVNQsS4LoQyZEpJ5mP7aBjXzYEH.jpg",
      release_date: "2019-03-22",
      vote_average: 7.5,
      vote_count: 1432,
      region: "ES",
      original_language: "es",
      original_title: "Dolor y Gloria"
    });
  } else if (region === 'BR') {
    // Brazilian movies
    moviesWithRegion.push({
      id: 107,
      title: "City of God",
      overview: "In the slums of Rio, two kids' paths diverge as one struggles to become a photographer and the other a kingpin.",
      poster_path: "https://image.tmdb.org/t/p/w500/k7eYdWvhYQyRQoU2TB2A2Xu2TfD.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/original/194dso1hBwQEgIU3fgS7mXHtFAj.jpg",
      release_date: "2002-05-18",
      vote_average: 8.6,
      vote_count: 5678,
      region: "BR",
      original_language: "pt",
      original_title: "Cidade de Deus"
    });
  } else if (region === 'RU') {
    // Russian movies
    moviesWithRegion.push({
      id: 108,
      title: "Leviathan",
      overview: "In a Russian coastal town, Kolya is forced to fight the corrupt mayor when he is told that his house will be demolished. He recruits a lawyer friend to help, but the man's arrival brings further misfortune for Kolya and his family.",
      poster_path: "https://image.tmdb.org/t/p/w500/jF2VxrxXzGGMsP0q6dEdlBPmj4H.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/original/kGMBqZFTXcVcQwT0XzCRiEgf0Ja.jpg",
      release_date: "2014-11-13",
      vote_average: 7.6,
      vote_count: 987,
      region: "RU",
      original_language: "ru",
      original_title: "Левиафан"
    });
  } else if (region === 'MX') {
    // Mexican movies
    moviesWithRegion.push({
      id: 109,
      title: "Roma",
      overview: "A story that chronicles a year in the life of a middle-class family in Mexico City in the early 1970s.",
      poster_path: "https://image.tmdb.org/t/p/w500/dtBUvPANbDYJwXm3aDJQSEEyoH3.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/original/hVP5A1wvkGqusVtXwHzHvXwGqJh.jpg",
      release_date: "2018-08-30",
      vote_average: 7.7,
      vote_count: 3456,
      region: "MX",
      original_language: "es",
      original_title: "Roma"
    });
  } else if (region === 'SE') {
    // Swedish movies
    moviesWithRegion.push({
      id: 110,
      title: "The Square",
      overview: "A prestigious Stockholm museum's chief art curator finds himself in times of both professional and personal crisis as he attempts to set up a controversial new exhibit.",
      poster_path: "https://image.tmdb.org/t/p/w500/8KeYYNe8hnKjxjujV9jGNDGlyDJ.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/original/zX2ynvmNh9x6xYAO81Q6Sh4XjlL.jpg",
      release_date: "2017-08-25",
      vote_average: 7.2,
      vote_count: 1234,
      region: "SE",
      original_language: "sv",
      original_title: "The Square"
    });
  }
  
  return moviesWithRegion;
};

const getMockSearchMovies = (query: string, region: string = DEFAULT_REGION): Movie[] => {
  // Create mock search results based on query and region
  const mockMovies = getMockTrendingMovies(region);
  return mockMovies.filter(movie => 
    movie.title.toLowerCase().includes(query.toLowerCase()) ||
    (movie.original_title && movie.original_title.toLowerCase().includes(query.toLowerCase()))
  );
};

const getMockMovieDetails = (id: number, region: string = DEFAULT_REGION): MovieDetails => {
  // Basic movie details from mock trending movies
  const mockMovie = getMockTrendingMovies(region).find(movie => movie.id === id);
  
  if (!mockMovie) {
    // Default to first movie if ID not found
    const defaultMovie = getMockTrendingMovies()[0];
    return {
      ...defaultMovie,
      tagline: "Your mind is the scene of the crime",
      status: "Released",
      budget: 160000000,
      revenue: 828322032,
      runtime: 148,
      genres: [
        { id: 28, name: "Action" },
        { id: 878, name: "Science Fiction" },
        { id: 12, name: "Adventure" }
      ],
      production_companies: [
        {
          id: 9996,
          name: "Syncopy",
          logo_path: "/5UQsZrfbfG2dYJbx8DxfoTr2Bvu.png"
        }
      ],
      videos: {
        results: [
          {
            key: "YoHD9XEInc0",
            site: "YouTube",
            type: "Trailer",
            name: "Official Trailer"
          }
        ]
      },
      credits: {
        cast: [
          {
            id: 6193,
            name: "Leonardo DiCaprio",
            character: "Dom Cobb",
            profile_path: "/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg"
          },
          {
            id: 24045,
            name: "Joseph Gordon-Levitt",
            character: "Arthur",
            profile_path: "/zSuXCR6xCKIL1TGP3PONhSwlDl.jpg"
          }
        ],
        crew: [
          {
            id: 525,
            name: "Christopher Nolan",
            job: "Director",
            profile_path: "/9NAZnTy82bolQ3QPAgjCpJaVTkZ.jpg"
          }
        ]
      },
      images: {
        backdrops: [
          {
            file_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
            width: 1920,
            height: 1080
          },
          {
            file_path: "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
            width: 1920,
            height: 1080
          }
        ]
      }
    };
  }
  
  return {
    ...mockMovie,
    tagline: "Your mind is the scene of the crime",
    status: "Released",
    budget: 160000000,
    revenue: 828322032,
    runtime: 148,
    genres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Science Fiction" },
      { id: 12, name: "Adventure" }
    ],
    production_companies: [
      {
        id: 9996,
        name: "Syncopy",
        logo_path: "/5UQsZrfbfG2dYJbx8DxfoTr2Bvu.png"
      }
    ],
    videos: {
      results: [
        {
          key: "YoHD9XEInc0",
          site: "YouTube",
          type: "Trailer",
          name: "Official Trailer"
        }
      ]
    },
    credits: {
      cast: [
        {
          id: 6193,
          name: "Leonardo DiCaprio",
          character: "Dom Cobb",
          profile_path: "/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg"
        },
        {
          id: 24045,
          name: "Joseph Gordon-Levitt",
          character: "Arthur",
          profile_path: "/zSuXCR6xCKIL1TGP3PONhSwlDl.jpg"
        }
      ],
      crew: [
        {
          id: 525,
          name: "Christopher Nolan",
          job: "Director",
          profile_path: "/9NAZnTy82bolQ3QPAgjCpJaVTkZ.jpg"
        }
      ]
    },
    images: {
      backdrops: [
        {
          file_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
          width: 1920,
          height: 1080
        },
        {
          file_path: "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
          width: 1920,
          height: 1080
        }
      ]
    }
  };
};

const getMockOmdbData = (): OmdbData => {
  return {
    Title: "Inception",
    Year: "2010",
    Rated: "PG-13",
    Released: "16 Jul 2010",
    Runtime: "148 min",
    Genre: "Action, Adventure, Sci-Fi",
    Director: "Christopher Nolan",
    Writer: "Christopher Nolan",
    Actors: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
    Plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    Language: "English, Japanese, French",
    Country: "USA, UK",
    Awards: "Won 4 Oscars. 157 wins & 220 nominations total",
    Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    Ratings: [
      {
        Source: "Internet Movie Database",
        Value: "8.8/10"
      },
      {
        Source: "Rotten Tomatoes",
        Value: "87%"
      },
      {
        Source: "Metacritic",
        Value: "74/100"
      }
    ],
    Metascore: "74",
    imdbRating: "8.8",
    imdbVotes: "2,234,659",
    imdbID: "tt1375666",
    Type: "movie",
    DVD: "07 Dec 2010",
    BoxOffice: "$292,587,330",
    Production: "Warner Bros. Pictures",
    Website: "N/A",
    Response: "True"
  };
};