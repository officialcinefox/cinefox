import React from 'react';
import { MovieCard } from './MovieCard';
import { Movie } from '../types';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  hideRating?: boolean;
}

export const MovieRow: React.FC<MovieRowProps> = ({ title, movies, hideRating = false }) => {
  if (movies.length === 0) return null;
  return (
    <div className="space-y-6">
      <h2 className="text-lg md:text-2xl font-semibold text-white border-l-4 border-netflix-red pl-3">{title}</h2>
      {/* 
          Grid Configuration:
          grid-cols-3: Mobile -> 3 cards per row (Updated from 2)
          sm:grid-cols-3: Tablet -> 3 cards per row
          md:grid-cols-4: Laptop -> 4 cards per row
          lg:grid-cols-5: Desktop -> 5 cards per row
      */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} hideRating={hideRating} />
        ))}
      </div>
    </div>
  );
};
