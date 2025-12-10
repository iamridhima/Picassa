"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Song } from "../app/page";

interface Props {
  setResults: (res: Song[]) => void;
}

export default function SearchBar({ setResults }: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const searchSong = async () => {
    if (!query) return;
    setLoading(true);

    try {
      const recRes = await fetch(`http://localhost:8000/recommend/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ song_name: query }),
      });
      const recData = await recRes.json();
      const songs: Song[] = recData.recommendations;

      // 2️⃣ Get Spotify previews for each song
      const songsWithSpotifyData = await Promise.all(
        songs.map(async (s) => {
          try {
            const spRes = await fetch(
              `http://localhost:8000/spotify/?q=${encodeURIComponent(s.track_name)}`
            );
            const spData = await spRes.json();
            const firstResult = spData.results[0] || {};

            return {
              ...s,
              preview_url: firstResult.preview_url || s.preview_url || null,
              spotify_url: firstResult.spotify_url || s.spotify_url || null,
              album_name: firstResult.album_name || s.album_name || null,
              album_image: firstResult.album_image || s.album_image || null,
              artist_name: firstResult.artist_name || s.artists || null,
            };
          } catch (err) {
            console.error(err);
            return s;
          }
        })
      );

      setResults(songsWithSpotifyData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-12">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a song to get recommendations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && searchSong()}
          className="w-full px-6 py-4 pr-32 rounded-xl bg-white shadow-sm border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-800 placeholder-gray-400 transition-all"
        />
        <button
          onClick={searchSong}
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Searching...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Search
            </>
          )}
        </button>
      </div>
    </div>
  );
}