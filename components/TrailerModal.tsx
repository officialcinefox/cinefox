import React from 'react';
import { X, AlertCircle } from 'lucide-react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  trailerKey?: string;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({ isOpen, onClose, title, trailerKey }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-zinc-800 flex flex-col">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/60 text-white p-2 rounded-full hover:bg-red-600 transition backdrop-blur-md"
        >
          <X size={24} />
        </button>
        
        {trailerKey ? (
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} 
            title={`${title} Trailer`} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
             <AlertCircle size={48} className="text-gray-500 mb-4" />
             <h3 className="text-xl font-bold mb-2">Trailer Unavailable</h3>
             <p className="text-gray-400 max-w-md">
               Sorry, we couldn't find an official trailer for "{title}" at this moment.
             </p>
             <a 
               href={`https://www.youtube.com/results?search_query=${encodeURIComponent(title + " trailer")}`} 
               target="_blank" 
               rel="noopener noreferrer"
               className="mt-6 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-white font-medium transition"
             >
               Search on YouTube
             </a>
          </div>
        )}
      </div>
    </div>
  );
};