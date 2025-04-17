# MovieInsight - Movie Analysis Website

A responsive and modern website that provides in-depth insights and analysis for movies worldwide. The platform collects and displays data such as average ratings, reviews, and comments from multiple sources (e.g., IMDb, Rotten Tomatoes, Metacritic, Letterboxd) and generates comprehensive analyses.

## Live Demo

Check out the live demo at: [https://movie-insights-iota.vercel.app/](https://movie-insights-iota.vercel.app/)

This project is hosted on [Vercel](https://vercel.com/).

## Features

### Core Features
- **Movie Summary Page**:
  - Title, year, and poster
  - Average rating (aggregated from various platforms)
  - User comments/reviews
  - AI-generated movie analysis including:
    - Overall verdict
    - Pros and cons
    - Recommended watching age
    - Movie type
    - Genre detection
  - Trailer embed and image gallery
  - Cast and crew details
  - Release information

### Advanced Features
- **Search & Autocomplete**: Smart search bar with suggestions
- **Comparison Tool**: Compare up to 3 movies side-by-side
- **Watchlist/Bookmarking**: Save movies to a personal watchlist
- **Dark Mode Toggle**: Switch between light and dark themes
- **Responsive Design**: Mobile-first approach for all screen sizes

## Tech Stack
- **Frontend**: Next.js with TypeScript, Tailwind CSS, Framer Motion
- **API Integration**: TMDB API, OMDB API
- **UI Design**: Modern neumorphic & glassmorphism styles

## Getting Started

### Prerequisites
- Node.js (version 16.x or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/movie-analysis.git
cd movie-analysis
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your API keys:
```
TMDB_API_KEY=your_tmdb_api_key_here
OMDB_API_KEY=your_omdb_api_key_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
movie-analysis/
├── app/                  # Next.js App Router
│   ├── compare/          # Movie comparison page
│   ├── movie/[id]/       # Individual movie page
│   ├── search/           # Search results page
│   ├── trending/         # Trending movies page
│   ├── watchlist/        # User's watchlist page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/           # Reusable UI components
├── lib/                  # Utility functions and API services
├── public/               # Static assets
├── styles/               # Additional styles
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Project dependencies
```

## Customization

### Themes
The website includes built-in dark mode support. Users can toggle between light and dark themes using the theme switcher in the header.

### API Keys
To use the movie data APIs, you'll need to obtain API keys from:
- [TMDB (The Movie Database)](https://developers.themoviedb.org/3/getting-started/introduction)
- [OMDB API](http://www.omdbapi.com/apikey.aspx)

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- [The Movie Database (TMDB)](https://www.themoviedb.org/) for movie data
- [OMDB API](http://www.omdbapi.com/) for additional movie information
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations