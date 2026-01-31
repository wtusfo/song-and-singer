import Image from "next/image";
import Link from "next/link";
import { Song } from "@/app/admin/songs/mockData";

interface SongCardProps {
  song: Song;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

function SongCard({ song }: SongCardProps) {
  return (
    <Link href={`/songs/${song.id}`} className="group block">
      <div className="p-4 rounded-2xl border space-y-2 border-slate/20 dark:border-cream/10 overflow-hidden bg-white dark:bg-navy/50 transition-all hover:shadow-lg hover:shadow-slate/10 dark:hover:shadow-black/20 hover:border-teal/30 dark:hover:border-gold/30">
        {/* Poster */}
        <div className="aspect-3/2 rounded-xl relative overflow-hidden bg-slate/10 dark:bg-cream/5">
          <Image
            src={song.poster}
            alt={song.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/* Info */}
        <div className="space-y-2">
          <h2 className="font-semibold text-navy dark:text-cream truncate">
            {song.name}
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate dark:text-cream/70">
            <span className="px-2 py-0.5 rounded-md bg-slate/10 dark:bg-cream/10 text-xs">
              {song.language}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-teal/10 dark:bg-gold/10 text-teal dark:text-gold text-xs">
              {song.genre}
            </span>
          </div>
          {song.publishedAt && (
            <p className="text-xs text-slate/70 dark:text-cream/50">
              {formatDate(song.publishedAt)}
            </p>
          )}
          <p className="text-xs text-slate/50 dark:text-cream/40 truncate">
            by {song.uploader}
          </p>
        </div>
      </div>
    </Link>
  );
}

export { SongCard };
