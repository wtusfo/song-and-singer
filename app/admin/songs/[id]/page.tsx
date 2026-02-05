"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { Button, TextArea } from "@/app/components/elements";
import { useAdminSong, ADMIN_SONGS_LIST_KEY_PREFIX } from "@/hooks/swr";

const formatDate = (dateString: string | null) => {
  if (!dateString) return null;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

export default function AdminSongDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: song, isLoading, error } = useAdminSong(params.id);

  const handleDecision = async (decision: "APPROVE" | "REJECT") => {
    if (!song) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/songs/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: song.id.toString(),
          decision,
          note: note || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit decision");
      }

      mutate((key) => typeof key === "string" && key.startsWith(ADMIN_SONGS_LIST_KEY_PREFIX), undefined, { revalidate: true });

      router.push("/admin/songs");
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnpublish = async () => {
    if (!song) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/songs/${song.id}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to unpublish");
      }

      mutate((key) => typeof key === "string" && key.startsWith(ADMIN_SONGS_LIST_KEY_PREFIX), undefined, { revalidate: true });

      router.push("/admin/songs");
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!song) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this song? This action cannot be undone."
    );
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/songs/${song.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete");
      }

      mutate((key) => typeof key === "string" && key.startsWith(ADMIN_SONGS_LIST_KEY_PREFIX), undefined, { revalidate: true });

      router.push("/admin/songs");
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPublished = !!song?.published_at;

  if (isLoading) {
    return (
      <div className="py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal dark:border-gold"></div>
      </div>
    );
  }

  if (error || !song) {
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
              by {song.artist_name}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoCard label="ID" value={`#${song.id}`} />
            <InfoCard label="Language" value={song.language?.name || "Unknown"} />
            <InfoCard label="Genre" value={song.genre?.name || "Unknown"} />
            <InfoCard label="Uploader" value={song.uploader_email || "Unknown"} />
            <InfoCard label="Created" value={formatDate(song.created_at) || "Unknown"} />
            <InfoCard
              label="Published"
              value={song.published_at ? formatDate(song.published_at)! : "Not published"}
              muted={!song.published_at}
            />
          </div>

          {/* Original Lyrics */}
          <div>
            <h2 className="text-lg font-semibold text-navy dark:text-cream mb-3">
              Original Lyrics ({song.language?.name || "Unknown"})
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
          {song.lyrics_translation && (
            <>
              <div>
                <h2 className="text-lg font-semibold text-navy dark:text-cream mb-1">
                  Translation ({song.translation_language?.name || "Unknown"})
                </h2>
                {song.name_translation && (
                  <p className="text-slate dark:text-cream/70">
                    {song.name_translation}
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-slate/20 dark:border-cream/10 bg-slate/5 dark:bg-cream/5 p-4">
                <pre className="whitespace-pre-wrap text-sm text-navy dark:text-cream font-sans">
                  {song.lyrics_translation}
                </pre>
              </div>
            </>
          )}

          {!song.lyrics_translation && (
            <div className="rounded-xl border border-slate/20 dark:border-cream/10 bg-slate/5 dark:bg-cream/5 p-8 text-center">
              <p className="text-slate/50 dark:text-cream/40 italic">
                No translation provided
              </p>
            </div>
          )}

          {/* Admin Actions */}
          <div className="rounded-xl border border-slate/20 dark:border-cream/10 p-6 space-y-4">
            {isPublished ? (
              <>
                <p className="text-sm text-slate dark:text-cream/70">
                  This song is currently published. You can unpublish it or delete it permanently.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleUnpublish}
                    variant="secondary"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Unpublish"}
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="danger"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Delete"}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <TextArea
                  label="Note (Optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note for the uploader..."
                  rows={4}
                  disabled={isSubmitting}
                />

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleDecision("REJECT")}
                    variant="danger"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Reject"}
                  </Button>
                  <Button
                    onClick={() => handleDecision("APPROVE")}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Publish"}
                  </Button>
                </div>
              </>
            )}
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
        className={`text-sm font-medium ${muted
          ? "text-slate/50 dark:text-cream/40 italic"
          : "text-navy dark:text-cream"
          }`}
      >
        {value}
      </p>
    </div>
  );
}
