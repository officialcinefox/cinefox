import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Calendar, Heart, Tv, User, MonitorPlay, Youtube, PlayCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MovieRow } from '../components/MovieRow';
import { Movie } from '../types';
import { DetailSkeleton } from '../components/Skeletons';

type MovieDetailProps = {
  mediaType?: 'movie' | 'tv';
};

export const MovieDetail: React.FC<MovieDetailProps> = ({ mediaType = 'movie' }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    user,
    toggleFavorite,
    isFavorite,
    getMovie,
    getSeries,
    movies,
    upcomingMovies,
    series,
    upcomingSeries,
    favoriteMovies,
    recentlyViewed,
    trackRecentlyViewed,
  } = useStore();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDetail = async () => {
       if (id) {
          const cachedMovie = [
            ...movies,
            ...upcomingMovies,
            ...series,
            ...upcomingSeries,
            ...favoriteMovies,
            ...recentlyViewed,
          ].find(item => item.id === id && (mediaType === 'movie' ? item.mediaType !== 'tv' : item.mediaType === 'tv')) || null;

          setMovie(cachedMovie);
          setLoading(!cachedMovie);
          window.scrollTo(0, 0);

          if (cachedMovie) {
            void trackRecentlyViewed(cachedMovie);
          }

          const data = mediaType === 'tv' ? await getSeries(id) : await getMovie(id);
          if (!isMounted) return;

          if (data) {
            setMovie(data);
            void trackRecentlyViewed(data);
          } else if (!cachedMovie) {
            setMovie(null);
          }
          setLoading(false);
       }
    };
    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [id, mediaType]);

  if (loading && !movie) {
      return <DetailSkeleton />;
  }

  if (!movie) {
    return (
        <div className="h-screen bg-netflix-black flex flex-col items-center justify-center text-white gap-4">
            <p className="text-2xl text-gray-400">Movie details not found</p>
            <button onClick={() => navigate('/')} className="bg-netflix-red text-white px-6 py-2 rounded font-bold hover:bg-red-700">Return Home</button>
        </div>
    );
  }

  const isFav = isFavorite(movie.id);
  
  // Use API recommendations if available, otherwise fallback to global store slice
  const recommendations = (movie.recommendations && movie.recommendations.length > 0) 
     ? movie.recommendations.slice(0, 10) 
     : movies.filter(m => m.id !== id).slice(0, 10);

  return (
    <div className="relative min-h-screen bg-netflix-black text-white overflow-x-hidden">
      {/* Background Hero - FIXED Full Screen behind content */}
      <div className="fixed inset-0 w-full h-full z-0">
         <img src={movie.backdropUrl} alt={movie.title} className="w-full h-full object-cover opacity-50" />
         <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
         <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/80 to-transparent" />
      </div>

      {/* Main Content Scrollable Wrapper */}
      <div className="relative z-10 pt-24 max-w-7xl mx-auto flex flex-col min-h-screen">
        
        {/* Top Section (Hero Details) */}
        <div className="px-4 md:px-12 mb-12">
            <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition group bg-black/30 p-2 rounded-full w-fit"
            >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
            </button>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start">
            {/* Poster */}
            <div className="w-64 md:w-80 flex-shrink-0 mx-auto md:mx-0 shadow-2xl rounded-lg overflow-hidden border border-zinc-700/50 bg-zinc-900">
                <img src={movie.posterUrl} alt={movie.title} className="w-full h-auto object-cover" />
            </div>

            {/* Content Info */}
            <div className="flex-1 space-y-6 md:pt-4">
                <div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-xl">{movie.title}</h1>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-gray-300">
                    <div className="flex items-center gap-2 text-white">
                        <Star className="text-yellow-400 fill-yellow-400" size={20} />
                        <span className="font-bold text-xl">{movie.rating}</span>
                        <span className="text-gray-500 text-sm">/10</span>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-800/60 px-3 py-1 rounded-full backdrop-blur-md border border-zinc-700">
                        <Calendar size={16} />
                        <span>{movie.year}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-800/60 px-3 py-1 rounded-full backdrop-blur-md border border-zinc-700">
                        <Clock size={16} />
                        <span>{movie.duration}</span>
                    </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {movie.genre.map(g => (
                        <span key={g} className="px-4 py-1.5 bg-zinc-800/40 border border-zinc-600 text-gray-200 rounded-full text-sm hover:border-netflix-red hover:text-white transition cursor-default">
                        {g}
                        </span>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 flex-wrap">
                    <button 
                        onClick={() => {
                          if (!user) {
                            navigate('/login');
                            return;
                          }
                          void toggleFavorite(movie.id, movie);
                        }}
                        className={`px-8 py-3.5 rounded font-bold flex items-center justify-center gap-2 transition shadow-lg border-2 w-full sm:w-auto ${isFav ? 'bg-white text-netflix-red border-white' : 'bg-netflix-red text-white border-netflix-red hover:bg-red-800 hover:border-red-800'}`}
                    >
                        <Heart size={20} fill={isFav ? '#E50914' : 'none'} stroke={isFav ? '#E50914' : 'currentColor'} /> 
                        {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>

                    {movie.teaserUrl && (
                      <a 
                        href={movie.teaserUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-8 py-3.5 rounded font-bold flex items-center justify-center gap-2 transition shadow-lg border-2 w-full sm:w-auto bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600"
                      >
                        <PlayCircle size={20} className="text-gray-300" />
                        Watch Teaser
                      </a>
                    )}

                    {movie.trailerUrl && (
                      <a 
                        href={movie.trailerUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-8 py-3.5 rounded font-bold flex items-center justify-center gap-2 transition shadow-lg border-2 w-full sm:w-auto bg-white text-black border-white hover:bg-gray-200 hover:border-gray-200"
                      >
                        <Youtube size={20} className="text-netflix-red" />
                        Watch Trailer
                      </a>
                    )}
                </div>
                
                {/* Watch Providers Section */}
                {movie.providers && movie.providers.length > 0 && (
                  <div className="mt-6 p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 backdrop-blur-md">
                     <h3 className="text-gray-400 text-sm mb-3 uppercase tracking-wider flex items-center gap-2 font-bold">
                       <MonitorPlay size={16} /> Available on
                     </h3>
                     <div className="flex gap-4 flex-wrap">
                       {movie.providers.map(provider => (
                         <div 
                           key={provider.provider_id} 
                           className="flex flex-col items-center gap-2 group select-none cursor-default" 
                           title={`Available on ${provider.provider_name}`}
                         >
                            <img src={provider.logo_path} alt={provider.provider_name} className="w-12 h-12 rounded-lg shadow-md border border-transparent group-hover:border-white transition" />
                            <span className="text-[10px] text-gray-400 group-hover:text-white text-center max-w-[60px] truncate">{provider.provider_name}</span>
                         </div>
                       ))}
                     </div>
                  </div>
                )}

                <div className="bg-zinc-900/60 p-6 rounded-xl border border-zinc-800 backdrop-blur-md shadow-xl">
                    <h3 className="text-xl font-semibold mb-3 text-netflix-red">Overview</h3>
                    <p className="text-gray-200 leading-relaxed text-lg">
                        {movie.description}
                    </p>
                </div>

                {/* Director & Cast */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                    <div>
                        <h3 className="text-gray-400 text-sm mb-3 uppercase tracking-wider flex items-center gap-2"><Tv size={14}/> {mediaType === 'tv' ? 'Creator' : 'Director'}</h3>
                        <p className="font-medium text-lg text-white">{movie.director}</p>
                    </div>
                    
                    <div>
                        <h3 className="text-gray-400 text-sm mb-3 uppercase tracking-wider flex items-center gap-2"><User size={14}/> Top Cast</h3>
                        <div className="flex flex-wrap gap-3">
                        {movie.cast && movie.cast.length > 0 ? (
                            movie.cast.slice(0, 5).map(person => (
                                <Link 
                                  to={`/person/${person.id}`} 
                                  key={person.id} 
                                  className="flex items-center gap-2 bg-zinc-900/80 pr-3 rounded-full border border-zinc-700/50 hover:bg-zinc-800 hover:border-netflix-red transition cursor-pointer"
                                >
                                    {person.profile_path ? (
                                    <img src={person.profile_path} alt={person.name} className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs">{person.name[0]}</div>
                                    )}
                                    <span className="text-sm font-medium">{person.name}</span>
                                </Link>
                            ))
                        ) : (
                            <span className="text-gray-400">Cast info unavailable</span>
                        )}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>

        {/* Lower Section with Solid Background - Ensures Footer Visibility */}
        <div className="bg-[#141414] w-full px-4 md:px-12 py-12 border-t border-zinc-800 mt-auto shadow-[0_-20px_40px_rgba(20,20,20,1)]">
           <div className="max-w-7xl mx-auto">
               <MovieRow title="You Might Also Like" movies={recommendations} />
           </div>
        </div>
      </div>
    </div>
  );
};
