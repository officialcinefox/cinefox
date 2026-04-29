import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MovieRow } from '../components/MovieRow';
import { AutoScrollRow } from '../components/AutoScrollRow';
import { MOVIE_CATEGORIES } from '../constants';
import { HeroSkeleton } from '../components/Skeletons';

export const Home = () => {
  const { movies, upcomingMovies, recentlyReleasedMovies, isLoading, selectedCategory, fetchMoviesByCategory } = useStore();
  const heroMovies = useMemo(() => movies.slice(0, 5), [movies]);
  const [heroIndex, setHeroIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setHeroIndex(0);
  }, [selectedCategory]);

  useEffect(() => {
    if (heroMovies.length < 2) return;

    const timer = window.setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroMovies.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [heroMovies.length]);

  useEffect(() => {
    if (heroIndex >= heroMovies.length) {
      setHeroIndex(0);
    }
  }, [heroIndex, heroMovies.length]);

  if (isLoading && movies.length === 0) {
    return <HeroSkeleton />;
  }

  const heroMovie = heroMovies[heroIndex] ?? movies[0] ?? null;

  // If still no movie
  if (!heroMovie) {
    return (
      <div className="h-screen bg-netflix-black flex items-center justify-center text-gray-400">
        No movies available right now.
      </div>
    );
  }

  const categories = MOVIE_CATEGORIES;

  // Slicing data for rows
  const trendingMovies = movies.slice(0, 10);
  const topRatedMovies = movies.slice(5, 15);
  const autoScrollMovies = movies.slice(0, 15);

  const truncate = (str: string, n: number) => {
    return str?.length > n ? str.substring(0, n - 1) : str;
  };

  return (
    <div className="pb-20 overflow-x-hidden bg-netflix-black">
      {/* Hero Section */}
      <div className="relative min-h-[380px] md:min-h-[480px] lg:min-h-[540px] w-full mb-8 flex flex-col justify-end overflow-hidden pt-24 pb-8 md:pt-28 md:pb-12 lg:pb-16">
        
        {/* Banner Image - Absolute Background */}
        <div className="absolute inset-0 z-0">
           {/* Unified Image (Backdrop/Landscape) for ALL screens */}
           {heroMovies.map((movie, index) => (
             <img
               key={movie.id}
               src={movie.backdropUrl}
               alt={movie.title}
               className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ${
                 index === heroIndex ? 'opacity-100' : 'opacity-0'
               }`}
             />
           ))}
           
           {/* Heavy Gradients for Readability */}
           <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
           <div className="absolute bottom-0 left-0 right-0 h-[90%] bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent" />
        </div>

        {/* Content - Relative to Flex Container */}
        <div className="relative z-20 w-full px-4 md:px-12 flex flex-col items-start">
           <div className="max-w-2xl space-y-3 md:space-y-5">
              <div className="flex items-center gap-3">
                  <span className="inline-block px-2 py-0.5 md:py-1 bg-netflix-red text-white text-[10px] md:text-xs font-bold rounded uppercase tracking-wider shadow-md">Featured</span>
                  <span className="inline-block px-2 py-0.5 md:py-1 bg-white/10 backdrop-blur-md text-gray-200 text-[10px] md:text-xs font-bold rounded uppercase tracking-wider border border-white/20">{selectedCategory}</span>
              </div>
              
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] drop-shadow-lg line-clamp-2 md:line-clamp-3">
                {heroMovie.title}
              </h1>
              
              <div className="flex items-center gap-4 text-gray-300 text-[10px] md:text-base font-medium">
                <div className="flex items-center gap-1 text-yellow-400">
                    <Star size={12} fill="currentColor" className="md:w-4 md:h-4" />
                    <span className="font-bold text-white">{heroMovie.rating}</span>
                </div>
                <span>{heroMovie.year}</span>
                <span>{heroMovie.duration}</span>
              </div>

              {/* Description with Truncation and Read More */}
              <div className="text-sm md:text-lg text-gray-300 max-w-xl leading-relaxed drop-shadow-md">
                <span>
                  {truncate(heroMovie.description, 150)}
                </span>
                {heroMovie.description.length > 150 && (
                  <>
                    <span>... </span>
                    <button 
                      onClick={() => navigate(`/movie/${heroMovie.id}`)}
                      className="text-netflix-red font-bold hover:underline ml-1"
                    >
                      Read More
                    </button>
                  </>
                )}
              </div>
              
              <div className="pt-1 md:pt-4">
                  <button 
                    onClick={() => navigate(`/movie/${heroMovie.id}`)}
                    className="bg-netflix-red text-white px-4 md:px-8 py-2 md:py-3.5 rounded font-bold flex items-center gap-2 hover:bg-red-700 transition shadow-lg transform hover:scale-105 active:scale-95 duration-200 text-xs md:text-base"
                  >
                    View Details <ChevronRight size={14} className="md:w-5 md:h-5" />
                  </button>
              </div>

              {heroMovies.length > 1 && (
                <div className="flex items-center gap-2 pt-2">
                  {heroMovies.map((movie, index) => (
                    <button
                      key={movie.id}
                      type="button"
                      onClick={() => setHeroIndex(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === heroIndex ? 'w-8 bg-white' : 'w-3 bg-white/35 hover:bg-white/60'
                      }`}
                      aria-label={`Show featured movie ${index + 1}`}
                    />
                  ))}
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Category Filter Row */}
      <div className="px-4 md:px-12 relative z-30 mb-6 md:mb-10">
         <div className="flex items-center justify-start gap-3 overflow-x-auto no-scrollbar py-2">
            {categories.map(cat => (
               <button
                  key={cat}
                  onClick={() => fetchMoviesByCategory(cat)}
                  className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full font-medium text-xs md:text-sm whitespace-nowrap transition-all duration-300 border ${
                     selectedCategory === cat 
                     ? 'bg-white text-black border-white scale-105 shadow-lg' 
                     : 'bg-zinc-800 text-gray-300 border-zinc-700 hover:border-white hover:text-white'
                  }`}
               >
                  {cat}
               </button>
            ))}
         </div>
      </div>

      {/* Rows */}
      <div className="px-4 md:px-12 relative z-20 space-y-12 md:space-y-16">
        
        {/* Upcoming Section */}
        {upcomingMovies.length > 0 && (
           <MovieRow title={`Upcoming ${selectedCategory === 'All' ? 'Movies' : selectedCategory}`} movies={upcomingMovies} hideRating />
        )}

        <MovieRow title="Recently Released" movies={recentlyReleasedMovies} />

        <MovieRow title={`Trending in ${selectedCategory}`} movies={trendingMovies} />
        
        {/* Auto Scrolling Section */}
        <AutoScrollRow title="Top Picks For You" movies={autoScrollMovies} />
        
        <MovieRow title="Critics Choice" movies={topRatedMovies} />
      </div>
    </div>
  );
};
