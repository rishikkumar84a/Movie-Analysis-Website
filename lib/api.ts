import axios from 'axios';

// API keys directly included for development purposes
// In production, these should be environment variables
const TMDB_API_KEY = '1b4126b986b05b3b5a5ea09a86276211';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const OMDB_API_KEY = '6abe85c6';
const OMDB_BASE_URL = 'https://www.omdbapi.com';

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
export const getTrendingMovies = async (): Promise<Movie[]> => {
  // During build time, just return mock data to avoid API rate limiting
  if (typeof window === 'undefined') {
    return getMockTrendingMovies();
  }

  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`
    );
    return response.data.results;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    // Return mock data for demo purposes
    return getMockTrendingMovies();
  }
};

// Search movies
export const searchMovies = async (query: string): Promise<Movie[]> => {
  // During build time, just return mock data to avoid API rate limiting
  if (typeof window === 'undefined') {
    return getMockSearchMovies(query);
  }
  
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${query}`
    );
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    // Return mock data for demo purposes
    return getMockSearchMovies(query);
  }
};

// Get movie details from TMDB
export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
  // During build time, just return mock data to avoid API rate limiting
  if (typeof window === 'undefined') {
    return getMockMovieDetails(id);
  }
  
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,images`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${id}:`, error);
    // Return mock data for demo purposes
    return getMockMovieDetails(id);
  }
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
const getMockTrendingMovies = (): Movie[] => {
  return [
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
};

const getMockSearchMovies = (query: string): Movie[] => {
  // Create mock search results based on query
  const mockMovies = getMockTrendingMovies();
  return mockMovies.filter(movie => 
    movie.title.toLowerCase().includes(query.toLowerCase())
  );
};

const getMockMovieDetails = (id: number): MovieDetails => {
  // Basic movie details from mock trending movies
  const mockMovie = getMockTrendingMovies().find(movie => movie.id === id);
  
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