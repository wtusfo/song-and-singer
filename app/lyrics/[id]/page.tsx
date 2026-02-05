"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLyric } from "@/hooks/swr";

const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(dateString));
};

function buildAlignedLines(original: string, translated: string) {
    const originalLines = original.split(/\r?\n/);
    const translatedLines = translated.split(/\r?\n/);
    const maxLength = Math.max(originalLines.length, translatedLines.length);

    return Array.from({ length: maxLength }).map((_, index) => ({
        original: originalLines[index] ?? "",
        translated: translatedLines[index] ?? "",
        key: `${index}`,
    }));
}

export default function LyricsDetailsPage() {
    const params = useParams<{ id: string }>();
    const lyricId = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const { data: lyrics, error, isLoading } = useLyric(lyricId);

    if (isLoading) {
        return (
            <div className="py-10">
                <div className="rounded-3xl border border-slate/10 dark:border-cream/10 bg-white dark:bg-navy/60 p-6 sm:p-10 animate-pulse">
                    <div className="h-8 w-2/3 bg-slate/10 dark:bg-cream/10 rounded mb-4" />
                    <div className="h-4 w-1/3 bg-slate/10 dark:bg-cream/10 rounded mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={`left-${i}`}
                                    className="h-4 bg-slate/10 dark:bg-cream/10 rounded"
                                />
                            ))}
                        </div>
                        <div className="space-y-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={`right-${i}`}
                                    className="h-4 bg-slate/10 dark:bg-cream/10 rounded"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-16 text-center">
                <h2 className="text-2xl font-semibold text-navy dark:text-cream">
                    Lyrics unavailable
                </h2>
                <p className="mt-3 text-slate dark:text-cream/60">
                    {error.message}
                </p>
                <Link
                    href="/lyrics"
                    className="mt-6 inline-flex items-center gap-2 text-teal dark:text-gold hover:underline"
                >
                    Back to lyrics
                </Link>
            </div>
        );
    }

    if (!lyrics) {
        return (
            <div className="py-16 text-center">
                <h2 className="text-2xl font-semibold text-navy dark:text-cream">
                    Lyrics not found
                </h2>
                <Link
                    href="/lyrics"
                    className="mt-6 inline-flex items-center gap-2 text-teal dark:text-gold hover:underline"
                >
                    Back to lyrics
                </Link>
            </div>
        );
    }

    const lines = buildAlignedLines(lyrics.lyrics, lyrics.lyrics_translation);

    return (
        <div className="py-10">
            <div className="flex items-center gap-3 text-sm text-slate dark:text-cream/60 mb-6">
                <Link
                    href="/lyrics"
                    className="inline-flex items-center gap-2 hover:text-teal dark:hover:text-gold transition-colors"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back to lyrics
                </Link>
                <span>•</span>
                <span>{formatDate(lyrics.published_at) ?? "Unpublished"}</span>
            </div>

            <div className="rounded-3xl border border-slate/10 dark:border-cream/10 bg-white dark:bg-navy/60 p-6 sm:p-8 shadow-lg shadow-teal/5 dark:shadow-gold/5">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-navy dark:text-cream">
                            {lyrics.name}
                        </h1>
                        {lyrics.name_translation && (
                            <p className="mt-2 text-lg text-slate dark:text-cream/70">
                                {lyrics.name_translation}
                            </p>
                        )}
                        <p className="mt-4 text-base text-slate dark:text-cream/60">
                            by <span className="font-semibold">{lyrics.artist_name}</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {lyrics.genre && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal/10 text-teal dark:bg-gold/10 dark:text-gold">
                                {lyrics.genre.name}
                            </span>
                        )}
                        {lyrics.language && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate/10 text-slate dark:bg-cream/10 dark:text-cream/70">
                                {lyrics.language.name}
                            </span>
                        )}
                        {lyrics.translation_language && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate/10 text-slate dark:bg-cream/10 dark:text-cream/70">
                                {lyrics.translation_language.name}
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-8 grid gap-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] uppercase tracking-[0.2em] text-slate/50 dark:text-cream/40">
                        <span>{lyrics.language?.name ?? "Original"}</span>
                        <span>{lyrics.translation_language?.name ?? "Translation"}</span>
                    </div>

                    <div className="divide-y divide-slate/10 dark:divide-cream/10 rounded-2xl border border-slate/10 dark:border-cream/10 overflow-hidden">
                        {lines.map((line, index) => (
                            <div
                                key={line.key}
                                className={`grid grid-cols-1 md:grid-cols-2 gap-6 px-5 py-3 ${index % 2 === 0
                                    ? "bg-slate/5 dark:bg-cream/5"
                                    : "bg-transparent"
                                    }`}
                            >
                                <p className="text-sm leading-relaxed text-navy dark:text-cream whitespace-pre-wrap">
                                    {line.original}
                                </p>
                                <p className="text-sm leading-relaxed text-navy/90 dark:text-cream/90 whitespace-pre-wrap">
                                    {line.translated}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}