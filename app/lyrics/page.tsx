"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Input, Select } from "@/app/components/elements";
import { useLyrics, useLanguages, LyricsWithRelations } from "@/hooks/swr";

const formatDate = (dateString: string | null) => {
  if (!dateString) return null;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
};

function SearchIcon() {
  return (
    <svg
      className="w-5 h-5 text-slate/50 dark:text-cream/50"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function LyricsCard({ lyrics }: { lyrics: LyricsWithRelations }) {
  return (
    <Link
      href={`/lyrics/${lyrics.id}`}
      className="group block rounded-2xl border border-slate/10 dark:border-cream/10 bg-white dark:bg-navy/50 p-6 transition-all duration-200 hover:border-teal/30 dark:hover:border-gold/30 hover:shadow-lg hover:shadow-teal/5 dark:hover:shadow-gold/5 hover:-translate-y-1"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-navy dark:text-cream group-hover:text-teal dark:group-hover:text-gold transition-colors line-clamp-2">
            {lyrics.name}
          </h3>
          <p className="text-sm text-slate dark:text-cream/60 mt-1">
            by {lyrics.artist_name}
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {lyrics.genre && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal/10 text-teal dark:bg-gold/10 dark:text-gold">
              {lyrics.genre.name}
            </span>
          )}
          {lyrics.language && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate/10 text-slate dark:bg-cream/10 dark:text-cream/70">
              {lyrics.language.name}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-slate/10 dark:border-cream/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-slate/40 dark:text-cream/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
            <span className="text-xs text-slate/60 dark:text-cream/50">
              {lyrics.language?.name || "Unknown"}
            </span>
          </div>
          <span className="text-xs text-slate/40 dark:text-cream/40">
            {formatDate(lyrics.published_at)}
          </span>
        </div>
      </div>
    </Link>
  );
}

function LyricsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate/10 dark:border-cream/10 bg-white dark:bg-navy/50 p-6 animate-pulse">
      <div className="h-6 bg-slate/10 dark:bg-cream/10 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate/10 dark:bg-cream/10 rounded w-1/2 mb-4"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-slate/10 dark:bg-cream/10 rounded-full w-16"></div>
        <div className="h-6 bg-slate/10 dark:bg-cream/10 rounded-full w-20"></div>
      </div>
      <div className="pt-4 border-t border-slate/10 dark:border-cream/10 flex justify-between">
        <div className="h-4 bg-slate/10 dark:bg-cream/10 rounded w-20"></div>
        <div className="h-4 bg-slate/10 dark:bg-cream/10 rounded w-24"></div>
      </div>
    </div>
  );
}

export default function LyricsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [page, setPage] = useState(1);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const { data: languages, isLoading: languagesLoading } = useLanguages();

  const { data, isLoading, error } = useLyrics(
    { search: debouncedSearch, language: language || undefined },
    { page, limit: 12 }
  );

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchInput]);

  // Reset page when language changes
  useEffect(() => {
    setPage(1);
  }, [language]);

  const lyrics = data?.data || [];
  const metadata = data?.metadata;
  const totalPages = metadata?.count ? Math.ceil(metadata.count / metadata.limit) : 0;

  const languageOptions = [
    { value: "", label: "All Languages" },
    ...(languages?.map((l) => ({ value: l.id.toString(), label: l.name })) || []),
  ];

  return (
    <div className="py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-navy dark:text-cream mb-3">
          Explore Lyrics
        </h1>
        <p className="text-slate dark:text-cream/60 max-w-xl mx-auto">
          Discover song lyrics from around the world with translations in multiple languages
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <SearchIcon />
          </div>
          <Input
            placeholder="Search by song name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
            size="large"
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            options={languageOptions}
            value={language}
            onChange={setLanguage}
            placeholder={languagesLoading ? "Loading..." : "All Languages"}
            size="large"
          />
        </div>
      </div>

      {/* Results Count */}
      {metadata && !isLoading && (
        <p className="text-sm text-slate dark:text-cream/60 mb-6">
          {metadata.count === 0
            ? "No lyrics found"
            : `Showing ${lyrics.length} of ${metadata.count} lyrics`}
        </p>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16">
          <p className="text-red dark:text-red/80">
            Something went wrong. Please try again.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <LyricsCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && lyrics.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate/10 dark:bg-cream/10 mb-4">
            <svg
              className="w-8 h-8 text-slate/40 dark:text-cream/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-navy dark:text-cream mb-2">
            No lyrics found
          </h3>
          <p className="text-slate dark:text-cream/60">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Lyrics Grid */}
      {!isLoading && !error && lyrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lyrics.map((lyric) => (
            <LyricsCard key={lyric.id} lyrics={lyric} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-slate/10 dark:bg-cream/10 text-navy dark:text-cream hover:bg-slate/20 dark:hover:bg-cream/20"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-slate dark:text-cream/70">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-slate/10 dark:bg-cream/10 text-navy dark:text-cream hover:bg-slate/20 dark:hover:bg-cream/20"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
