import React from 'react';
import { useStore } from '../context/StoreContext';
import { MovieCard } from '../components/MovieCard';
import { Heart, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Favorites = () => {
  const { user, isAuthLoading, favoriteMovies } = useStore();

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-netflix-black pt-24">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-netflix-red border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-24 text-center">
        <div className="mb-6 rounded-full bg-zinc-800 p-6">
          <Lock size={48} className="text-gray-400" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Sign in to view your list</h1>
        <p className="mb-8 max-w-md text-gray-400">
          Favorites now save with your account, so your list follows you after login.
        </p>
        <Link to="/login" className="rounded bg-netflix-red px-8 py-3 font-bold text-white transition hover:bg-red-700">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-24 md:px-12">
      <div className="mb-8 flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-netflix-red">Account Library</p>
        <h1 className="text-3xl font-bold">My List</h1>
        <p className="text-sm text-gray-400">{favoriteMovies.length} saved movies</p>
      </div>

      {favoriteMovies.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 gap-y-8 pb-20 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {favoriteMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="flex h-[50vh] flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 rounded-full bg-zinc-800 p-6">
            <Heart size={48} className="text-gray-400" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">You haven't added any favorites yet</h2>
          <p className="mb-8 max-w-md text-gray-400">
            Mark movies as favorites to save them to your Supabase account.
          </p>
          <Link to="/movies" className="rounded bg-white px-8 py-3 font-bold text-black transition hover:bg-gray-200">
            Browse Movies
          </Link>
        </div>
      )}
    </div>
  );
};
