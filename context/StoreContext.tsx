import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useRef } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, Movie, CastMember, WatchProvider, Actor } from '../types';
import { MOCK_MOVIES, OTT_PROVIDERS } from '../constants';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface StoreContextType {
  user: User | null;
  isAuthLoading: boolean;
  authError: string;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (updates: { name: string; avatarUrl?: string | null; note?: string }) => Promise<void>;
  logout: () => Promise<void>;
  favorites: string[];
  favoriteMovies: Movie[];
  recentlyViewed: Movie[];
  favoriteGenres: string[];
  toggleFavorite: (movieId: string, movie?: Movie) => Promise<void>;
  isFavorite: (movieId: string) => boolean;
  trackRecentlyViewed: (movie: Movie) => Promise<void>;
  movies: Movie[];
  upcomingMovies: Movie[];
  recentlyReleasedMovies: Movie[];
  series: Movie[];
  upcomingSeries: Movie[];
  recentlyReleasedSeries: Movie[];
  selectedSeriesCategory: string;
  ottTitles: Movie[];
  upcomingOttTitles: Movie[];
  recentlyReleasedOttTitles: Movie[];
  selectedOttProvider: string;
  discoverMovies: (filters: DiscoverFilters) => Promise<void>;
  searchMovies: (query: string) => Promise<void>;
  getSearchSuggestions: (query: string) => Promise<Movie[]>;
  getMovie: (id: string) => Promise<Movie | null>;
  getSeries: (id: string) => Promise<Movie | null>;
  getActor: (id: string) => Promise<Actor | null>;
  getActorMovies: (id: string) => Promise<Movie[]>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  fetchMoviesByCategory: (category: string) => Promise<void>;
  fetchSeriesByCategory: (category: string) => Promise<void>;
  fetchOttByProvider: (provider: string) => Promise<void>;
}

type ProfileRow = {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  note?: string | null;
};

type FavoriteRow = {
  movie_id: string;
  movie_data: Movie;
};

type RecentlyViewedRow = {
  movie_id: string;
  movie_data: Movie;
};

export type DiscoverFilters = {
  genre: string;
  year: string;
  rating: string;
  language: string;
  sort: string;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// TMDB Configuration
// API key is accessed via environment variable, with a working fallback for immediate demo usage.
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '15d2ea6d0dc1d476efbca3eba2b9bbfb';
const TMDB_BASE_URLS = ['https://api.tmdb.org/3', 'https://api.themoviedb.org/3'];
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const TMDB_TIMEOUT_MS = 5000;

type CategoryFilter = {
  language?: string;
  genre?: number;
  excludeGenre?: number;
};

type ProviderMeta = {
  value: string;
  label: string;
  shortLabel: string;
  providerId?: number;
};

const CATEGORY_FILTERS: Record<string, CategoryFilter> = {
  Bollywood: { language: 'hi' },
  Hollywood: { language: 'en' },
  Tollywood: { language: 'te' },
  Korean: { language: 'ko' },
  Japanese: { language: 'ja', excludeGenre: 16 },
  Anime: { language: 'ja', genre: 16 },
  Cartoon: { genre: 16 },
  Adventure: { genre: 12 },
  'Science Fiction': { genre: 878 },
  Fantasy: { genre: 14 },
  Comedy: { genre: 35 },
  Horror: { genre: 27 },
};

const TMDB_GENRES_BY_ID: Record<number, string> = {
  12: 'Adventure',
  14: 'Fantasy',
  16: 'Animation',
  18: 'Drama',
  27: 'Horror',
  28: 'Action',
  35: 'Comedy',
  36: 'History',
  37: 'Western',
  53: 'Thriller',
  80: 'Crime',
  99: 'Documentary',
  878: 'Science Fiction',
  9648: 'Mystery',
  10402: 'Music',
  10749: 'Romance',
  10751: 'Family',
  10752: 'War',
  10770: 'TV Movie',
};

const TMDB_GENRE_IDS_BY_NAME = Object.entries(TMDB_GENRES_BY_ID).reduce<Record<string, number>>(
  (acc, [id, name]) => {
    acc[name] = Number(id);
    return acc;
  },
  {}
);

const getLocalDate = (offsetDays = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const buildTmdbParams = (params: Record<string, string> = {}) => {
  return new URLSearchParams({
    api_key: API_KEY,
    ...params,
  });
};

const buildTmdbUrl = (baseUrl: string, path: string, params: URLSearchParams) => {
  const query = params.toString();
  return `${baseUrl}${path}${query ? `?${query}` : ''}`;
};

const fetchTmdb = async (path: string, params: URLSearchParams): Promise<Response> => {
  let lastError: unknown;

  for (const baseUrl of TMDB_BASE_URLS) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), TMDB_TIMEOUT_MS);

    try {
      const response = await fetch(buildTmdbUrl(baseUrl, path, params), {
        signal: controller.signal,
      });

      if (response.ok) {
        return response;
      }

      lastError = new Error(`TMDB API Error: ${response.status}`);
      if (response.status === 401 || response.status === 403) {
        break;
      }
    } catch (error) {
      lastError = error;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Could not reach TMDB API.');
};

const buildDiscoverParams = (
  category: string,
  releaseFilter: 'released' | 'upcoming',
  mediaType: 'movie' | 'tv' = 'movie',
  sortMode: 'popular' | 'recent' = 'popular'
) => {
  const releaseField = mediaType === 'tv' ? 'first_air_date' : 'primary_release_date';

  const params = buildTmdbParams({
    include_adult: 'false',
    include_video: 'false',
    page: '1',
    sort_by: sortMode === 'recent' ? `${releaseField}.desc` : 'popularity.desc',
  });

  const filter = CATEGORY_FILTERS[category];
  if (filter?.language) {
    params.set('with_original_language', filter.language);
  }
  if (filter?.genre) {
    params.set('with_genres', String(filter.genre));
  }
  if (filter?.excludeGenre) {
    params.set('without_genres', String(filter.excludeGenre));
  }

  if (releaseFilter === 'upcoming') {
    params.set(`${releaseField}.gte`, getLocalDate(1));
  } else {
    params.set(`${releaseField}.lte`, getLocalDate());
    if (sortMode === 'recent') {
      params.set(`${releaseField}.gte`, getLocalDate(-540));
    }
  }

  return params;
};

const buildAdvancedDiscoverParams = (filters: DiscoverFilters) => {
  const sortBy: Record<string, string> = {
    popular: 'popularity.desc',
    newest: 'primary_release_date.desc',
    rating: 'vote_average.desc',
    alphabetical: 'original_title.asc',
  };

  const params = buildTmdbParams({
    include_adult: 'false',
    include_video: 'false',
    page: '1',
    sort_by: sortBy[filters.sort] || 'popularity.desc',
    'primary_release_date.lte': getLocalDate(),
  });

  if (filters.genre !== 'all') {
    const genreId = TMDB_GENRE_IDS_BY_NAME[filters.genre];
    if (genreId) {
      params.set('with_genres', String(genreId));
    }
  }

  if (filters.language !== 'all') {
    params.set('with_original_language', filters.language);
  }

  if (filters.rating !== 'all') {
    params.set('vote_average.gte', filters.rating);
  }

  if (filters.year === '2020s') {
    params.set('primary_release_date.gte', '2020-01-01');
    params.set('primary_release_date.lte', '2029-12-31');
  } else if (filters.year === '2010s') {
    params.set('primary_release_date.gte', '2010-01-01');
    params.set('primary_release_date.lte', '2019-12-31');
  } else if (filters.year === 'older') {
    params.set('primary_release_date.lte', '2009-12-31');
  } else if (filters.year !== 'all') {
    params.set('primary_release_year', filters.year);
    params.delete('primary_release_date.lte');
  }

  return params;
};

const buildOttParams = (
  providerId: number,
  mediaType: 'movie' | 'tv',
  releaseFilter: 'released' | 'upcoming',
  sortMode: 'popular' | 'recent' | 'rating' = 'popular'
) => {
  const dateField = mediaType === 'tv' ? 'first_air_date' : 'primary_release_date';
  const sortBy: Record<string, string> = {
    popular: 'popularity.desc',
    recent: `${dateField}.desc`,
    rating: 'vote_average.desc',
  };

  const params = buildTmdbParams({
    include_adult: 'false',
    include_video: 'false',
    page: '1',
    sort_by: sortBy[sortMode] || 'popularity.desc',
    watch_region: 'IN',
    with_watch_providers: String(providerId),
  });

  if (releaseFilter === 'upcoming') {
    params.set(`${dateField}.gte`, getLocalDate(1));
  } else {
    params.set(`${dateField}.lte`, getLocalDate());
    if (sortMode === 'recent') {
      params.set(`${dateField}.gte`, getLocalDate(-540));
    }
  }

  return params;
};

const getResults = (payload: any): any[] => {
  return Array.isArray(payload?.results) ? payload.results : [];
};

const getReleaseYear = (data: any): number => {
  const releaseDate = data.release_date || data.first_air_date;
  const year = Number.parseInt(String(releaseDate || '').slice(0, 4), 10);
  return Number.isFinite(year) ? year : new Date().getFullYear();
};

const getGenreNames = (data: any): string[] => {
  if (Array.isArray(data.genres)) {
    return data.genres.map((genre: any) => genre.name).filter(Boolean);
  }

  if (Array.isArray(data.genre_ids)) {
    return data.genre_ids
      .map((id: number) => TMDB_GENRES_BY_ID[id])
      .filter(Boolean);
  }

  return [];
};

const isFutureRelease = (data: any): boolean => {
  const releaseDate = String(data.release_date || data.first_air_date || '');
  return releaseDate >= getLocalDate(1);
};

const normalizeGenre = (genre: string): string => genre.toLowerCase().replace(/[^a-z0-9]/g, '');

const genreNameForId = (id?: number): string => {
  if (!id) return '';
  return TMDB_GENRES_BY_ID[id] || '';
};

const movieMatchesCategory = (movie: Movie, category: string): boolean => {
  if (category === 'All') return true;

  const filter = CATEGORY_FILTERS[category];
  if (!filter) return true;

  if (filter.language && movie.original_language && movie.original_language !== filter.language) {
    return false;
  }

  const normalizedGenres = movie.genre.map(normalizeGenre);

  if (filter.genre) {
    const requiredGenre = normalizeGenre(genreNameForId(filter.genre));
    if (requiredGenre && !normalizedGenres.includes(requiredGenre)) {
      return false;
    }
  }

  if (filter.excludeGenre) {
    const excludedGenre = normalizeGenre(genreNameForId(filter.excludeGenre));
    if (excludedGenre && normalizedGenres.includes(excludedGenre)) {
      return false;
    }
  }

  return true;
};

const uniqueMovies = (items: Movie[]): Movie[] => {
  const seen = new Set<string>();
  return items.filter(item => {
    const key = `${item.mediaType || 'movie'}-${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const getImmediateCategoryMovies = (items: Movie[], category: string): Movie[] => {
  return uniqueMovies(items).filter(movie => movieMatchesCategory(movie, category)).slice(0, 20);
};

const sortByNewestYear = (items: Movie[]): Movie[] => {
  return [...items].sort((a, b) => b.year - a.year || b.rating - a.rating);
};

const getOttProvider = (provider: string): ProviderMeta | undefined => {
  return OTT_PROVIDERS.find(item => item.value === provider);
};

const getActiveOttProviders = (provider: string): ProviderMeta[] => {
  if (provider === 'All') {
    return OTT_PROVIDERS.filter(item => item.providerId);
  }

  const selected = getOttProvider(provider);
  return selected?.providerId ? [selected] : [];
};

const getFutureMockMovies = (): Movie[] => {
  const currentYear = new Date().getFullYear();
  return MOCK_MOVIES
    .filter(movie => movie.year > currentYear)
    .sort((a, b) => a.year - b.year);
};

const isMovie = (value: unknown): value is Movie => {
  const movie = value as Movie;
  return Boolean(movie && typeof movie.id === 'string' && typeof movie.title === 'string');
};

const getDisplayName = (account: SupabaseUser): string => {
  const metadataName = account.user_metadata?.name;
  if (typeof metadataName === 'string' && metadataName.trim()) {
    return metadataName.trim();
  }
  return account.email?.split('@')[0] || 'CineFox User';
};

const getProfileNoteKey = (userId: string) => `cinefox_profile_note_${userId}`;

const getStoredProfileNote = (userId: string): string => {
  try {
    return window.localStorage.getItem(getProfileNoteKey(userId)) || '';
  } catch {
    return '';
  }
};

const setStoredProfileNote = (userId: string, note: string) => {
  try {
    window.localStorage.setItem(getProfileNoteKey(userId), note);
  } catch (error) {
    console.warn('Could not save profile note locally.', error);
  }
};

const getTopGenres = (favoriteMovies: Movie[]): string[] => {
  const counts = new Map<string, number>();

  favoriteMovies.forEach(movie => {
    movie.genre.forEach(genre => {
      counts.set(genre, (counts.get(genre) || 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 6)
    .map(([genre]) => genre);
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- Auth & Account State ---
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Movie[]>([]);

  const favorites = useMemo(() => favoriteMovies.map(movie => movie.id), [favoriteMovies]);
  const favoriteGenres = useMemo(() => getTopGenres(favoriteMovies), [favoriteMovies]);

  const getSupabaseClient = () => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }
    return supabase;
  };

  const mapProfileToUser = (account: SupabaseUser, profile?: ProfileRow | null): User => {
    return {
      id: account.id,
      name: profile?.name || getDisplayName(account),
      email: profile?.email || account.email || '',
      avatarUrl: profile?.avatar_url || null,
      note: profile?.note || getStoredProfileNote(account.id),
    };
  };

  const loadAccountData = async (account: SupabaseUser) => {
    const client = getSupabaseClient();
    const fallbackName = getDisplayName(account);
    const fallbackEmail = account.email || '';

    const { data: profile, error: profileError } = await client
      .from('profiles')
      .select('id, name, email, avatar_url')
      .eq('id', account.id)
      .maybeSingle<ProfileRow>();

    if (profileError) {
      console.warn('Could not load profile.', profileError);
    }

    if (!profile) {
      const { error: upsertError } = await client.from('profiles').upsert({
        id: account.id,
        name: fallbackName,
        email: fallbackEmail,
      });

      if (upsertError) {
        console.warn('Could not create profile row.', upsertError);
      }
    }

    const [favoritesResult, recentResult] = await Promise.all([
      client
        .from('favorites')
        .select('movie_id, movie_data')
        .eq('user_id', account.id)
        .order('created_at', { ascending: false }),
      client
        .from('recently_viewed')
        .select('movie_id, movie_data')
        .eq('user_id', account.id)
        .order('viewed_at', { ascending: false })
        .limit(12),
    ]);

    if (favoritesResult.error) {
      console.warn('Could not load favorites.', favoritesResult.error);
    }
    if (recentResult.error) {
      console.warn('Could not load recently viewed movies.', recentResult.error);
    }

    const favoriteRows = (favoritesResult.data || []) as FavoriteRow[];
    const recentRows = (recentResult.data || []) as RecentlyViewedRow[];

    setUser(mapProfileToUser(account, profile));
    setFavoriteMovies(favoriteRows.map(row => row.movie_data).filter(isMovie));
    setRecentlyViewed(recentRows.map(row => row.movie_data).filter(isMovie));
    setAuthError('');
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsAuthLoading(false);
      setAuthError('Supabase is not configured yet.');
      return;
    }

    let isMounted = true;

    const syncSession = async (account: SupabaseUser | null) => {
      try {
        if (!isMounted) return;

        if (!account) {
          setUser(null);
          setFavoriteMovies([]);
          setRecentlyViewed([]);
          setAuthError('');
          return;
        }

        await loadAccountData(account);
      } catch (error) {
        console.error('Auth session sync failed.', error);
        setAuthError(error instanceof Error ? error.message : 'Could not sync your account.');
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      void syncSession(data.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      void syncSession(session?.user || null);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const client = getSupabaseClient();
    setAuthError('');

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
      throw error;
    }

    if (data.user) {
      await loadAccountData(data.user);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const client = getSupabaseClient();
    setAuthError('');

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setAuthError(error.message);
      throw error;
    }

    if (!data.user) {
      const message = 'Account created, but Supabase did not return a user session.';
      setAuthError(message);
      throw new Error(message);
    }

    await client.from('profiles').upsert({
      id: data.user.id,
      name,
      email,
    });

    await loadAccountData(data.user);
  };

  const resetPassword = async (email: string) => {
    const client = getSupabaseClient();
    setAuthError('');

    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });

    if (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const updatePassword = async (password: string) => {
    const client = getSupabaseClient();
    setAuthError('');

    const { error } = await client.auth.updateUser({ password });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const updateProfile = async (updates: { name: string; avatarUrl?: string | null; note?: string }) => {
    if (!user) {
      throw new Error('Please sign in to update your profile.');
    }

    const nextUser: User = {
      ...user,
      name: updates.name.trim() || user.name,
      avatarUrl: updates.avatarUrl ?? user.avatarUrl ?? null,
      note: updates.note?.trim() || '',
    };

    setUser(nextUser);
    setStoredProfileNote(user.id, nextUser.note || '');

    try {
      const client = getSupabaseClient();
      const { error } = await client.from('profiles').upsert({
        id: user.id,
        name: nextUser.name,
        email: user.email,
        avatar_url: nextUser.avatarUrl,
      });

      if (error) {
        throw error;
      }

      await client.auth.updateUser({
        data: { name: nextUser.name, avatar_url: nextUser.avatarUrl },
      });
    } catch (error) {
      console.warn('Could not save profile to Supabase. Keeping local profile changes for this browser.', error);
      if (error instanceof Error) {
        setAuthError(error.message);
      }
    }
  };

  const logout = async () => {
    const client = getSupabaseClient();
    await client.auth.signOut();
    setUser(null);
    setFavoriteMovies([]);
    setRecentlyViewed([]);
    setAuthError('');
  };

  // --- Favorites State ---
  const findMovieById = (movieId: string, preferredMovie?: Movie): Movie | null => {
    return (
      preferredMovie ||
      movies.find(movie => movie.id === movieId) ||
      upcomingMovies.find(movie => movie.id === movieId) ||
      recentlyReleasedMovies.find(movie => movie.id === movieId) ||
      series.find(movie => movie.id === movieId) ||
      upcomingSeries.find(movie => movie.id === movieId) ||
      recentlyReleasedSeries.find(movie => movie.id === movieId) ||
      ottTitles.find(movie => movie.id === movieId) ||
      upcomingOttTitles.find(movie => movie.id === movieId) ||
      recentlyReleasedOttTitles.find(movie => movie.id === movieId) ||
      favoriteMovies.find(movie => movie.id === movieId) ||
      recentlyViewed.find(movie => movie.id === movieId) ||
      MOCK_MOVIES.find(movie => movie.id === movieId) ||
      null
    );
  };

  const toggleFavorite = async (movieId: string, movie?: Movie) => {
    if (!user) {
      setAuthError('Please sign in to save favorites.');
      return;
    }

    const client = getSupabaseClient();
    const movieToSave = findMovieById(movieId, movie);

    if (!movieToSave) {
      setAuthError('Movie details are still loading. Try again in a moment.');
      return;
    }

    const wasFavorite = favorites.includes(movieId);
    const previousFavoriteMovies = favoriteMovies;

    if (wasFavorite) {
      setFavoriteMovies(prev => prev.filter(item => item.id !== movieId));

      const { error } = await client
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId);

      if (error) {
        setFavoriteMovies(previousFavoriteMovies);
        setAuthError(error.message);
        console.warn('Could not remove favorite.', error);
      }
      return;
    }

    setFavoriteMovies(prev => [movieToSave, ...prev.filter(item => item.id !== movieId)]);

    const { error } = await client.from('favorites').upsert(
      {
        user_id: user.id,
        movie_id: movieId,
        movie_data: movieToSave,
      },
      { onConflict: 'user_id,movie_id' }
    );

    if (error) {
      setFavoriteMovies(previousFavoriteMovies);
      setAuthError(error.message);
      console.warn('Could not save favorite.', error);
    }
  };

  const isFavorite = (movieId: string) => favorites.includes(movieId);

  const trackRecentlyViewed = async (movie: Movie) => {
    if (!user) return;

    const client = getSupabaseClient();
    setRecentlyViewed(prev => [movie, ...prev.filter(item => item.id !== movie.id)].slice(0, 12));

    const { error } = await client.from('recently_viewed').upsert(
      {
        user_id: user.id,
        movie_id: movie.id,
        movie_data: movie,
        viewed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,movie_id' }
    );

    if (error) {
      console.warn('Could not save recently viewed movie.', error);
    }
  };

  // --- Movies & API State ---
  const [movies, setMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [recentlyReleasedMovies, setRecentlyReleasedMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Movie[]>([]);
  const [upcomingSeries, setUpcomingSeries] = useState<Movie[]>([]);
  const [recentlyReleasedSeries, setRecentlyReleasedSeries] = useState<Movie[]>([]);
  const [ottTitles, setOttTitles] = useState<Movie[]>([]);
  const [upcomingOttTitles, setUpcomingOttTitles] = useState<Movie[]>([]);
  const [recentlyReleasedOttTitles, setRecentlyReleasedOttTitles] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeriesCategory, setSelectedSeriesCategory] = useState('All');
  const [selectedOttProvider, setSelectedOttProvider] = useState('All');
  const activeMovieCategoryRef = useRef('All');
  const activeSeriesCategoryRef = useRef('All');
  const activeOttProviderRef = useRef('All');
  const movieCategoryCache = useRef<Record<string, Movie[]>>({});
  const upcomingMovieCache = useRef<Record<string, Movie[]>>({});
  const recentMovieCache = useRef<Record<string, Movie[]>>({});
  const seriesCategoryCache = useRef<Record<string, Movie[]>>({});
  const upcomingSeriesCache = useRef<Record<string, Movie[]>>({});
  const recentSeriesCache = useRef<Record<string, Movie[]>>({});
  const ottProviderCache = useRef<Record<string, Movie[]>>({});
  const upcomingOttCache = useRef<Record<string, Movie[]>>({});
  const recentOttCache = useRef<Record<string, Movie[]>>({});

  // Helper: Map TMDB Data to Movie Interface
  const mapToMovie = (data: any, mediaType: 'movie' | 'tv' = 'movie', provider?: ProviderMeta): Movie => {
    const title = data.title || data.name || 'Untitled';
    const rating = Number(data.vote_average);
    const runtime = Number(data.runtime || data.episode_run_time?.[0]);
    const seasonCount = Number(data.number_of_seasons);

    return {
      id: String(data.id ?? `${title}-${getReleaseYear(data)}`),
      title, // TMDB uses 'title' for movies, 'name' for TV
      posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'https://via.placeholder.com/300x450/141414/808080?text=No+Poster',
      backdropUrl: data.backdrop_path ? `${IMAGE_BASE_URL}${data.backdrop_path}` : 'https://via.placeholder.com/1920x1080/141414/808080?text=No+Image',
      rating: Number.isFinite(rating) ? Number(rating.toFixed(1)) : 0,
      year: getReleaseYear(data),
      duration: Number.isFinite(seasonCount) && seasonCount > 0
        ? `${seasonCount} ${seasonCount === 1 ? 'Season' : 'Seasons'}`
        : Number.isFinite(runtime) && runtime > 0 ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : 'N/A',
      genre: getGenreNames(data),
      description: data.overview || 'No overview available.',
      director: 'Unknown', // Populated in details fetch
      cast: [], // Populated in details fetch
      original_language: data.original_language,
      providerId: provider?.providerId,
      providerTag: provider?.shortLabel,
      mediaType,
      seasons: Number.isFinite(seasonCount) ? seasonCount : undefined
    };
  };

  // Helper: Sort movies so that those with valid images appear first
  const sortMoviesByImage = (moviesList: Movie[]): Movie[] => {
    return [...moviesList].sort((a, b) => {
      const aHasImage = !a.posterUrl.includes('via.placeholder.com');
      const bHasImage = !b.posterUrl.includes('via.placeholder.com');

      if (aHasImage && !bHasImage) return -1; // a comes first
      if (!aHasImage && bHasImage) return 1;  // b comes first
      return 0; // maintain relative order
    });
  };

  // Fetch initial data
  useEffect(() => {
    fetchMoviesByCategory('All');
  }, []);

  const fetchUpcomingMovies = async (category: string = 'All') => {
    if (!API_KEY) {
      console.warn("TMDB API Key is missing. Upcoming movies will fallback to mock data.");
      const fallback = getFutureMockMovies();
      upcomingMovieCache.current[category] = fallback;
      if (activeMovieCategoryRef.current === category) {
        setUpcomingMovies(fallback);
      }
      return;
    }

    try {
      const response = await fetchTmdb('/discover/movie', buildDiscoverParams(category, 'upcoming'));
      if (response.ok) {
        const data = await response.json();
        const mapped = getResults(data).filter(isFutureRelease).map(item => mapToMovie(item));

        // Filter: Keep ONLY movies that have a real poster (no placeholders)
        const withPostersOnly = sortMoviesByImage(mapped.filter((m: Movie) => !m.posterUrl.includes('via.placeholder.com')));

        upcomingMovieCache.current[category] = withPostersOnly;
        if (activeMovieCategoryRef.current === category) {
          setUpcomingMovies(withPostersOnly);
        }
      } else {
        // Fallback logic for upcoming
        const fallback = getFutureMockMovies();
        upcomingMovieCache.current[category] = fallback;
        if (activeMovieCategoryRef.current === category) {
          setUpcomingMovies(fallback);
        }
      }
    } catch (e) {
      console.error("Failed to fetch upcoming movies");
      const fallback = getFutureMockMovies();
      upcomingMovieCache.current[category] = fallback;
      if (activeMovieCategoryRef.current === category) {
        setUpcomingMovies(fallback);
      }
    }
  };

  const fetchRecentlyReleasedMovies = async (category: string = 'All') => {
    if (!API_KEY) {
      const fallback = sortByNewestYear(getImmediateCategoryMovies(MOCK_MOVIES, category));
      recentMovieCache.current[category] = fallback;
      if (activeMovieCategoryRef.current === category) {
        setRecentlyReleasedMovies(fallback);
      }
      return;
    }

    try {
      const response = await fetchTmdb('/discover/movie', buildDiscoverParams(category, 'released', 'movie', 'recent'));
      const data = await response.json();
      const mapped = getResults(data).map(item => mapToMovie(item));
      const released = sortMoviesByImage(mapped.filter(item => !item.posterUrl.includes('via.placeholder.com')));
      recentMovieCache.current[category] = released;
      if (activeMovieCategoryRef.current === category) {
        setRecentlyReleasedMovies(released);
      }
    } catch (error) {
      console.warn('Failed to fetch recently released movies.', error);
      const fallback = sortByNewestYear(getImmediateCategoryMovies(MOCK_MOVIES, category));
      recentMovieCache.current[category] = fallback;
      if (activeMovieCategoryRef.current === category) {
        setRecentlyReleasedMovies(fallback);
      }
    }
  };

  const fetchMoviesByCategory = async (category: string) => {
    activeMovieCategoryRef.current = category;
    setIsLoading(true);
    setSelectedCategory(category);
    setSearchQuery('');

    const cachedMovies = movieCategoryCache.current[category];
    const immediateMovies = cachedMovies ?? getImmediateCategoryMovies(
      [...movies, ...recentlyReleasedMovies, ...upcomingMovies, ...MOCK_MOVIES],
      category
    );
    setMovies(immediateMovies);
    setUpcomingMovies(upcomingMovieCache.current[category] ?? []);
    setRecentlyReleasedMovies(recentMovieCache.current[category] ?? []);

    // Also update the upcoming list when category changes
    void fetchUpcomingMovies(category);
    void fetchRecentlyReleasedMovies(category);

    if (!API_KEY) {
      console.warn("TMDB API Key is missing. Using mock data.");
      const fallback = getImmediateCategoryMovies(MOCK_MOVIES, category);
      movieCategoryCache.current[category] = fallback;
      if (activeMovieCategoryRef.current === category) {
        setMovies(fallback);
      }
      setIsLoading(false);
      return;
    }

    try {
      const response = category === 'All'
        ? await fetchTmdb('/trending/movie/week', buildTmdbParams())
        : await fetchTmdb('/discover/movie', buildDiscoverParams(category, 'released'));
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      const data = await response.json();
      const mapped = getResults(data).map(item => mapToMovie(item));
      const nextMovies = sortMoviesByImage(mapped);
      movieCategoryCache.current[category] = nextMovies;
      if (activeMovieCategoryRef.current === category) {
        setMovies(nextMovies);
      }
    } catch (error) {
      console.warn("Failed to fetch from TMDB, using mock data fallback.", error);
      // Fallback to mock data if API fails
      const fallback = getImmediateCategoryMovies(MOCK_MOVIES, category);
      movieCategoryCache.current[category] = fallback;
      if (activeMovieCategoryRef.current === category) {
        setMovies(fallback);
      }
    } finally {
      if (activeMovieCategoryRef.current === category) {
        setIsLoading(false);
      }
    }
  };

  const fetchUpcomingSeries = async (category: string = 'All') => {
    if (!API_KEY) {
      const fallback = getImmediateCategoryMovies(MOCK_MOVIES, category)
        .slice(0, 6)
        .map(movie => ({ ...movie, mediaType: 'tv' as const }));
      upcomingSeriesCache.current[category] = fallback;
      if (activeSeriesCategoryRef.current === category) {
        setUpcomingSeries(fallback);
      }
      return;
    }

    try {
      const response = await fetchTmdb('/discover/tv', buildDiscoverParams(category, 'upcoming', 'tv'));
      const data = await response.json();
      const mapped = getResults(data).filter(isFutureRelease).map(item => mapToMovie(item, 'tv'));
      const upcoming = sortMoviesByImage(mapped.filter(item => !item.posterUrl.includes('via.placeholder.com')));
      upcomingSeriesCache.current[category] = upcoming;
      if (activeSeriesCategoryRef.current === category) {
        setUpcomingSeries(upcoming);
      }
    } catch (error) {
      console.warn('Failed to fetch upcoming webseries.', error);
      const fallback = getImmediateCategoryMovies(MOCK_MOVIES, category)
        .slice(0, 6)
        .map(movie => ({ ...movie, mediaType: 'tv' as const }));
      upcomingSeriesCache.current[category] = fallback;
      if (activeSeriesCategoryRef.current === category) {
        setUpcomingSeries(fallback);
      }
    }
  };

  const fetchRecentlyReleasedSeries = async (category: string = 'All') => {
    if (!API_KEY) {
      const fallback = sortByNewestYear(getImmediateCategoryMovies(MOCK_MOVIES, category))
        .map(movie => ({ ...movie, mediaType: 'tv' as const }));
      recentSeriesCache.current[category] = fallback;
      if (activeSeriesCategoryRef.current === category) {
        setRecentlyReleasedSeries(fallback);
      }
      return;
    }

    try {
      const response = await fetchTmdb('/discover/tv', buildDiscoverParams(category, 'released', 'tv', 'recent'));
      const data = await response.json();
      const mapped = getResults(data).map(item => mapToMovie(item, 'tv'));
      const released = sortMoviesByImage(mapped.filter(item => !item.posterUrl.includes('via.placeholder.com')));
      recentSeriesCache.current[category] = released;
      if (activeSeriesCategoryRef.current === category) {
        setRecentlyReleasedSeries(released);
      }
    } catch (error) {
      console.warn('Failed to fetch recently released webseries.', error);
      const fallback = sortByNewestYear(getImmediateCategoryMovies(MOCK_MOVIES, category))
        .map(movie => ({ ...movie, mediaType: 'tv' as const }));
      recentSeriesCache.current[category] = fallback;
      if (activeSeriesCategoryRef.current === category) {
        setRecentlyReleasedSeries(fallback);
      }
    }
  };

  const fetchSeriesByCategory = async (category: string) => {
    activeSeriesCategoryRef.current = category;
    setIsLoading(true);
    setSelectedSeriesCategory(category);
    const cachedSeries = seriesCategoryCache.current[category];
    const immediateSeries = cachedSeries ?? getImmediateCategoryMovies(
      [...series, ...recentlyReleasedSeries, ...upcomingSeries, ...MOCK_MOVIES.map(movie => ({ ...movie, mediaType: 'tv' as const }))],
      category
    );
    setSeries(immediateSeries.map(movie => ({ ...movie, mediaType: 'tv' as const })));
    setUpcomingSeries(upcomingSeriesCache.current[category] ?? []);
    setRecentlyReleasedSeries(recentSeriesCache.current[category] ?? []);

    void fetchUpcomingSeries(category);
    void fetchRecentlyReleasedSeries(category);

    if (!API_KEY) {
      const fallback = getImmediateCategoryMovies(MOCK_MOVIES, category)
        .map(movie => ({ ...movie, mediaType: 'tv' as const }));
      seriesCategoryCache.current[category] = fallback;
      if (activeSeriesCategoryRef.current === category) {
        setSeries(fallback);
      }
      setIsLoading(false);
      return;
    }

    try {
      const response = category === 'All'
        ? await fetchTmdb('/trending/tv/week', buildTmdbParams())
        : await fetchTmdb('/discover/tv', buildDiscoverParams(category, 'released', 'tv'));
      const data = await response.json();
      const mapped = getResults(data).map(item => mapToMovie(item, 'tv'));
      const nextSeries = sortMoviesByImage(mapped);
      seriesCategoryCache.current[category] = nextSeries;
      if (activeSeriesCategoryRef.current === category) {
        setSeries(nextSeries);
      }
    } catch (error) {
      console.warn('Failed to fetch webseries from TMDB, using fallback.', error);
      const fallback = getImmediateCategoryMovies(MOCK_MOVIES, category)
        .map(movie => ({ ...movie, mediaType: 'tv' as const }));
      seriesCategoryCache.current[category] = fallback;
      if (activeSeriesCategoryRef.current === category) {
        setSeries(fallback);
      }
    } finally {
      if (activeSeriesCategoryRef.current === category) {
        setIsLoading(false);
      }
    }
  };

  const getMockOttItems = (provider: string): Movie[] => {
    const providers = getActiveOttProviders(provider);
    const activeProviders = providers.length > 0 ? providers : OTT_PROVIDERS.filter(item => item.providerId);

    return MOCK_MOVIES.map((movie, index) => {
      const providerMeta = activeProviders[index % activeProviders.length];
      return {
        ...movie,
        mediaType: index % 3 === 0 ? 'tv' as const : 'movie' as const,
        providerId: providerMeta?.providerId,
        providerTag: providerMeta?.shortLabel,
      };
    });
  };

  const fetchOttProviderItems = async (
    provider: string,
    releaseFilter: 'released' | 'upcoming',
    sortMode: 'popular' | 'recent' | 'rating'
  ): Promise<Movie[]> => {
    const providers = getActiveOttProviders(provider);
    if (providers.length === 0) {
      return getMockOttItems(provider);
    }

    const requests = providers.flatMap(providerMeta =>
      (['movie', 'tv'] as const).map(async mediaType => {
        if (!providerMeta.providerId) return [];

        const response = await fetchTmdb(
          `/discover/${mediaType}`,
          buildOttParams(providerMeta.providerId, mediaType, releaseFilter, sortMode)
        );
        const data = await response.json();
        return getResults(data).map(item => mapToMovie(item, mediaType, providerMeta));
      })
    );

    const settled = await Promise.allSettled(requests);
    const items = settled.flatMap(result => result.status === 'fulfilled' ? result.value : []);
    const withPosters = items.filter(item => !item.posterUrl.includes('via.placeholder.com'));
    const ordered = sortMode === 'rating'
      ? [...withPosters].sort((a, b) => b.rating - a.rating || b.year - a.year)
      : sortMode === 'recent'
        ? sortByNewestYear(withPosters)
        : withPosters;

    return sortMoviesByImage(uniqueMovies(ordered)).slice(0, 24);
  };

  const fetchOttByProvider = async (provider: string) => {
    activeOttProviderRef.current = provider;
    setSelectedOttProvider(provider);
    setIsLoading(true);

    setOttTitles(ottProviderCache.current[provider] ?? getMockOttItems(provider));
    setUpcomingOttTitles(upcomingOttCache.current[provider] ?? []);
    setRecentlyReleasedOttTitles(recentOttCache.current[provider] ?? []);

    if (!API_KEY) {
      const fallback = getMockOttItems(provider);
      ottProviderCache.current[provider] = fallback;
      recentOttCache.current[provider] = sortByNewestYear(fallback);
      upcomingOttCache.current[provider] = [];
      if (activeOttProviderRef.current === provider) {
        setOttTitles(fallback);
        setRecentlyReleasedOttTitles(recentOttCache.current[provider]);
        setUpcomingOttTitles([]);
        setIsLoading(false);
      }
      return;
    }

    try {
      const [popular, upcoming, recent] = await Promise.all([
        fetchOttProviderItems(provider, 'released', 'popular'),
        fetchOttProviderItems(provider, 'upcoming', 'popular'),
        fetchOttProviderItems(provider, 'released', 'recent'),
      ]);

      ottProviderCache.current[provider] = popular;
      upcomingOttCache.current[provider] = upcoming;
      recentOttCache.current[provider] = recent;

      if (activeOttProviderRef.current === provider) {
        setOttTitles(popular);
        setUpcomingOttTitles(upcoming);
        setRecentlyReleasedOttTitles(recent);
      }
    } catch (error) {
      console.warn('Failed to fetch OTT titles from TMDB, using fallback.', error);
      const fallback = getMockOttItems(provider);
      ottProviderCache.current[provider] = fallback;
      recentOttCache.current[provider] = sortByNewestYear(fallback);
      upcomingOttCache.current[provider] = [];
      if (activeOttProviderRef.current === provider) {
        setOttTitles(fallback);
        setRecentlyReleasedOttTitles(recentOttCache.current[provider]);
        setUpcomingOttTitles([]);
      }
    } finally {
      if (activeOttProviderRef.current === provider) {
        setIsLoading(false);
      }
    }
  };

  const discoverMovies = async (filters: DiscoverFilters) => {
    if (searchQuery.trim()) {
      return;
    }

    setIsLoading(true);

    if (!API_KEY) {
      console.warn("TMDB API Key is missing. Using mock data.");
      setMovies(MOCK_MOVIES);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetchTmdb('/discover/movie', buildAdvancedDiscoverParams(filters));
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const mapped = getResults(data).map(item => mapToMovie(item));
      setMovies(sortMoviesByImage(mapped));
    } catch (error) {
      console.warn("Failed to fetch filtered movies from TMDB, using mock data fallback.", error);
      setMovies(MOCK_MOVIES);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalSearchResults = (query: string): Movie[] => {
    const lowerQ = query.toLowerCase();
    const pool = uniqueMovies([
      ...movies,
      ...series,
      ...ottTitles,
      ...upcomingMovies,
      ...upcomingSeries,
      ...recentlyReleasedMovies,
      ...recentlyReleasedSeries,
      ...MOCK_MOVIES,
    ]);

    return pool.filter(item => [
      item.title,
      item.description,
      item.director,
      item.mediaType === 'tv' ? 'webseries series tv show' : 'movie film',
      ...item.genre,
    ].some(value => value.toLowerCase().includes(lowerQ)));
  };

  const mapSearchPayload = (payload: any): Movie[] => {
    return getResults(payload)
      .filter(item => item?.media_type === 'movie' || item?.media_type === 'tv')
      .map(item => mapToMovie(item, item.media_type === 'tv' ? 'tv' : 'movie'));
  };

  const getSearchSuggestions = async (query: string): Promise<Movie[]> => {
    const trimmed = query.trim();
    if (trimmed.length < 1) return [];

    if (!API_KEY) {
      return getLocalSearchResults(trimmed).slice(0, 6);
    }

    try {
      const response = await fetchTmdb('/search/multi', buildTmdbParams({
        query: trimmed,
        include_adult: 'false',
      }));
      const data = await response.json();
      return sortMoviesByImage(uniqueMovies(mapSearchPayload(data))).slice(0, 6);
    } catch (error) {
      console.warn('Search suggestions failed, using local data.', error);
      return getLocalSearchResults(trimmed).slice(0, 6);
    }
  };

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
       fetchMoviesByCategory('All');
       return;
    }

    setSearchQuery(query.trim());

    if (!API_KEY) {
      setMovies(getLocalSearchResults(query.trim()));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchTmdb('/search/multi', buildTmdbParams({
        query: query.trim(),
        include_adult: 'false',
      }));
      if (!response.ok) throw new Error("API Error");
      const data = await response.json();
      setMovies(sortMoviesByImage(uniqueMovies(mapSearchPayload(data))).slice(0, 40));
    } catch (error) {
      console.warn("Search failed, using mock data fallback.", error);
      setMovies(getLocalSearchResults(query.trim()));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Full Details for a Single Movie
  const getMovie = async (id: string): Promise<Movie | null> => {
    try {
      // First check if it's a mock movie ID
      const mockMovie = MOCK_MOVIES.find(m => m.id === id);
      if (mockMovie) return mockMovie;

      if (!API_KEY) return findMovieById(id);

      // Fetch with credits, watch providers, recommendations AND videos
      const response = await fetchTmdb(`/movie/${id}`, buildTmdbParams({
        append_to_response: 'credits,watch/providers,recommendations,videos',
      }));
      if (!response.ok) throw new Error("API Error");
      const data = await response.json();

      const basicMovie = mapToMovie(data);

      // Extract Director
      const director = data.credits?.crew?.find((person: any) => person.job === 'Director')?.name || 'Unknown';

      // Extract Cast (Top 10)
      const cast: CastMember[] = data.credits?.cast?.slice(0, 10).map((c: any) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profile_path: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : null
      })) || [];

      // Extract Watch Providers
      const providersResult = data['watch/providers']?.results;
      const region = providersResult?.IN || providersResult?.US;
      const watchLink = region?.link;

      let providers: WatchProvider[] = [];

      if (region) {
          const combined = [
            ...(region.flatrate || []),
            ...(region.rent || []),
            ...(region.buy || [])
          ];

          const uniqueProviders = new Map<number, WatchProvider>();
          combined.forEach((p: any) => {
             if (!uniqueProviders.has(p.provider_id)) {
                uniqueProviders.set(p.provider_id, {
                    provider_id: p.provider_id,
                    provider_name: p.provider_name,
                    logo_path: p.logo_path ? `https://image.tmdb.org/t/p/original${p.logo_path}` : '',
                    link: watchLink
                });
             }
          });
          providers = Array.from(uniqueProviders.values());
      }

      // Extract Recommendations
      const recommendations = getResults(data.recommendations).map(item => mapToMovie(item));

      // Extract Trailer and Teaser
      const videos = data.videos?.results || [];
      const trailer = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
      const teaser = videos.find((v: any) => v.type === 'Teaser' && v.site === 'YouTube') || videos.find((v: any) => v.type === 'Clip' && v.site === 'YouTube');
      const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : undefined;
      const teaserUrl = teaser && teaser.key !== trailer?.key ? `https://www.youtube.com/watch?v=${teaser.key}` : undefined;

      return {
        ...basicMovie,
        director,
        cast,
        providers,
        recommendations: sortMoviesByImage(recommendations),
        trailerUrl,
        teaserUrl
      };
    } catch (error) {
      console.error("Failed to fetch movie details, using fallback", error);
      // Fallback to mock movie if exists
      return findMovieById(id);
    }
  };

  const getSeries = async (id: string): Promise<Movie | null> => {
    try {
      const cachedSeries =
        series.find(item => item.id === id) ||
        upcomingSeries.find(item => item.id === id) ||
        recentlyReleasedSeries.find(item => item.id === id) ||
        ottTitles.find(item => item.id === id && item.mediaType === 'tv') ||
        upcomingOttTitles.find(item => item.id === id && item.mediaType === 'tv') ||
        recentlyReleasedOttTitles.find(item => item.id === id && item.mediaType === 'tv') ||
        favoriteMovies.find(item => item.id === id && item.mediaType === 'tv') ||
        recentlyViewed.find(item => item.id === id && item.mediaType === 'tv') ||
        null;

      if (!API_KEY) return cachedSeries;

      const response = await fetchTmdb(`/tv/${id}`, buildTmdbParams({
        append_to_response: 'credits,watch/providers,recommendations,videos',
      }));
      const data = await response.json();
      const basicSeries = mapToMovie(data, 'tv');
      const creator = data.created_by?.[0]?.name || data.credits?.crew?.find((person: any) => person.job === 'Creator')?.name || 'Unknown';

      const cast: CastMember[] = data.credits?.cast?.slice(0, 10).map((c: any) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profile_path: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : null
      })) || [];

      const providersResult = data['watch/providers']?.results;
      const region = providersResult?.IN || providersResult?.US;
      const watchLink = region?.link;
      let providers: WatchProvider[] = [];

      if (region) {
        const combined = [
          ...(region.flatrate || []),
          ...(region.rent || []),
          ...(region.buy || [])
        ];
        const uniqueProviders = new Map<number, WatchProvider>();
        combined.forEach((p: any) => {
          if (!uniqueProviders.has(p.provider_id)) {
            uniqueProviders.set(p.provider_id, {
              provider_id: p.provider_id,
              provider_name: p.provider_name,
              logo_path: p.logo_path ? `https://image.tmdb.org/t/p/original${p.logo_path}` : '',
              link: watchLink
            });
          }
        });
        providers = Array.from(uniqueProviders.values());
      }

      const recommendations = getResults(data.recommendations).map(item => mapToMovie(item, 'tv'));

      // Extract Trailer and Teaser
      const videos = data.videos?.results || [];
      const trailer = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
      const teaser = videos.find((v: any) => v.type === 'Teaser' && v.site === 'YouTube') || videos.find((v: any) => v.type === 'Clip' && v.site === 'YouTube');
      const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : undefined;
      const teaserUrl = teaser && teaser.key !== trailer?.key ? `https://www.youtube.com/watch?v=${teaser.key}` : undefined;

      return {
        ...basicSeries,
        director: creator,
        cast,
        providers,
        recommendations: sortMoviesByImage(recommendations),
        trailerUrl,
        teaserUrl
      };
    } catch (error) {
      console.error('Failed to fetch webseries details, using fallback', error);
      return (
        series.find(item => item.id === id) ||
        upcomingSeries.find(item => item.id === id) ||
        recentlyReleasedSeries.find(item => item.id === id) ||
        ottTitles.find(item => item.id === id && item.mediaType === 'tv') ||
        upcomingOttTitles.find(item => item.id === id && item.mediaType === 'tv') ||
        recentlyReleasedOttTitles.find(item => item.id === id && item.mediaType === 'tv') ||
        favoriteMovies.find(item => item.id === id && item.mediaType === 'tv') ||
        recentlyViewed.find(item => item.id === id && item.mediaType === 'tv') ||
        null
      );
    }
  };

  const getActor = async (id: string): Promise<Actor | null> => {
    try {
      const params = buildTmdbParams();
      const response = await fetchTmdb(`/person/${id}`, params);
      const data = await response.json();
      
      return {
        id: data.id,
        name: data.name,
        biography: data.biography,
        birthday: data.birthday,
        place_of_birth: data.place_of_birth,
        profile_path: data.profile_path,
        known_for_department: data.known_for_department,
        deathday: data.deathday,
      };
    } catch (error) {
      console.error('Error fetching actor details:', error);
      return null;
    }
  };

  const getActorMovies = async (id: string): Promise<Movie[]> => {
    try {
      const params = buildTmdbParams();
      const response = await fetchTmdb(`/person/${id}/movie_credits`, params);
      const data = await response.json();
      
      const cast = getResults({ results: data.cast });
      return cast
        .sort((a: any, b: any) => b.popularity - a.popularity)
        .slice(0, 20)
        .map((m: any) => ({
          id: String(m.id),
          title: m.title,
          posterUrl: m.poster_path ? `${IMAGE_BASE_URL}${m.poster_path}` : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1000&q=80',
          backdropUrl: m.backdrop_path ? `${IMAGE_BASE_URL}${m.backdrop_path}` : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1000&q=80',
          rating: Number((m.vote_average || 0).toFixed(1)),
          year: getReleaseYear(m),
          duration: '',
          genre: getGenreNames(m),
          description: m.overview || '',
          director: '',
          cast: [],
          mediaType: 'movie'
        }));
    } catch (error) {
      console.error('Error fetching actor movies:', error);
      return [];
    }
  };

  return (
    <StoreContext.Provider value={{
      user,
      isAuthLoading,
      authError,
      login,
      signup,
      resetPassword,
      updatePassword,
      updateProfile,
      logout,
      favorites,
      favoriteMovies,
      recentlyViewed,
      favoriteGenres,
      toggleFavorite,
      isFavorite,
      trackRecentlyViewed,
      movies,
      upcomingMovies,
      recentlyReleasedMovies,
      series,
      upcomingSeries,
      recentlyReleasedSeries,
      selectedSeriesCategory,
      ottTitles,
      upcomingOttTitles,
      recentlyReleasedOttTitles,
      selectedOttProvider,
      discoverMovies,
      searchMovies,
      getSearchSuggestions,
      getMovie,
      getSeries,
      getActor,
      getActorMovies,
      searchQuery,
      setSearchQuery,
      isLoading,
      selectedCategory,
      setSelectedCategory,
      fetchMoviesByCategory,
      fetchSeriesByCategory,
      fetchOttByProvider
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
