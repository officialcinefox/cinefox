import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Clock, Edit3, Heart, Lock, Mail, Save, Tags, UserRound, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MovieCard } from '../components/MovieCard';

export const Profile = () => {
  const { user, isAuthLoading, favoriteMovies, favoriteGenres, recentlyViewed, updateProfile } = useStore();
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatarUrl(user.avatarUrl || null);
      setNote(user.note || '');
    }
  }, [user]);

  const openEditor = () => {
    if (!user) return;
    setName(user.name);
    setAvatarUrl(user.avatarUrl || null);
    setNote(user.note || '');
    setStatus('');
    setError('');
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    if (isSaving) return;
    setIsEditorOpen(false);
    setError('');
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(typeof reader.result === 'string' ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('');
    setError('');

    try {
      setIsSaving(true);
      await updateProfile({ name, avatarUrl, note });
      setStatus('Profile updated.');
      setIsEditorOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update profile.');
    } finally {
      setIsSaving(false);
    }
  };

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
        <h1 className="mb-2 text-3xl font-bold">Your profile is private</h1>
        <p className="mb-8 max-w-md text-gray-400">
          Sign in to see your saved movies, favorite genres, and recently viewed titles.
        </p>
        <Link to="/login" className="rounded bg-netflix-red px-8 py-3 font-bold text-white transition hover:bg-red-700">
          Sign In
        </Link>
      </div>
    );
  }

  const stats = [
    { label: 'Saved Movies', value: favoriteMovies.length, icon: Heart },
    { label: 'Favorite Genres', value: favoriteGenres.length, icon: Tags },
    { label: 'Recently Viewed', value: recentlyViewed.length, icon: Clock },
  ];
  const displayAvatarUrl = user.avatarUrl || null;

  return (
    <div className="min-h-screen bg-netflix-black px-4 pb-20 pt-24 text-white md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <section className="flex flex-col gap-8 border-b border-zinc-800 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-netflix-red text-4xl font-black text-white shadow-lg">
              {displayAvatarUrl ? (
                <img src={displayAvatarUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-netflix-red">CineFox Profile</p>
              <h1 className="text-3xl font-bold md:text-5xl">{user.name}</h1>
              <div className="mt-3 flex items-center gap-2 text-gray-400">
                <Mail size={16} />
                <span>{user.email}</span>
              </div>
              {user.note && <p className="mt-3 max-w-2xl text-sm text-gray-300">{user.note}</p>}
              {status && <p className="mt-3 text-sm font-semibold text-emerald-400">{status}</p>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openEditor}
              className="flex items-center gap-2 rounded border border-zinc-700 bg-zinc-900 px-5 py-3 font-bold text-white transition hover:border-white hover:bg-zinc-800"
            >
              <Edit3 size={17} /> Edit Profile
            </button>
            <Link to="/favorites" className="rounded bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-200">
              Open My List
            </Link>
          </div>
        </section>

        {isEditorOpen && (
          <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm">
            <aside className="profile-panel-slide ml-auto flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-zinc-800 bg-[#111] shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800 p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-netflix-red">Account</p>
                  <h2 className="mt-1 text-xl font-bold">Edit Profile</h2>
                </div>
                <button
                  type="button"
                  onClick={closeEditor}
                  className="rounded-full p-2 text-gray-300 transition hover:bg-zinc-800 hover:text-white"
                  aria-label="Close profile editor"
                >
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-1 flex-col gap-5 p-5">
                {error && <div className="rounded bg-[#e87c03] p-3 text-sm text-white">{error}</div>}

                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-netflix-red text-3xl font-black text-white">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={name || user.name} className="h-full w-full object-cover" />
                    ) : (
                      (name || user.name).charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="flex h-10 cursor-pointer items-center gap-2 rounded bg-zinc-800 px-4 text-sm font-semibold text-gray-200 transition hover:bg-zinc-700">
                      <Camera size={16} /> Choose Photo
                      <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </label>
                    {avatarUrl && (
                      <button type="button" onClick={() => setAvatarUrl(null)} className="text-left text-sm text-gray-400 hover:text-white">
                        Remove photo
                      </button>
                    )}
                  </div>
                </div>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Name</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="h-11 w-full rounded bg-zinc-950 px-3 text-white outline-none ring-1 ring-zinc-800 transition focus:ring-netflix-red"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Note</span>
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={5}
                    placeholder="Add a short profile note..."
                    className="w-full resize-none rounded bg-zinc-950 px-3 py-3 text-white outline-none ring-1 ring-zinc-800 transition placeholder:text-gray-600 focus:ring-netflix-red"
                  />
                </label>

                <div className="mt-auto flex gap-3 border-t border-zinc-800 pt-5">
                  <button
                    type="button"
                    onClick={closeEditor}
                    disabled={isSaving}
                    className="h-11 flex-1 rounded bg-zinc-800 font-bold text-gray-200 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded bg-netflix-red font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Save size={16} /> {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </aside>
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-zinc-800 text-netflix-red">
                  <Icon size={20} />
                </div>
                <p className="text-3xl font-black">{item.value}</p>
                <p className="mt-1 text-sm text-gray-400">{item.label}</p>
                {item.label === 'Favorite Genres' && favoriteGenres.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {favoriteGenres.slice(0, 4).map(genre => (
                      <span key={genre} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-gray-200">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <Tags size={20} className="text-netflix-red" />
            <h2 className="text-2xl font-bold">Favorite Genres</h2>
          </div>
          {favoriteGenres.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {favoriteGenres.map(genre => (
                <span key={genre} className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-gray-200">
                  {genre}
                </span>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-6 text-gray-400">
              Save movies or webseries with genre data and your top genres will appear here.
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <Clock size={20} className="text-netflix-red" />
            <h2 className="text-2xl font-bold">Recently Viewed</h2>
          </div>
          {recentlyViewed.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {recentlyViewed.slice(0, 6).map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-6 text-gray-400">
              Open movie details to build your viewing history.
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <UserRound size={20} className="text-netflix-red" />
            <h2 className="text-2xl font-bold">Saved Titles</h2>
          </div>
          {favoriteMovies.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {favoriteMovies.slice(0, 6).map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-6 text-gray-400">
              Your saved titles will appear here after you tap the heart on any card.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
