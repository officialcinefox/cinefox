import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, PlayCircle, Star } from 'lucide-react';
import { AutoScrollRow } from '../components/AutoScrollRow';
import { MovieRow } from '../components/MovieRow';
import { HeroSkeleton } from '../components/Skeletons';
import { useStore } from '../context/StoreContext';
import { OTT_PROVIDERS } from '../constants';

export const Ott = () => {
  const {
    ottTitles,
    upcomingOttTitles,
    recentlyReleasedOttTitles,
    selectedOttProvider,
    isLoading,
    fetchOttByProvider,
  } = useStore();
  const [heroIndex, setHeroIndex] = useState(0);
  const navigate = useNavigate();
  const heroItems = useMemo(() => ottTitles.slice(0, 5), [ottTitles]);

  useEffect(() => {
    if (ottTitles.length === 0) {
      void fetchOttByProvider('All');
    }
  }, []);

  useEffect(() => {
    setHeroIndex(0);
  }, [selectedOttProvider]);

  useEffect(() => {
    if (heroItems.length < 2) return;

    const timer = window.setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroItems.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [heroItems.length]);

  if (isLoading && ottTitles.length === 0) {
    return <HeroSkeleton />;
  }

  const heroItem = heroItems[heroIndex] ?? ottTitles[0] ?? null;
  const trending = ottTitles.slice(0, 10);
  const topPicks = ottTitles.slice(0, 15);
  const criticsChoice = [...ottTitles].sort((a, b) => b.rating - a.rating || b.year - a.year).slice(0, 10);

  if (!heroItem) {
    return (
      <div className="flex h-screen items-center justify-center bg-netflix-black text-gray-400">
        No OTT titles available right now.
      </div>
    );
  }

  const heroPath = heroItem.mediaType === 'tv' ? `/series/${heroItem.id}` : `/movie/${heroItem.id}`;
  const truncate = (value: string, length: number) => value.length > length ? value.slice(0, length - 1) : value;

  return (
    <div className="overflow-x-hidden bg-netflix-black pb-20">
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[90%] bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent" />
        </div>

        <div className="relative z-20 w-full px-4 md:px-12">
          <div className="max-w-2xl space-y-3 md:space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded bg-netflix-red px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md md:py-1 md:text-xs">
                <PlayCircle size={13} /> OTT
              </span>
              <span className="rounded border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-200 backdrop-blur-md md:py-1 md:text-xs">
                {heroItem.providerTag || selectedOttProvider}
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

            <div className="max-w-xl text-sm leading-relaxed text-gray-300 drop-shadow-md md:text-lg">
              <span>{truncate(heroItem.description, 150)}</span>
              {heroItem.description.length > 150 && (
                <>
                  <span>... </span>
                  <button onClick={() => navigate(heroPath)} className="ml-1 font-bold text-netflix-red hover:underline">
                    Read More
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => navigate(heroPath)}
              className="flex items-center gap-2 rounded bg-netflix-red px-4 py-2 text-xs font-bold text-white shadow-lg transition duration-200 hover:scale-105 hover:bg-red-700 active:scale-95 md:px-8 md:py-3.5 md:text-base"
            >
              View Details <ChevronRight size={14} className="md:h-5 md:w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-30 mb-6 px-4 md:mb-10 md:px-12">
        <div className="no-scrollbar flex items-center justify-start gap-3 overflow-x-auto py-2">
          {OTT_PROVIDERS.map(provider => (
            <button
              key={provider.value}
              type="button"
              onClick={() => fetchOttByProvider(provider.value)}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-300 md:px-6 md:py-2 md:text-sm ${
                selectedOttProvider === provider.value
                  ? 'scale-105 border-white bg-white text-black shadow-lg'
                  : 'border-zinc-700 bg-zinc-800 text-gray-300 hover:border-white hover:text-white'
              }`}
            >
              {provider.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-20 space-y-12 px-4 md:space-y-16 md:px-12">
        {upcomingOttTitles.length > 0 && (
          <MovieRow title={`Upcoming on ${selectedOttProvider === 'All' ? 'OTT' : selectedOttProvider}`} movies={upcomingOttTitles} hideRating />
        )}
        <MovieRow title="Recently Released" movies={recentlyReleasedOttTitles} />
        <MovieRow title={`Trending on ${selectedOttProvider === 'All' ? 'OTT' : selectedOttProvider}`} movies={trending} />
        <AutoScrollRow title="Top OTT Picks" movies={topPicks} />
        <MovieRow title="Critics Choice" movies={criticsChoice} />
      </div>
    </div>
  );
};
