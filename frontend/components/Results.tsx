"use client";
import { Song } from "../app/page";

interface Props {
  songs: Song[];
}

export default function Results({ songs }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {songs.map((song, i) => (
        <div
          key={i}
          className="p-4 bg-gradient-to-r from-purple-600 to-yellow-400 rounded-xl shadow-lg flex flex-col items-center text-white"
        >
          {/* Album Image */}
          {song.album_image && (
            <img
              src={song.album_image}
              alt={song.album_name}
              className="w-52 h-52 object-cover rounded-lg mb-4"
            />
          )}

          {/* Track Name and Artist */}
          <h3 className="font-bold text-xl mb-1">{song.track_name}</h3>

          {/* Audio Preview */}
          {song.preview_url && (
            <audio controls className="w-full rounded-lg mb-2">
              <source src={song.preview_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}

          {/* Spotify Link */}
          {song.spotify_url && (
            <a
              href={song.spotify_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition"
            >
              Listen on Spotify
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
