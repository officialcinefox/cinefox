import React from 'react';
import { Lock, Eye, Database } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-netflix-black text-white pt-24 pb-12 px-4 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
            Privacy <span className="text-netflix-red">Policy</span>
          </h1>
          <p className="text-gray-400">Last updated: May 2024</p>
        </div>

        <div className="space-y-8 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Lock className="text-netflix-red" size={24} /> 1. Information We Collect
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              CineFox is committed to protecting your privacy. Currently, we collect minimal personal information. 
              When you "Sign Up" or "Login" for the demo experience, the data (name, email) is stored locally on your device using LocalStorage. 
              We do not transmit this data to any remote server.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Eye className="text-netflix-red" size={24} /> 2. Usage Data
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              We may collect non-personal identification information about Users whenever they interact with our Site. 
              This may include the browser name, the type of computer, and technical information about your means of connection to our Site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Database className="text-netflix-red" size={24} /> 3. Cookies and Local Storage
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              Our site uses "Local Storage" to enhance User experience. This allows us to persist your "Favorites" list and your 
              "Logged In" state across sessions. You can clear this data at any time by clearing your browser cache.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Third-Party Services</h2>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              We use third-party API services to provide content:
            </p>
            <ul className="list-disc list-inside text-gray-400 text-sm md:text-base ml-4 space-y-2">
                <li>
                    <strong>The Movie Database (TMDB):</strong> We use the TMDB API to fetch movie data and images. 
                    For more information, please refer to <a href="https://www.themoviedb.org/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-netflix-red hover:underline">TMDB's Privacy Policy</a>.
                </li>
                <li>
                    <strong>YouTube API Services:</strong> We use YouTube to display movie trailers. 
                    Users are encouraged to read <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-netflix-red hover:underline">Google's Privacy Policy</a>.
                </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Security</h2>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              The security of your data is important to us, but remember that no method of transmission over the Internet, 
              or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, 
              we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">6. Contact Us</h2>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              If you have any questions about this Privacy Policy, please contact us via email at <span className="text-white font-semibold">officialcinefox@gmail.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};