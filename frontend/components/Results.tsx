"use client";
import { useState } from "react";
import { Music } from "lucide-react";
import { Song } from "../app/page";

interface Props {
  songs: Song[];
}

export default function Results({ songs }: Props) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {songs.map((song, i) => (
        <div
          key={i}
          className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
        >
          {/* Album Image with Overlay */}
          <div className="relative overflow-hidden bg-gray-100">
            {song.album_image ? (
              <>
                <img
                  src={song.album_image}
                  alt={song.album_name || "Album"}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </>
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Music className="w-20 h-20 text-gray-300" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Track Name */}
            <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
              {song.track_name}
            </h3>

            {/* Artist Name */}
            <p className="text-gray-500 text-sm mb-5">
              {song.artist_name || song.artists || "Unknown Artist"}
            </p>

            {/* Audio Preview */}
            {song.preview_url && (
              <div className="mb-4">
                <audio
                  controls
                  className="w-full h-10 rounded-lg"
                  onPlay={() => setPlayingIndex(i)}
                  onPause={() => setPlayingIndex(null)}
                >
                  <source src={song.preview_url} type="audio/mpeg" />
                </audio>
              </div>
            )}

            {/* Spotify Link */}
            {song.spotify_url && (
              <a
                href={song.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-all shadow-sm hover:shadow-md"
              >
                Listen on Spotify
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}