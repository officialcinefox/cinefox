import React from 'react';

export const PosterGridSkeleton: React.FC<{ count?: number }> = ({ count = 15 }) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6 gap-y-10 pb-20">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3">
          <div className="aspect-[2/3] animate-pulse rounded-lg border border-zinc-800 bg-zinc-900" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-800" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-800" />
        </div>
      ))}
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-netflix-black px-4 pt-24 md:px-12">
      <div className="min-h-[520px] animate-pulse rounded-none bg-zinc-950">
        <div className="flex h-[520px] max-w-2xl flex-col justify-end gap-5 pb-16">
          <div className="h-7 w-40 rounded bg-zinc-800" />
          <div className="h-16 w-5/6 rounded bg-zinc-800" />
          <div className="h-5 w-56 rounded bg-zinc-800" />
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-zinc-800" />
            <div className="h-4 w-4/5 rounded bg-zinc-800" />
          </div>
          <div className="h-12 w-48 rounded bg-zinc-800" />
        </div>
      </div>
    </div>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-netflix-black px-4 pt-24 text-white md:px-12">
      <div className="mx-auto flex max-w-7xl animate-pulse flex-col gap-8 md:flex-row">
        <div className="mx-auto aspect-[2/3] w-64 rounded-lg bg-zinc-900 md:mx-0 md:w-80" />
        <div className="flex-1 space-y-6">
          <div className="h-14 w-4/5 rounded bg-zinc-800" />
          <div className="flex gap-4">
            <div className="h-8 w-24 rounded-full bg-zinc-800" />
            <div className="h-8 w-24 rounded-full bg-zinc-800" />
            <div className="h-8 w-24 rounded-full bg-zinc-800" />
          </div>
          <div className="h-12 w-52 rounded bg-zinc-800" />
          <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="h-5 w-32 rounded bg-zinc-800" />
            <div className="h-4 w-full rounded bg-zinc-800" />
            <div className="h-4 w-11/12 rounded bg-zinc-800" />
            <div className="h-4 w-3/4 rounded bg-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  );
};
