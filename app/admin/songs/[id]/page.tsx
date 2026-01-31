"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, TextArea } from "@/app/components/elements";
import { mockSongs } from "../mockData";

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function AdminSongDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState("");

  const song = mockSongs.find((s) => s.id === params.id);

  if (!song) {
    return (
      <div className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy dark:text-cream mb-4">
            Song Not Found
          </h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const handlePublish = () => {
    console.log("Publishing song:", song.id, "Note:", note);
    // TODO: Implement publish logic
    router.push("/admin/songs");
  };

  const handleReject = () => {
    console.log("Rejecting song:", song.id, "Note:", note);
    // TODO: Implement reject logic
    router.push("/admin/songs");
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Song Information */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-navy dark:text-cream">
              {song.name}
            </h1>
            <p className="text-slate dark:text-cream/70 mt-1">
              by {song.artistName}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoCard label="ID" value={`#${song.id}`} />
            <InfoCard label="Language" value={song.language} />
            <InfoCard label="Genre" value={song.genre} />
            <InfoCard label="Uploader" value={song.uploader} />
            <InfoCard label="Created" value={formatDate(song.createdAt)} />
            <InfoCard
              label="Published"
              value={song.publishedAt ? formatDate(song.publishedAt) : "Not published"}
              muted={!song.publishedAt}
            />
          </div>

          {/* Original Lyrics */}
          <div>
            <h2 className="text-lg font-semibold text-navy dark:text-cream mb-3">
              Original Lyrics ({song.language})
            </h2>
            <div className="rounded-xl border border-slate/20 dark:border-cream/10 bg-slate/5 dark:bg-cream/5 p-4">
              <pre className="whitespace-pre-wrap text-sm text-navy dark:text-cream font-sans">
                {song.lyrics}
              </pre>
            </div>
          </div>
        </div>

        {/* Translation & Actions */}
        <div className="space-y-6">
          {song.translationLanguage && (
            <>
              <div>
                <h2 className="text-lg font-semibold text-navy dark:text-cream mb-1">
                  Translation ({song.translationLanguage})
                </h2>
                {song.translatedName && (
                  <p className="text-slate dark:text-cream/70">
                    {song.translatedName}
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-slate/20 dark:border-cream/10 bg-slate/5 dark:bg-cream/5 p-4">
                <pre className="whitespace-pre-wrap text-sm text-navy dark:text-cream font-sans">
                  {song.translatedLyrics}
                </pre>
              </div>
            </>
          )}

          {!song.translationLanguage && (
            <div className="rounded-xl border border-slate/20 dark:border-cream/10 bg-slate/5 dark:bg-cream/5 p-8 text-center">
              <p className="text-slate/50 dark:text-cream/40 italic">
                No translation provided
              </p>
            </div>
          )}

          {/* Admin Actions */}
          <div className="rounded-xl border border-slate/20 dark:border-cream/10 p-6 space-y-4">
            <TextArea
              label="Note (Optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note for the uploader..."
              rows={4}
            />

            <div className="flex gap-3">
              <Button
                onClick={handleReject}
                variant="danger"
                className="flex-1"
              >
                Reject
              </Button>
              <Button onClick={handlePublish} className="flex-1">
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate/20 dark:border-cream/10 p-3">
      <p className="text-xs text-slate dark:text-cream/50 mb-1">{label}</p>
      <p
        className={`text-sm font-medium ${
          muted
            ? "text-slate/50 dark:text-cream/40 italic"
            : "text-navy dark:text-cream"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
