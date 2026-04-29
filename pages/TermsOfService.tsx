import React from 'react';
import { ScrollText, ShieldCheck } from 'lucide-react';

export const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-netflix-black text-white pt-24 pb-12 px-4 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
            Terms of <span className="text-netflix-red">Service</span>
          </h1>
          <p className="text-gray-400">Last updated: May 2024</p>
        </div>

        <div className="space-y-8 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <ScrollText className="text-netflix-red" size={24} /> 1. Acceptance of Terms
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              By accessing and using CineFox ("the Website"), you agree to comply with and be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Description of Service</h2>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              CineFox provides users with information about movies, including metadata, trailers, and streaming availability. 
              We do not host any video content on our servers. All movie information is provided for educational and informational purposes only.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. User Conduct</h2>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              You agree to use the Website only for lawful purposes. You are prohibited from violating or attempting to violate the security of the Website, 
              including accessing data not intended for you or attempting to probe, scan, or test the vulnerability of the system.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Intellectual Property</h2>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              The content, organization, graphics, design, and other matters related to the Website are protected under applicable copyrights and other proprietary laws. 
              CineFox claims no ownership over the movie metadata or posters, which are property of their respective owners and provided via the TMDB API.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Third-Party Links</h2>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              Our Service may contain links to third-party web sites or services that are not owned or controlled by CineFox. 
              CineFox has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party web sites or services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">6. Disclaimer of Warranties</h2>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              The service is provided on an "AS IS" and "AS AVAILABLE" basis. CineFox makes no representations or warranties of any kind, 
              express or implied, as to the operation of their services, or the information, content, or materials included therein.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">7. Changes to Terms</h2>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              Your continued use of the Service following the posting of any changes to these Terms of Service constitutes acceptance of those changes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">8. API Services & Disclaimers</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed text-sm md:text-base">
                <p>
                    <strong>TMDB API:</strong> This product uses the TMDB API but is not endorsed or certified by TMDB. 
                    All movie metadata and imagery are provided by The Movie Database (TMDB).
                </p>
                <p>
                    <strong>YouTube Services:</strong> This website uses YouTube API Services to display video content. 
                    By using this website, you agree to be bound by the YouTube Terms of Service. 
                    We do not host or store any video files on our servers; content is embedded directly from YouTube.
                </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};