"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/app/components/elements";
import { useAdminSongs, Lyrics } from "@/hooks/swr";
import { Filter, FilterValues } from "./Filter";

const columnHelper = createColumnHelper<Lyrics>();

const formatDate = (dateString: string | null) => {
  if (!dateString) return null;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

export default function AdminSongsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const appliedFilters = useMemo((): FilterValues => ({
    id: searchParams.get("id") || "",
    name: searchParams.get("name") || "",
    genre: searchParams.get("genre") || "",
    created_by: searchParams.get("created_by") || "",
    language: searchParams.get("language") || "",
  }), [searchParams]);

  const { data, isLoading, error } = useAdminSongs(appliedFilters, { page, limit });

  const songs = data?.data ?? [];
  const metadata = data?.metadata;
  const totalCount = metadata?.count ?? 0;
  const totalPages = Math.ceil(totalCount / limit);

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => (
          <span className="font-mono text-slate dark:text-cream/70">
            #{info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: "Created",
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.accessor("published_at", {
        header: "Published",
        cell: (info) => {
          const value = info.getValue();
          return value ? (
            formatDate(value)
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-danger-light text-danger">
              Not published
            </span>
          );
        },
      }),
      columnHelper.accessor("name", {
        header: "Song Name",
        cell: (info) => (
          <span className="font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("language_id", {
        header: "Language",
        cell: (info) => (
          <span className="text-sm">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("uploader_id", {
        header: "Uploader",
        cell: (info) => (
          <span className="text-sm text-slate dark:text-cream/70">
            {info.getValue() ?? "—"}
          </span>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: songs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowClick = (songId: number) => {
    router.push(`/admin/songs/${songId}`);
  };

  if (error) {
    return (
      <div className="py-8">
        <h1 className="text-2xl font-bold text-navy dark:text-cream mb-6">
          Songs Management
        </h1>
        <div className="text-danger">Failed to load songs. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-navy dark:text-cream mb-6">
        Songs Management
      </h1>

      <Filter onFilterChange={() => setPage(1)} />

      <div className="rounded-xl border border-slate/20 dark:border-cream/10 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-navy/50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal dark:border-gold"></div>
          </div>
        )}
        <table className="w-full">
          <thead className="bg-slate/5 dark:bg-cream/5">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-semibold text-navy dark:text-cream"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate/10 dark:divide-cream/10">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row.original.id)}
                className="cursor-pointer transition-colors hover:bg-slate/5 dark:hover:bg-cream/5"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-sm text-navy dark:text-cream"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-slate dark:text-cream/70">
          Showing {totalCount === 0 ? 0 : (page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, totalCount)} of {totalCount} songs
        </div>
        <div className="flex gap-2">
          <Button
            variant="tertiary"
            size="small"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isLoading}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                disabled={isLoading}
                className={`
                  w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer
                  ${page === i + 1
                    ? "bg-teal text-cream dark:bg-gold dark:text-navy"
                    : "text-slate hover:bg-slate/10 dark:text-cream dark:hover:bg-cream/10"
                  }
                `}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <Button
            variant="tertiary"
            size="small"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}