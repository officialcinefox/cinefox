import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { MovieCard } from '../components/MovieCard';
import { ChevronRight, Filter, RotateCcw, Search, SlidersHorizontal, Star } from 'lucide-react';
import { PosterGridSkeleton } from '../components/Skeletons';

const GENRE_OPTIONS = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Thriller',
];

const LANGUAGE_OPTIONS = [
  { value: 'all', label: 'All languages' },
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'te', label: 'Telugu' },
  { value: 'ko', label: 'Korean' },
  { value: 'ja', label: 'Japanese' },
];

const YEAR_OPTIONS = [
  { value: 'all', label: 'Any year' },
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: '2020s', label: '2020s' },
  { value: '2010s', label: '2010s' },
  { value: 'older', label: 'Before 2010' },
];

const RATING_OPTIONS = [
  { value: 'all', label: 'Any rating' },
  { value: '8', label: '8.0+' },
  { value: '7', label: '7.0+' },
  { value: '6', label: '6.0+' },
  { value: '5', label: '5.0+' },
];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Popularity' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'alphabetical', label: 'A-Z' },
];

const yearMatches = (year: number, filter: string) => {
  if (filter === 'all') return true;
  if (filter === '2020s') return year >= 2020 && year <= 2029;
  if (filter === '2010s') return year >= 2010 && year <= 2019;
  if (filter === 'older') return year < 2010;
  return year === Number(filter);
};

export const Movies = () => {
  const { movies, discoverMovies, searchMovies, searchQuery, setSearchQuery, isLoading } = useStore();
  const navigate = useNavigate();
  const [genreFilter, setGenreFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [sortOption, setSortOption] = useState('popular');
  const [heroIndex, setHeroIndex] = useState(0);
  const heroItems = useMemo(() => movies.slice(0, 5), [movies]);

  const hasRemoteFilters = Boolean(
    genreFilter !== 'all' ||
    yearFilter !== 'all' ||
    ratingFilter !== 'all' ||
    languageFilter !== 'all' ||
    sortOption !== 'popular'
  );

  useEffect(() => {
    if (!searchQuery.trim() && hasRemoteFilters) {
      void discoverMovies({
        genre: genreFilter,
        year: yearFilter,
        rating: ratingFilter,
        language: languageFilter,
        sort: sortOption,
      });
    }
  }, [genreFilter, hasRemoteFilters, languageFilter, ratingFilter, searchQuery, sortOption, yearFilter]);

  useEffect(() => {
    setHeroIndex(0);
  }, [searchQuery, genreFilter, yearFilter, ratingFilter, languageFilter, sortOption]);

  useEffect(() => {
    if (heroItems.length < 2) return;

    const timer = window.setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroItems.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [heroItems.length]);

  const filteredMovies = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const minimumRating = ratingFilter === 'all' ? 0 : Number(ratingFilter);

    const filtered = movies.filter(movie => {
      const matchesSearch = !normalizedQuery || [
        movie.title,
        movie.description,
        movie.director,
        ...movie.genre,
      ].some(value => value.toLowerCase().includes(normalizedQuery));

      const matchesGenre = genreFilter === 'all' || movie.genre.includes(genreFilter);
      const matchesYear = yearMatches(movie.year, yearFilter);
      const matchesRating = movie.rating >= minimumRating;
      const matchesLanguage = languageFilter === 'all' || movie.original_language === languageFilter;

      return matchesSearch && matchesGenre && matchesYear && matchesRating && matchesLanguage;
    });

    switch (sortOption) {
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return filtered.sort((a, b) => b.year - a.year || b.rating - a.rating);
      case 'alphabetical':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filtered;
    }
  }, [genreFilter, languageFilter, movies, ratingFilter, searchQuery, sortOption, yearFilter]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    genreFilter !== 'all' ||
    yearFilter !== 'all' ||
    ratingFilter !== 'all' ||
    languageFilter !== 'all' ||
    sortOption !== 'popular'
  );

  const clearFilters = () => {
    setSearchQuery('');
    setGenreFilter('all');
    setYearFilter('all');
    setRatingFilter('all');
    setLanguageFilter('all');
    setSortOption('popular');
    void searchMovies('');
  };

  const heroItem = heroItems[heroIndex] ?? movies[0] ?? null;
  const heroPath = heroItem?.mediaType === 'tv' ? `/series/${heroItem.id}` : `/movie/${heroItem?.id}`;
  const truncate = (value: string, length: number) => value.length > length ? value.slice(0, length - 1) : value;

  return (
    <div className="min-h-screen bg-netflix-black pb-20">
      {heroItem && (
        <div className="relative mb-8 flex min-h-[380px] w-full flex-col justify-end overflow-hidden pb-8 pt-24 md:min-h-[480px] md:pb-12 lg:min-h-[540px] lg:pb-16">
          <div className="absolute inset-0 z-0">
            {heroItems.map((item, index) => (
              <img
                key={`${item.mediaType || 'movie'}-${item.id}`}
                src={item.backdropUrl}
                alt={item.title}
                className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ${
                  index === heroIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-[90%] bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent" />
          </div>

          <div className="relative z-20 w-full px-4 md:px-12">
            <div className="max-w-2xl space-y-3 md:space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded bg-netflix-red px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md md:py-1 md:text-xs">
                  {searchQuery ? 'Search Result' : 'Movies'}
                </span>
                <span className="rounded border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-200 backdrop-blur-md md:py-1 md:text-xs">
                  {heroItem.mediaType === 'tv' ? 'Webseries' : 'Movie'}
                </span>
              </div>

              <h1 className="line-clamp-2 text-3xl font-extrabold leading-[1.08] text-white drop-shadow-lg sm:text-4xl md:line-clamp-3 md:text-5xl lg:text-6xl">
                {heroItem.title}
              </h1>

              <div className="flex items-center gap-4 text-[10px] font-medium text-gray-300 md:text-base">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={12} fill="currentColor" className="md:h-4 md:w-4" />
                  <span className="font-bold text-white">{heroItem.rating}</span>
                </div>
                <span>{heroItem.year}</span>
                <span>{heroItem.duration}</span>
              </div>

              <p className="max-w-xl text-sm leading-relaxed text-gray-300 drop-shadow-md md:text-lg">
                {truncate(heroItem.description, 150)}
                {heroItem.description.length > 150 ? '...' : ''}
              </p>

              <button
                type="button"
                onClick={() => navigate(heroPath)}
                className="flex items-center gap-2 rounded bg-netflix-red px-4 py-2 text-xs font-bold text-white shadow-lg transition duration-200 hover:scale-105 hover:bg-red-700 active:scale-95 md:px-8 md:py-3.5 md:text-base"
              >
                View Details <ChevronRight size={14} className="md:h-5 md:w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`${heroItem ? '' : 'pt-24'} px-4 md:px-12`}>
      <div className="mb-6 flex flex-col gap-4 md:mb-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="border-l-4 border-netflix-red pl-4 text-3xl font-bold">Discover</h1>
            <p className="mt-2 text-sm text-gray-400">{filteredMovies.length} titles matched</p>
          </div>

          {searchQuery && (
            <div className="flex items-center gap-3 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm text-gray-300">
              <Search size={16} className="text-gray-500" />
              <span className="max-w-[220px] truncate">Search: {searchQuery}</span>
              <button type="button" onClick={clearFilters} className="font-semibold text-white hover:text-netflix-red">
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-3 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-6">
          <label className="min-w-[190px] space-y-2 rounded-lg border border-zinc-800 bg-zinc-950/70 p-3 md:min-w-0">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              <Filter size={14} /> Genre
            </span>
            <select
              value={genreFilter}
              onChange={(event) => setGenreFilter(event.target.value)}
              className="h-11 w-full rounded bg-zinc-900 px-3 text-sm text-white outline-none ring-1 ring-zinc-800 transition focus:ring-netflix-red"
            >
              <option value="all" className="bg-zinc-900">All genres</option>
              {GENRE_OPTIONS.map(genre => (
                <option key={genre} value={genre} className="bg-zinc-900">{genre}</option>
              ))}
            </select>
          </label>

          <label className="min-w-[165px] space-y-2 rounded-lg border border-zinc-800 bg-zinc-950/70 p-3 md:min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Year</span>
            <select
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
              className="h-11 w-full rounded bg-zinc-900 px-3 text-sm text-white outline-none ring-1 ring-zinc-800 transition focus:ring-netflix-red"
            >
              {YEAR_OPTIONS.map(option => (
                <option key={option.value} value={option.value} className="bg-zinc-900">{option.label}</option>
              ))}
            </select>
          </label>

          <label className="min-w-[165px] space-y-2 rounded-lg border border-zinc-800 bg-zinc-950/70 p-3 md:min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Rating</span>
            <select
              value={ratingFilter}
              onChange={(event) => setRatingFilter(event.target.value)}
              className="h-11 w-full rounded bg-zinc-900 px-3 text-sm text-white outline-none ring-1 ring-zinc-800 transition focus:ring-netflix-red"
            >
              {RATING_OPTIONS.map(option => (
                <option key={option.value} value={option.value} className="bg-zinc-900">{option.label}</option>
              ))}
            </select>
          </label>

          <label className="min-w-[185px] space-y-2 rounded-lg border border-zinc-800 bg-zinc-950/70 p-3 md:min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Language</span>
            <select
              value={languageFilter}
              onChange={(event) => setLanguageFilter(event.target.value)}
              className="h-11 w-full rounded bg-zinc-900 px-3 text-sm text-white outline-none ring-1 ring-zinc-800 transition focus:ring-netflix-red"
            >
              {LANGUAGE_OPTIONS.map(option => (
                <option key={option.value} value={option.value} className="bg-zinc-900">{option.label}</option>
              ))}
            </select>
          </label>

          <label className="min-w-[170px] space-y-2 rounded-lg border border-zinc-800 bg-zinc-950/70 p-3 md:min-w-0">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              <SlidersHorizontal size={14} /> Sort
            </span>
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              className="h-11 w-full rounded bg-zinc-900 px-3 text-sm text-white outline-none ring-1 ring-zinc-800 transition focus:ring-netflix-red"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value} className="bg-zinc-900">{option.label}</option>
              ))}
            </select>
          </label>

          <div className="flex min-w-[150px] items-end rounded-lg border border-zinc-800 bg-zinc-950/70 p-3 md:min-w-0">
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="flex h-11 w-full items-center justify-center gap-2 rounded bg-zinc-800 px-3 text-sm font-semibold text-gray-200 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <PosterGridSkeleton />
      ) : filteredMovies.length > 0 ? (
        // Grid: 3 columns on mobile (grid-cols-3) as requested
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6 gap-y-10 pb-20">
          {filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
           <Search size={48} className="mb-4 opacity-50" />
           <p className="text-xl">{searchQuery ? `No results found for "${searchQuery}"` : 'No movies found'}</p>
           <p className="text-sm mt-2">Try searching for a different title.</p>
        </div>
      )}
      </div>
    </div>
  );
};
