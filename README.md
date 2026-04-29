<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CineFox

This contains everything you need to run the app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1K4jsQOxuGsgnYyiQ-n1ehcAF4lLcKmNh

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `VITE_TMDB_API_KEY` in `.env.local` to your TMDB API key:
   `VITE_TMDB_API_KEY=your_tmdb_v3_api_key`
3. Run the app:
   `npm run dev`

Movie data comes from TMDB, not Gemini. After changing `.env.local`, restart the dev server so Vite can reload the environment variable.
