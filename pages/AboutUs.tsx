import React from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard, Compass, Heart, MonitorPlay, Search, ShieldCheck, Sparkles, Tv } from 'lucide-react';

const highlights = [
  { label: 'Movie discovery', value: 'Trending, upcoming, recent, top rated', icon: Clapperboard },
  { label: 'Webseries hub', value: 'Bollywood, Hollywood, Korean, Japanese, Anime', icon: Tv },
  { label: 'OTT explorer', value: 'Netflix, Prime, Hotstar, JioCinema and more', icon: MonitorPlay },
  { label: 'Smart search', value: 'Movies and webseries with live suggestions', icon: Search },
];

const promises = [
  { title: 'Fast discovery', text: 'Clean rows, hero sliders, filters, and category shortcuts make browsing quick.', icon: Compass },
  { title: 'Personal space', text: 'Your profile keeps saved titles, recent history, avatar, notes, and favorite genres together.', icon: Heart },
  { title: 'Reliable metadata', text: 'CineFox uses TMDB-powered title data with posters, ratings, genres, cast, and providers.', icon: ShieldCheck },
];

export const AboutUs = () => {
  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <section className="relative flex min-h-[620px] items-end overflow-hidden px-4 pb-14 pt-28 md:px-12 lg:pb-20">
        <img
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80"
          alt="Cinema seats"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/25" />
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-transparent" />

        <div className="relative z-10 max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-netflix-red backdrop-blur">
            <Sparkles size={15} /> About CineFox
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-[1.05] text-white md:text-6xl lg:text-7xl">
            Movies, webseries, and OTT picks in one clean place.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-300 md:text-xl">
            CineFox is built for people who want to find something good faster: browse by category, search across movies and shows,
            check streaming platforms, save favorites, and keep a personal watch profile.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/movies" className="rounded bg-netflix-red px-6 py-3 font-bold text-white transition hover:bg-red-700">
              Explore Movies
            </Link>
            <Link to="/ott" className="rounded border border-white/20 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white hover:text-black">
              Browse OTT
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-5">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded bg-zinc-800 text-netflix-red">
                  <Icon size={22} />
                </div>
                <h2 className="text-lg font-bold">{item.label}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.value}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-10 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-netflix-red">Why it exists</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">Less searching, more watching.</h2>
            <p className="mt-5 text-base leading-relaxed text-gray-400 md:text-lg">
              Most people jump between apps before deciding what to watch. CineFox brings discovery, genres, ratings, upcoming titles,
              recently released rows, and OTT availability into one dark, focused interface.
            </p>
          </div>

          <div className="grid gap-4">
            {promises.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4 rounded-lg border border-zinc-800 bg-zinc-900/60 p-5">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded bg-zinc-800 text-netflix-red">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 pt-10 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-zinc-800 pt-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black">Built for CineFox viewers.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
              The goal is simple: a premium browsing experience for movies, webseries, OTT platforms, saved titles, and personal profile data.
            </p>
          </div>
          <Link to="/webseries" className="w-fit rounded bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-200">
            Explore Webseries
          </Link>
        </div>
      </section>
    </div>
  );
};
