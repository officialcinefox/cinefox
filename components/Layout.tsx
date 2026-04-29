import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LogOut, ChevronDown, Facebook, Instagram, Twitter, Youtube, Mail, Phone, Info, UserRound, Heart, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MOVIE_CATEGORIES, WEBSERIES_CATEGORIES } from '../constants';
import { Movie } from '../types';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { user, logout, favoriteMovies, recentlyViewed, setSearchQuery, searchMovies, getSearchSuggestions, fetchMoviesByCategory } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsProfileMenuOpen(false);
    setIsMobileCategoriesOpen(false);
    setIsSuggestionsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const query = searchInput.trim();
    let isActive = true;

    if (query.length < 1) {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
      return () => {
        isActive = false;
      };
    }

    const timer = window.setTimeout(() => {
      void getSearchSuggestions(query).then(results => {
        if (!isActive) return;
        setSuggestions(results);
        setIsSuggestionsOpen(results.length > 0);
      });
    }, 50);

    return () => {
      isActive = false;
      window.clearTimeout(timer);
    };
  }, [searchInput]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (query) {
      setSearchQuery(query);
      void searchMovies(query);
      navigate('/movies');
      setIsMobileMenuOpen(false);
      setIsSuggestionsOpen(false);
    }
  };

  const handleSuggestionClick = (movie: Movie) => {
    setSearchInput('');
    setSearchQuery('');
    navigate(movie.mediaType === 'tv' ? `/series/${movie.id}` : `/movie/${movie.id}`);
    setIsMobileMenuOpen(false);
    setIsSuggestionsOpen(false);
  };

  const handleLogout = () => {
    void logout();
    navigate('/');
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleCategoryClick = (category: string) => {
    fetchMoviesByCategory(category);
    navigate('/');
    setIsMobileMenuOpen(false);
    setIsMobileCategoriesOpen(false);
  };

  const categories = MOVIE_CATEGORIES;
  const navLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-netflix-red' : 'text-gray-300 hover:text-white'}`;
  };
  const mobileNavLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `px-3 py-2 text-base font-medium transition-colors ${isActive ? 'border-l-4 border-netflix-red text-netflix-red' : 'text-gray-400 hover:text-white'}`;
  };

  return (
    <nav className={`fixed w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-netflix-black shadow-lg' : 'bg-gradient-to-b from-black/90 via-black/70 to-transparent'}`}>
      <div className="w-full px-4 lg:px-8 2xl:px-12">
        <div className="flex h-16 items-center gap-5 2xl:gap-8">
          
          {/* Logo */}
          <div className="flex flex-none items-center">
            <Link to="/" onClick={() => handleCategoryClick('All')} className="flex items-center select-none min-w-max">
                {!logoError ? (
                  <img 
                    src="https://i.ibb.co/ycymH7Mt/Cinefox-logo.png" 
                    alt="CineFox" 
                    className="h-10 md:h-12 w-auto object-contain" 
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="text-netflix-red font-black text-2xl md:text-3xl tracking-tighter flex items-center">
                      CINE<span className="text-white">FOX</span>
                  </div>
                )}
            </Link>
          </div>

          {/* Center Desktop Nav */}
          <div className="hidden min-w-0 flex-1 justify-center xl:flex">
            <div className="flex items-baseline gap-2 2xl:gap-4">
              <Link to="/" className={navLinkClass('/')}>Home</Link>
              
              {/* Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Categories <ChevronDown size={14} />
                </button>
                <div className="no-scrollbar absolute left-1/2 top-full z-50 mt-2 max-h-[70vh] w-64 -translate-x-1/2 overflow-y-auto rounded border border-zinc-800 bg-black/95 shadow-xl opacity-0 invisible transition-all duration-200 group-hover:visible group-hover:opacity-100">
                   {categories.map(cat => (
                     <button
                       key={cat}
                       onClick={() => handleCategoryClick(cat)}
                       className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white first:rounded-t last:rounded-b"
                     >
                       {cat} Movies
                     </button>
                   ))}
                </div>
              </div>

              <Link to="/movies" className={navLinkClass('/movies')}>Movies</Link>
              <Link to="/webseries" className={navLinkClass('/webseries')}>Webseries</Link>
              <Link to="/ott" className={navLinkClass('/ott')}>OTT</Link>
              <Link to="/about" className={navLinkClass('/about')}>About Us</Link>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="hidden flex-none items-center gap-4 xl:flex 2xl:gap-6">
            
            {/* Always visible Search Bar */}
            <div className="relative flex h-11 w-[min(25vw,420px)] min-w-[280px] items-center rounded-full border border-zinc-700 bg-zinc-900/80 px-4">
               <Search size={16} className="text-gray-400 mr-2 flex-shrink-0" />
               <form onSubmit={handleSearchSubmit} className="flex-1 h-full flex items-center">
                 <input 
                    type="text" 
                    placeholder="Search movies & webseries..." 
                    className="bg-transparent text-white text-sm outline-none w-full placeholder-gray-500 h-full p-0 m-0 leading-normal flex items-center"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onFocus={() => setIsSuggestionsOpen(suggestions.length > 0)}
                 />
               </form>
               {isSuggestionsOpen && suggestions.length > 0 && (
                 <div className="absolute left-0 right-0 top-full z-[90] mt-3 overflow-hidden rounded-xl border border-zinc-800 bg-black/95 shadow-2xl backdrop-blur-md">
                   {suggestions.map(item => (
                     <button
                       key={`${item.mediaType || 'movie'}-${item.id}`}
                       type="button"
                       onMouseDown={(event) => event.preventDefault()}
                       onClick={() => handleSuggestionClick(item)}
                       className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-zinc-900"
                     >
                       <img src={item.posterUrl} alt={item.title} className="h-12 w-8 rounded object-cover" />
                       <span className="min-w-0 flex-1">
                         <span className="block truncate text-sm font-semibold text-white">{item.title}</span>
                         <span className="text-xs text-gray-500">{item.mediaType === 'tv' ? 'Webseries' : 'Movie'} - {item.year}</span>
                       </span>
                     </button>
                   ))}
                 </div>
               )}
            </div>
            
            {user ? (
              <div className="relative">
                 <button
                   onClick={() => setIsProfileMenuOpen(prev => !prev)}
                   className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-red-600 text-lg font-bold text-white shadow-lg shadow-black/20 transition hover:border-white/30 hover:bg-red-700"
                   aria-expanded={isProfileMenuOpen}
                   aria-label="Open profile menu"
                 >
                   {user.avatarUrl ? (
                     <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                   ) : (
                     user.name.charAt(0).toUpperCase()
                   )}
                 </button>

                 {isProfileMenuOpen && (
                   <div className="absolute right-0 top-full mt-3 w-72 overflow-hidden rounded-lg border border-zinc-800 bg-black/95 shadow-2xl backdrop-blur-md">
                     <div className="flex items-center gap-3 border-b border-zinc-800 p-4">
                       <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-red-600 text-sm font-bold text-white">
                         {user.avatarUrl ? (
                           <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                         ) : (
                           user.name.charAt(0).toUpperCase()
                         )}
                       </div>
                       <div className="min-w-0">
                         <p className="truncate font-semibold text-white">{user.name}</p>
                         <p className="truncate text-xs text-gray-400">{user.email}</p>
                       </div>
                     </div>
                     <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 transition hover:bg-zinc-900 hover:text-white">
                       <UserRound size={16} /> Profile
                     </Link>
                     <Link to="/favorites" className="flex items-center justify-between px-4 py-3 text-sm text-gray-300 transition hover:bg-zinc-900 hover:text-white">
                       <span className="flex items-center gap-3"><Heart size={16} /> My List</span>
                       <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs">{favoriteMovies.length}</span>
                     </Link>
                     <Link to="/profile" className="flex items-center justify-between px-4 py-3 text-sm text-gray-300 transition hover:bg-zinc-900 hover:text-white">
                       <span className="flex items-center gap-3"><Clock size={16} /> Recent</span>
                       <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs">{recentlyViewed.length}</span>
                     </Link>
                     <button onClick={handleLogout} className="flex w-full items-center gap-3 border-t border-zinc-800 px-4 py-3 text-left text-sm text-gray-300 transition hover:bg-zinc-900 hover:text-white">
                        <LogOut size={16} /> Sign out
                     </button>
                   </div>
                 )}
              </div>
            ) : (
              <Link to="/login" className="bg-netflix-red text-white px-4 py-1.5 rounded hover:bg-red-700 transition font-medium text-sm">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="ml-auto flex items-center xl:hidden">
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2 hover:bg-zinc-800 rounded transition-colors">
               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm xl:hidden">
          <div className="no-scrollbar flex h-full w-full animate-mobile-drawer flex-col gap-5 overflow-y-auto bg-black/95 p-5 shadow-2xl">
             <div className="flex items-center justify-end">
               <button
                 onClick={() => setIsMobileMenuOpen(false)}
                 className="rounded-full p-2 text-white transition hover:bg-zinc-800"
                 aria-label="Close menu"
               >
                 <X size={24} />
               </button>
             </div>

             <form onSubmit={handleSearchSubmit} className="relative w-full">
               <div className="flex h-12 w-full items-center rounded border border-zinc-700 bg-zinc-900 px-3">
                  <Search className="mr-3 text-gray-400" size={20} />
                  <input 
                      type="text" 
                      placeholder="Search movies & webseries..." 
                      className="flex h-full w-full items-center bg-transparent text-white outline-none placeholder-gray-500"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onFocus={() => setIsSuggestionsOpen(suggestions.length > 0)}
                  />
               </div>
               {isSuggestionsOpen && suggestions.length > 0 && (
                 <div className="mt-2 overflow-hidden rounded-lg border border-zinc-800 bg-black/95">
                   {suggestions.slice(0, 5).map(item => (
                     <button
                       key={`${item.mediaType || 'movie'}-${item.id}-mobile`}
                       type="button"
                       onClick={() => handleSuggestionClick(item)}
                       className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-zinc-900"
                     >
                       <img src={item.posterUrl} alt={item.title} className="h-11 w-8 rounded object-cover" />
                       <span className="min-w-0 flex-1">
                         <span className="block truncate text-sm font-semibold text-white">{item.title}</span>
                         <span className="text-xs text-gray-500">{item.mediaType === 'tv' ? 'Webseries' : 'Movie'} - {item.year}</span>
                       </span>
                     </button>
                   ))}
                 </div>
               )}
             </form>
             
             <div className="flex flex-col gap-2">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/')}>Home</Link>
                
                <div className="border-l border-zinc-800">
                   <button
                     type="button"
                     onClick={() => setIsMobileCategoriesOpen(prev => !prev)}
                     className="flex w-full items-center justify-between px-3 py-2 text-left text-base font-medium text-gray-300 hover:text-white"
                     aria-expanded={isMobileCategoriesOpen}
                   >
                     Categories
                     <ChevronDown size={18} className={`transition-transform ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} />
                   </button>
                   {isMobileCategoriesOpen && (
                     <div className="no-scrollbar ml-3 max-h-[38vh] space-y-1 overflow-y-auto border-l border-zinc-800 py-2 pl-3">
                       {categories.map(cat => (
                         <button
                            key={cat}
                            onClick={() => handleCategoryClick(cat)}
                            className="block w-full rounded px-2 py-1.5 text-left text-sm text-gray-400 hover:bg-zinc-900 hover:text-white"
                         >
                           {cat}
                         </button>
                       ))}
                     </div>
                   )}
                </div>

                <Link to="/movies" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/movies')}>Movies</Link>
                <Link to="/webseries" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/webseries')}>Webseries</Link>
                <Link to="/ott" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/ott')}>OTT</Link>
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/about')}>About Us</Link>
             </div>

             <div className="mt-auto border-t border-zinc-800 pb-8 pt-6">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-white">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-red-600 font-bold">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded bg-zinc-800 px-4 py-3 text-gray-200 hover:text-white"
                    >
                      <span className="flex items-center gap-2"><UserRound size={18} /> Profile</span>
                      <span className="text-xs text-gray-400">{favoriteMovies.length} saved</span>
                    </Link>
                    <button onClick={handleLogout} className="mt-2 flex w-full items-center justify-center gap-2 rounded bg-zinc-800 py-2 text-gray-300 hover:text-white">
                      <LogOut size={20} /> Sign Out
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full rounded bg-netflix-red py-3 text-center font-bold text-white"
                  >
                    Sign In
                  </Link>
                )}
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const { fetchMoviesByCategory, fetchSeriesByCategory } = useStore();
  const navigate = useNavigate();
  const [logoError, setLogoError] = useState(false);

  const handleFooterCategory = (cat: string) => {
    fetchMoviesByCategory(cat);
    navigate('/');
    window.scrollTo(0,0);
  };

  const handleFooterSeriesCategory = (cat: string) => {
    fetchSeriesByCategory(cat);
    navigate('/webseries');
    window.scrollTo(0,0);
  };
  return (
    <footer className="bg-black text-gray-400 py-16 px-4 border-t border-zinc-900 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Brand & Socials - Centered Top Section */}
        <div className="flex flex-col items-center text-center space-y-6">
           <div className="flex items-center select-none">
              {!logoError ? (
                <img 
                  src="https://i.ibb.co/ycymH7Mt/Cinefox-logo.png" 
                  alt="CineFox" 
                  className="h-16 w-auto object-contain" 
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="text-netflix-red font-black text-4xl tracking-tighter flex items-center">
                    CINE<span className="text-white">FOX</span>
                </div>
              )}
           </div>
           <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
             The ultimate destination for movie and webseries lovers. Discover, track, and explore stories across every category.
           </p>
           <div className="flex items-center gap-6 text-white">
             <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><Facebook size={20} className="hover:text-netflix-red transition" /></a>
             <a href="https://www.instagram.com/abhi_dagar63?igsh=MWg2ejIwaGk1cGd2Nw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer"><Instagram size={20} className="hover:text-netflix-red transition" /></a>
             <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><Twitter size={20} className="hover:text-netflix-red transition" /></a>
             <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><Youtube size={20} className="hover:text-netflix-red transition" /></a>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-3 md:gap-6 md:text-left xl:grid-cols-5">
            
            {/* Explore */}
            <div className="flex flex-col items-center md:items-start">
               <h3 className="text-white font-bold mb-6">Explore</h3>
               <ul className="space-y-4 text-sm">
                 <li><Link to="/" className="hover:text-white transition hover:underline">Home</Link></li>
                 <li><Link to="/movies" className="hover:text-white transition hover:underline">Movies</Link></li>
                 <li><Link to="/webseries" className="hover:text-white transition hover:underline">Webseries</Link></li>
                 <li><Link to="/ott" className="hover:text-white transition hover:underline">OTT</Link></li>
                 <li><Link to="/favorites" className="hover:text-white transition hover:underline">My List</Link></li>
               </ul>
            </div>

            {/* Movie Categories */}
            <div className="flex flex-col items-center md:items-start">
               <h3 className="text-white font-bold mb-6">Movie Categories</h3>
               <ul className="space-y-4 text-sm">
                 {MOVIE_CATEGORIES.filter(cat => cat !== 'All').slice(0, 8).map(cat => (
                   <li key={cat}>
                     <button onClick={() => handleFooterCategory(cat)} className="hover:text-white transition hover:underline">{cat}</button>
                   </li>
                 ))}
               </ul>
            </div>

            {/* Webseries Categories */}
            <div className="flex flex-col items-center md:items-start">
               <h3 className="text-white font-bold mb-6">Webseries</h3>
               <ul className="space-y-4 text-sm">
                 {WEBSERIES_CATEGORIES.filter(cat => cat !== 'All').map(cat => (
                   <li key={cat}>
                     <button onClick={() => handleFooterSeriesCategory(cat)} className="hover:text-white transition hover:underline">{cat}</button>
                   </li>
                 ))}
               </ul>
            </div>

            {/* Company */}
            <div className="flex flex-col items-center md:items-start">
               <h3 className="text-white font-bold mb-6">Company</h3>
               <ul className="space-y-4 text-sm">
                 <li><Link to="/terms" className="hover:text-white transition hover:underline">Terms of Service</Link></li>
                 <li><Link to="/privacy" className="hover:text-white transition hover:underline">Privacy Policy</Link></li>
               </ul>
            </div>

            {/* Contact Us */}
            <div className="flex flex-col items-center md:items-start">
               <h3 className="text-white font-bold mb-6">Contact Us</h3>
               <ul className="space-y-4 text-sm text-gray-400">
                 {/* About Us Link moved here as requested */}
                 <li className="flex flex-col md:flex-row items-center md:items-start gap-2 mb-2">
                    <Info size={16} className="text-netflix-red md:mt-1 shrink-0" />
                    <Link to="/about" className="hover:text-white transition hover:underline">About Us</Link>
                 </li>
                 <li className="flex flex-col md:flex-row items-center md:items-start gap-2">
                    <Mail size={16} className="text-netflix-red md:mt-1 shrink-0" />
                    <a href="mailto:officialcinefox@gmail.com" className="hover:text-white transition hover:underline break-all">officialcinefox@gmail.com</a>
                 </li>
                 <li className="flex flex-col md:flex-row items-center md:items-start gap-2">
                    <Phone size={16} className="text-netflix-red md:mt-1 shrink-0" />
                    <a href="tel:+918440003711" className="hover:text-white transition hover:underline">+91 8440003711</a>
                 </li>
               </ul>
            </div>

        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-800 text-xs text-gray-500 flex flex-col items-center gap-4 text-center">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
            <p>&copy; 2026 CineFox, Inc. All rights reserved.</p>
            <p>Designed for movie, webseries, and OTT enthusiasts.</p>
        </div>
        <div className="space-y-1 mt-4 border-t border-zinc-800/50 pt-4 w-full opacity-70">
            <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
            <p>Trailers and videos are embedded from YouTube. We do not host or store any video files.</p>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-netflix-black text-white flex flex-col">
      <Navbar />
      <main className="flex-grow relative">
        {children}
      </main>
      <Footer />
    </div>
  );
};
