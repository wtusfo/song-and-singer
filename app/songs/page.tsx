import { mockSongs } from "@/app/admin/songs/mockData";
import { SongCard } from "./SongCard";

// Only show published songs
const publishedSongs = mockSongs.filter((song) => song.publishedAt !== null);

export default function SongsPage() {
  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {publishedSongs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
}