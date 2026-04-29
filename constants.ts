import { Movie } from './types';

export const MOVIE_CATEGORIES = [
  'All',
  'Bollywood',
  'Hollywood',
  'Tollywood',
  'Korean',
  'Anime',
  'Cartoon',
  'Adventure',
  'Science Fiction',
  'Fantasy',
  'Comedy',
  'Horror',
];

export const WEBSERIES_CATEGORIES = ['All', 'Bollywood', 'Hollywood', 'Korean', 'Japanese', 'Anime'];

export const OTT_PROVIDERS = [
  { value: 'All', label: 'All', shortLabel: 'All' },
  { value: 'Netflix', label: 'Netflix', shortLabel: 'Netflix', providerId: 8 },
  { value: 'Prime Video', label: 'Amazon Prime Video', shortLabel: 'Prime', providerId: 119 },
  { value: 'Disney+ Hotstar', label: 'Disney+ Hotstar', shortLabel: 'Hotstar', providerId: 122 },
  { value: 'JioCinema', label: 'JioCinema', shortLabel: 'JioCinema', providerId: 220 },
  { value: 'ZEE5', label: 'ZEE5', shortLabel: 'ZEE5', providerId: 232 },
  { value: 'SonyLIV', label: 'SonyLIV', shortLabel: 'SonyLIV', providerId: 237 },
  { value: 'Apple TV+', label: 'Apple TV+', shortLabel: 'Apple TV+', providerId: 350 },
];

// Helper for providers
const MOCK_PROVIDERS = [
  { provider_id: 8, provider_name: "Netflix", logo_path: "https://image.tmdb.org/t/p/original/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg" },
  { provider_id: 119, provider_name: "Amazon Prime Video", logo_path: "https://image.tmdb.org/t/p/original/emthp39XA2YScoYL1p0sdbAH2WA.jpg" }
];

export const MOCK_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Interstellar',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    rating: 8.7,
    year: 2014,
    duration: '2h 49m',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival. When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    director: 'Christopher Nolan',
    cast: [
      { id: 101, name: 'Matthew McConaughey', character: 'Cooper', profile_path: null },
      { id: 102, name: 'Anne Hathaway', character: 'Brand', profile_path: null },
      { id: 103, name: 'Jessica Chastain', character: 'Murph', profile_path: null }
    ],
    providers: MOCK_PROVIDERS
  },
  {
    id: '2',
    title: 'The Dark Knight',
    posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cd4?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&w=1920&q=80',
    rating: 9.0,
    year: 2008,
    duration: '2h 32m',
    genre: ['Action', 'Crime', 'Drama'],
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    director: 'Christopher Nolan',
    cast: [
      { id: 201, name: 'Christian Bale', character: 'Bruce Wayne / Batman', profile_path: null },
      { id: 202, name: 'Heath Ledger', character: 'Joker', profile_path: null },
      { id: 203, name: 'Aaron Eckhart', character: 'Harvey Dent', profile_path: null }
    ],
    providers: MOCK_PROVIDERS
  },
  {
    id: '3',
    title: 'Inception',
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=1920&q=80',
    rating: 8.8,
    year: 2010,
    duration: '2h 28m',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    director: 'Christopher Nolan',
    cast: [
      { id: 301, name: 'Leonardo DiCaprio', character: 'Cobb', profile_path: null },
      { id: 302, name: 'Joseph Gordon-Levitt', character: 'Arthur', profile_path: null },
      { id: 303, name: 'Elliot Page', character: 'Ariadne', profile_path: null }
    ],
    providers: [MOCK_PROVIDERS[0]]
  },
  {
    id: '4',
    title: 'Cyberpunk: Edgerunners',
    posterUrl: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1920&q=80',
    rating: 8.3,
    year: 2022,
    duration: '1 Season',
    genre: ['Animation', 'Action', 'Sci-Fi'],
    description: 'In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid strives to become a mercenary outlaw — an edgerunner.',
    director: 'Hiroyuki Imaishi',
    cast: [
      { id: 401, name: 'KENN', character: 'David Martinez (voice)', profile_path: null },
      { id: 402, name: 'Aoi Yuki', character: 'Lucy (voice)', profile_path: null },
      { id: 403, name: 'Hiroki Tochi', character: 'Maine (voice)', profile_path: null }
    ],
    providers: [MOCK_PROVIDERS[0]]
  },
  {
    id: '5',
    title: 'Dune: Part Two',
    posterUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=1920&q=80',
    rating: 8.6,
    year: 2024,
    duration: '2h 46m',
    genre: ['Sci-Fi', 'Adventure'],
    description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
    director: 'Denis Villeneuve',
    cast: [
      { id: 501, name: 'Timothée Chalamet', character: 'Paul Atreides', profile_path: null },
      { id: 502, name: 'Zendaya', character: 'Chani', profile_path: null },
      { id: 503, name: 'Rebecca Ferguson', character: 'Lady Jessica', profile_path: null }
    ],
    providers: [MOCK_PROVIDERS[1]]
  },
  {
    id: '6',
    title: 'Blade Runner 2049',
    posterUrl: 'https://images.unsplash.com/photo-1542259681-d3d63b016200?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1542259681-d3d63b016200?auto=format&fit=crop&w=1920&q=80',
    rating: 8.0,
    year: 2017,
    duration: '2h 44m',
    genre: ['Sci-Fi', 'Thriller'],
    description: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who\'s been missing for thirty years.',
    director: 'Denis Villeneuve',
    cast: [
      { id: 601, name: 'Ryan Gosling', character: 'K', profile_path: null },
      { id: 602, name: 'Harrison Ford', character: 'Rick Deckard', profile_path: null },
      { id: 603, name: 'Ana de Armas', character: 'Joi', profile_path: null }
    ],
    providers: MOCK_PROVIDERS
  },
  {
    id: '7',
    title: 'The Matrix',
    posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=80',
    rating: 8.7,
    year: 1999,
    duration: '2h 16m',
    genre: ['Action', 'Sci-Fi'],
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    director: 'Lana Wachowski, Lilly Wachowski',
    cast: [
      { id: 701, name: 'Keanu Reeves', character: 'Neo', profile_path: null },
      { id: 702, name: 'Laurence Fishburne', character: 'Morpheus', profile_path: null },
      { id: 703, name: 'Carrie-Anne Moss', character: 'Trinity', profile_path: null }
    ],
    providers: [MOCK_PROVIDERS[1]]
  },
  {
    id: '8',
    title: 'Neon Genesis',
    posterUrl: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1614726365723-49cfae927846?auto=format&fit=crop&w=1920&q=80',
    rating: 8.5,
    year: 1995,
    duration: '1 Season',
    genre: ['Animation', 'Drama', 'Mecha'],
    description: 'A teenage boy finds himself recruited as a member of an elite team of pilots by his father.',
    director: 'Hideaki Anno',
    cast: [
      { id: 801, name: 'Megumi Ogata', character: 'Shinji Ikari (voice)', profile_path: null },
      { id: 802, name: 'Megumi Hayashibara', character: 'Rei Ayanami (voice)', profile_path: null }
    ],
    providers: [MOCK_PROVIDERS[0]]
  },
  {
    id: '9',
    title: 'Drive',
    posterUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80',
    rating: 7.8,
    year: 2011,
    duration: '1h 40m',
    genre: ['Crime', 'Drama'],
    description: 'A mysterious Hollywood stuntman and mechanic moonlights as a getaway driver and finds himself in trouble when he helps his neighbor.',
    director: 'Nicolas Winding Refn',
    cast: [
      { id: 901, name: 'Ryan Gosling', character: 'Driver', profile_path: null },
      { id: 902, name: 'Carey Mulligan', character: 'Irene', profile_path: null },
      { id: 903, name: 'Bryan Cranston', character: 'Shannon', profile_path: null }
    ],
    providers: [MOCK_PROVIDERS[1]]
  },
  {
    id: '10',
    title: 'Arrival',
    posterUrl: 'https://images.unsplash.com/photo-1454789548728-85d2696cfbaf?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=80',
    rating: 7.9,
    year: 2016,
    duration: '1h 56m',
    genre: ['Drama', 'Sci-Fi'],
    description: 'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.',
    director: 'Denis Villeneuve',
    cast: [
      { id: 1001, name: 'Amy Adams', character: 'Louise Banks', profile_path: null },
      { id: 1002, name: 'Jeremy Renner', character: 'Ian Donnelly', profile_path: null },
      { id: 1003, name: 'Forest Whitaker', character: 'Colonel Weber', profile_path: null }
    ],
    providers: MOCK_PROVIDERS
  }
];
