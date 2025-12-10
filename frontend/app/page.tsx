"use client";
import { useState } from "react";
import { Music } from "lucide-react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import Results from "../components/Results";

// Your Song type definition (adjust as needed)
export interface Song {
  track_name: string;
  preview_url?: string | null;
  spotify_url?: string | null;
  album_name?: string | null;
  album_image?: string | null;
  artist_name?: string | null;
  artists?: string | null;
}

export default function Page() {
  const [results, setResults] = useState<Song[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent mb-4">
            Discover Your Next Favorite Song
          </h1>
          <p className="text-gray-600 text-lg">
            Enter a song you love and we'll recommend similar tracks
          </p>
        </div>

        <SearchBar setResults={setResults} />

        {results.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Recommended for You
            </h2>
            <Results songs={results} />
          </div>
        )}

        {results.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto">
              <Music className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Search for a song to get started
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

