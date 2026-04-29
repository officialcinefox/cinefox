import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Info, Star } from 'lucide-react';
import { Movie } from '../types';
import { useStore } from '../context/StoreContext';

interface MovieCardProps {
  movie: Movie;
  hideRating?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, hideRating = false }) => {
  const { user, isFavorite, toggleFavorite } = useStore();
  const navigate = useNavigate();
  const isFav = isFavorite(movie.id);
  const detailPath = movie.mediaType === 'tv' ? `/series/${movie.id}` : `/movie/${movie.id}`;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    void toggleFavorite(movie.id, movie);
  };

  return (
    <div className="relative group/card cursor-pointer w-full h-full">
      {/* Card Container */}
      <div className="relative overflow-hidden rounded-lg aspect-[2/3] transition-all duration-300 ease-out md:group-hover/card:scale-[1.03] md:group-hover/card:-translate-y-1 md:group-hover/card:z-50 shadow-lg md:group-hover/card:shadow-2xl bg-zinc-900 border border-zinc-800/50">
        
        {/* Poster Image */}
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-500"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/85 to-transparent p-2 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 group-focus-within/card:opacity-100 sm:p-3 md:p-4">
          <div className="translate-y-3 transition-transform duration-300 group-hover/card:translate-y-0 group-focus-within/card:translate-y-0">
            <h3 className="mb-1 line-clamp-2 text-xs font-bold leading-tight text-white drop-shadow-md sm:text-sm md:mb-2 md:text-lg">
              {movie.title}
            </h3>

            <div className="mb-2 flex items-center gap-2 text-[10px] text-gray-300 md:mb-4 md:text-xs">
              <span className="rounded bg-zinc-800/90 px-1.5 py-0.5 font-semibold text-white md:px-2">
                {movie.year}
              </span>
              {!hideRating && (
                <div className="flex items-center gap-1 font-bold text-yellow-400">
                  <Star size={11} fill="currentColor" className="md:h-3 md:w-3" />
                  <span>{movie.rating}</span>
                </div>
              )}
            </div>

            <div className="flex w-full items-center justify-center gap-1 rounded bg-white px-2 py-2 text-[11px] font-bold text-black transition hover:bg-gray-200 md:text-xs">
              <Info size={14} /> View Info
            </div>
          </div>
        </div>

        <Link
          to={detailPath}
          aria-label={`View details for ${movie.title}`}
          className="absolute inset-0 z-20"
        />

        <button
          onClick={handleFavoriteClick}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute left-2 top-2 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/75 text-white opacity-0 backdrop-blur-md transition hover:bg-black group-hover/card:opacity-100 group-focus-within/card:opacity-100"
        >
          <Heart size={16} fill={isFav ? '#E50914' : 'none'} stroke={isFav ? '#E50914' : 'currentColor'} />
        </button>

        {movie.providerTag && (
          <div className="absolute right-2 top-2 z-30 max-w-[72%] rounded bg-netflix-red px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
            {movie.providerTag}
          </div>
        )}
      </div>
    </div>
  );
};
