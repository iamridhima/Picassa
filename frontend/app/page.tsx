"use client";
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import Results from "../components/Results";

export interface Song {
  track_name: string;
  artists: string;
  album_name: string;
  similarity: number;
  spotify_url?: string;   // optional because recommendation API may not have it
  album_image?: string;   // optional for the same reason
  preview_url?: string; // from Spotify
}

export default function Home() {
  const [results, setResults] = useState<Song[]>([]);

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold text-center mb-6 text-purple-700">Picassa Music Recommender</h1>
      <SearchBar setResults={setResults} />
      {results.length > 0 && <Results songs={results} />}
    </main>
  );
}
