"use client";
import { useState } from "react";
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
      // 1️⃣ Get recommendations
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
    <div className="flex gap-2 justify-center mb-6">
      <input
        type="text"
        placeholder="Search a song..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-4 py-2 rounded-lg w-full max-w-md focus:outline-none border border-purple-400"
      />
      <button
        onClick={searchSong}
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-linear-to-r from-purple-500 to-yellow-400 text-white font-semibold"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}
