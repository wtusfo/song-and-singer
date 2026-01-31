"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/app/components/elements";
import { mockSongs } from "@/app/admin/songs/mockData";

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export default function SongPage() {
  const params = useParams();
  const router = useRouter();

  const song = mockSongs.find((s) => s.id === params.id && s.publishedAt !== null);

  if (!song) {
    return (
      <div className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy dark:text-cream mb-4">
            Song Not Found
          </h1>
          <p className="text-slate dark:text-cream/70 mb-6">
            The song you&apos;re looking for doesn&apos;t exist or hasn&apos;t been published yet.
          </p>
          <Button onClick={() => router.push("/songs")}>Back to Songs</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate dark:text-cream/70 hover:text-navy dark:hover:text-cream transition-colors mb-6 cursor-pointer"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Songs
      </button>

      {/* Header - Song name & Uploader */}
      <div className="flex items-start justify-between mb-8">
        <h1 className="text-2xl font-bold text-navy dark:text-cream">
          {song.name}
        </h1>
        <p className="text-sm text-slate dark:text-cream/70">
          Uploaded by {song.uploader}
        </p>
      </div>

      {/* Lyrics - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Original Lyrics */}
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-navy dark:text-cream mb-1">
            Lyrics ({song.language})
          </h2>
          <p className="text-slate dark:text-cream/70 mb-2 text-sm">&nbsp;</p>
          <div className="rounded-xl border border-slate/20 dark:border-cream/10 bg-slate/5 dark:bg-cream/5 p-6 min-h-64 flex-1">
            <pre className="whitespace-pre-wrap text-navy dark:text-cream font-sans leading-relaxed">
              {song.lyrics}
            </pre>
          </div>
        </div>

        {/* Translation */}
        <div className="flex flex-col">
          {song.translationLanguage && song.translatedLyrics ? (
            <>
              <h2 className="text-lg font-semibold text-navy dark:text-cream mb-1">
                Translation ({song.translationLanguage})
              </h2>
              <p className="text-slate dark:text-cream/70 mb-2 text-sm">
                {song.translatedName || "\u00A0"}
              </p>
              <div className="rounded-xl border border-slate/20 dark:border-cream/10 bg-slate/5 dark:bg-cream/5 p-6 min-h-64 flex-1">
                <pre className="whitespace-pre-wrap text-navy dark:text-cream font-sans leading-relaxed">
                  {song.translatedLyrics}
                </pre>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-navy dark:text-cream mb-1">
                Translation
              </h2>
              <p className="text-slate dark:text-cream/70 mb-2 text-sm">&nbsp;</p>
              <div className="rounded-xl border border-slate/20 dark:border-cream/10 bg-slate/5 dark:bg-cream/5 p-6 min-h-64 flex-1 flex items-center justify-center">
                <p className="text-slate/50 dark:text-cream/40 italic">
                  No translation available
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Song Info - Bottom */}
      <div className="rounded-xl border border-slate/20 dark:border-cream/10 p-6">
        <div className="flex flex-wrap items-center gap-6">
          {/* Poster */}
          <div className="rounded-lg overflow-hidden border border-slate/20 dark:border-cream/10 w-24 h-24 relative shrink-0">
            <Image
              src={song.poster}
              alt={song.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>

          {/* Info */}
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <p className="text-xs text-slate/70 dark:text-cream/50 mb-1">Artist</p>
              <p className="text-sm font-medium text-navy dark:text-cream">{song.artistName}</p>
            </div>
            <div>
              <p className="text-xs text-slate/70 dark:text-cream/50 mb-1">Language</p>
              <p className="text-sm font-medium text-navy dark:text-cream">{song.language}</p>
            </div>
            <div>
              <p className="text-xs text-slate/70 dark:text-cream/50 mb-1">Genre</p>
              <p className="text-sm font-medium text-teal dark:text-gold">{song.genre}</p>
            </div>
            <div>
              <p className="text-xs text-slate/70 dark:text-cream/50 mb-1">Published</p>
              <p className="text-sm font-medium text-navy dark:text-cream">{formatDate(song.publishedAt!)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
