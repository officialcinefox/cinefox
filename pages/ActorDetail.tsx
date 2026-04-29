import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MovieCard } from '../components/MovieCard';
import { Actor, Movie } from '../types';
import { DetailSkeleton } from '../components/Skeletons';

export const ActorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getActor, getActorMovies } = useStore();
  const navigate = useNavigate();
  
  const [actor, setActor] = useState<Actor | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const [actorData, movieData] = await Promise.all([
          getActor(id),
          getActorMovies(id)
        ]);
        setActor(actorData);
        setMovies(movieData);
      } catch (error) {
        console.error('Error loading actor data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id, getActor, getActorMovies]);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!actor) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <h2 className="text-2xl font-bold">Actor not found</h2>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 rounded bg-netflix-red px-6 py-2 font-bold transition hover:bg-red-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const profileImageUrl = actor.profile_path 
    ? `https://image.tmdb.org/t/p/original${actor.profile_path}`
    : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80';

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20 text-white">
      {/* Background Blur Effect */}
      <div className="fixed inset-0 z-0">
        <img 
          src={profileImageUrl} 
          className="h-full w-full object-cover opacity-10 blur-3xl"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-[#0a0a0a]/80 to-[#0a0a0a]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 md:px-8 md:pt-32">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-gray-400 transition hover:text-white"
        >
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>

        <div className="grid gap-12 lg:grid-cols-[350px_1fr]">
          {/* Profile Sidebar */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <img 
                src={profileImageUrl} 
                className="aspect-[2/3] w-full object-cover"
                alt={actor.name}
              />
            </div>
            
            <div className="space-y-4 rounded-xl bg-white/5 p-6 backdrop-blur-md">
              <h3 className="text-lg font-bold text-netflix-red">Personal Info</h3>
              
              <div className="space-y-3">
                {actor.birthday && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar size={18} className="text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Birthday</p>
                      <p className="text-sm">{new Date(actor.birthday).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                )}
                
                {actor.place_of_birth && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin size={18} className="text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Place of Birth</p>
                      <p className="text-sm">{actor.place_of_birth}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-gray-300">
                  <div className="flex h-[18px] w-[18px] items-center justify-center text-[10px] font-bold text-gray-500 border border-gray-500 rounded">DEPT</div>
                  <div>
                    <p className="text-xs text-gray-500">Known For</p>
                    <p className="text-sm">{actor.known_for_department}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-12">
            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tighter md:text-7xl">{actor.name}</h1>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-netflix-red">Biography</h3>
                <div className="relative">
                  <p className={`text-lg leading-relaxed text-gray-300 ${!showFullBio && actor.biography.length > 500 ? 'line-clamp-6' : ''}`}>
                    {actor.biography || `We don't have a biography for ${actor.name} yet.`}
                  </p>
                  {!showFullBio && actor.biography.length > 500 && (
                    <button 
                      onClick={() => setShowFullBio(true)}
                      className="mt-2 font-bold text-white hover:text-netflix-red transition"
                    >
                      Read More
                    </button>
                  )}
                  {showFullBio && (
                    <button 
                      onClick={() => setShowFullBio(false)}
                      className="mt-2 font-bold text-white hover:text-netflix-red transition"
                    >
                      Show Less
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Filmography Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Known For</h3>
                <span className="text-sm text-gray-500">{movies.length} Movies</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                {movies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              {movies.length === 0 && (
                <p className="text-gray-500 italic">No movies found for this actor.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
