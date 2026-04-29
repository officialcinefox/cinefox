export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  link?: string; // URL to watch the movie
}

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  year: number;
  duration: string; // Formatted runtime
  genre: string[];
  description: string;
  director: string;
  cast: CastMember[];
  original_language?: string;
  providers?: WatchProvider[];
  providerId?: number;
  providerTag?: string;
  recommendations?: Movie[]; // List of recommended movies
  mediaType?: 'movie' | 'tv';
  seasons?: number;
  trailerUrl?: string;
  teaserUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  note?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
