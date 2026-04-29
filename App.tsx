import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Movies } from './pages/Movies';
import { Webseries } from './pages/Webseries';
import { Ott } from './pages/Ott';
import { Favorites } from './pages/Favorites';
import { MovieDetail } from './pages/MovieDetail';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { AboutUs } from './pages/AboutUs';
import { TermsOfService } from './pages/TermsOfService';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { ResetPassword } from './pages/ResetPassword';

const ScrollToTop = () => {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return null;
};

// Wrapper for pages with Layout (Navbar/Footer)
const LayoutRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

// Wrapper for pages without Layout (Auth pages often look better standalone)
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      {/* Simple Header for Auth Pages */}
      <div className="absolute top-0 left-0 p-6 z-10">
         <Link to="/" className="flex items-center gap-1 select-none">
            {!logoError ? (
              <img 
                src="https://i.ibb.co/ycymH7Mt/Cinefox-logo.png" 
                alt="CineFox" 
                className="h-12 md:h-16 w-auto object-contain" 
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="text-netflix-red font-black text-3xl md:text-5xl tracking-tighter flex items-center">
                  CINE<span className="text-white">FOX</span>
              </div>
            )}
         </Link>
      </div>
      {children}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LayoutRoute><Home /></LayoutRoute>} />
          <Route path="/movies" element={<LayoutRoute><Movies /></LayoutRoute>} />
          <Route path="/webseries" element={<LayoutRoute><Webseries /></LayoutRoute>} />
          <Route path="/ott" element={<LayoutRoute><Ott /></LayoutRoute>} />
          <Route path="/favorites" element={<LayoutRoute><Favorites /></LayoutRoute>} />
          <Route path="/profile" element={<LayoutRoute><Profile /></LayoutRoute>} />
          <Route path="/movie/:id" element={<LayoutRoute><MovieDetail /></LayoutRoute>} />
          <Route path="/series/:id" element={<LayoutRoute><MovieDetail mediaType="tv" /></LayoutRoute>} />
          <Route path="/about" element={<LayoutRoute><AboutUs /></LayoutRoute>} />
          <Route path="/terms" element={<LayoutRoute><TermsOfService /></LayoutRoute>} />
          <Route path="/privacy" element={<LayoutRoute><PrivacyPolicy /></LayoutRoute>} />
          
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/reset-password" element={<AuthRoute><ResetPassword /></AuthRoute>} />
          <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;
