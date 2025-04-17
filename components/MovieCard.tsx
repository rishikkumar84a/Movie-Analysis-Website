"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiStar, FiBookmark } from 'react-icons/fi';
import { useState } from 'react';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  year: string;
  rating: number;
  isInWatchlist?: boolean;
}

export default function MovieCard({
  id,
  title,
  posterPath,
  year,
  rating,
  isInWatchlist = false
}: MovieCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(isInWatchlist);
  const [isHovered, setIsHovered] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    // In a real app, you would save this to user's watchlist in database
  };

  return (
    <motion.div
      className="card bg-white dark:bg-dark-700"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/movie/${id}`} className="block relative">
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-xl">
          <Image
            src={posterPath || '/images/movie-placeholder.jpg'}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          {/* Rating badge */}
          <div className="absolute top-2 left-2 bg-black/70 text-yellow-400 rounded-full px-2 py-1 text-xs font-semibold flex items-center">
            <FiStar className="mr-1" />
            {rating.toFixed(1)}
          </div>
          {/* Bookmark button */}
          <button
            onClick={handleBookmark}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isBookmarked 
                ? 'bg-primary-600 text-white' 
                : 'bg-black/70 text-white hover:bg-primary-600'
            }`}
            aria-label={isBookmarked ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            <FiBookmark className={isBookmarked ? 'fill-current' : ''} />
          </button>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{year}</p>
        </div>
      </Link>
    </motion.div>
  );
} 