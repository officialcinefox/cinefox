import React from 'react';
import { MovieCard } from './MovieCard';
import { Movie } from '../types';

interface AutoScrollRowProps {
  title: string;
  movies: Movie[];
}

export const AutoScrollRow: React.FC<AutoScrollRowProps> = ({ title, movies }) => {
  // Duplicate movies to create seamless loop
  const displayMovies = [...movies, ...movies];

  return (
    <div className="space-y-6 overflow-hidden">
      {/* Fixed Alignment: Removed ml-4 md:ml-12 and px-4 md:px-12 to align with other rows */}
      <h2 className="text-lg md:text-2xl font-semibold text-white border-l-4 border-netflix-red pl-3">{title}</h2>
      
      {/* 
          Container for the scrolling track.
          pause-on-hover stops the animation when hovering the ROW.
          The cards themselves have isolated hover states (group/card) so they scale individually.
          py-16 adds safety margin for scaling cards.
      */}
      <div className="relative w-full overflow-hidden py-10 md:py-16">
        <div className="flex gap-6 animate-scroll w-max pause-on-hover px-4">
           {displayMovies.map((movie, index) => (
             <div key={`${movie.id}-scroll-${index}`} className="w-[160px] md:w-[220px] flex-shrink-0 relative z-10 hover:z-20">
                <MovieCard movie={movie} />
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};