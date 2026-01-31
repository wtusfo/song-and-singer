"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/app/components/elements";
import { mockSongs, Song } from "./mockData";
import { Filter, FilterValues } from "./Filter";

const columnHelper = createColumnHelper<Song>();

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function AdminSongsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const getInitialFilters = useCallback((): FilterValues => ({
    id: searchParams.get("id") || "",
    name: searchParams.get("name") || "",
    genre: searchParams.get("genre") || "",
    uploader: searchParams.get("uploader") || "",
    language: searchParams.get("language") || "",
  }), [searchParams]);

  const [filters, setFilters] = useState<FilterValues>(getInitialFilters);

  const filteredSongs = useMemo(() => {
    return mockSongs.filter((song) => {
      if (filters.id && !song.id.toLowerCase().includes(filters.id.toLowerCase())) {
        return false;
      }
      if (filters.name && !song.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.genre && song.genre !== filters.genre) {
        return false;
      }
      if (filters.uploader && song.uploader !== filters.uploader) {
        return false;
      }
      if (filters.language && song.language !== filters.language) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const handleFilter = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

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
      columnHelper.accessor("createdAt", {
        header: "Created",
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.accessor("publishedAt", {
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
      columnHelper.accessor("language", {
        header: "Language",
      }),
      columnHelper.accessor("uploader", {
        header: "Uploader",
        cell: (info) => (
          <span className="text-sm text-slate dark:text-cream/70">
            {info.getValue()}
          </span>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredSongs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  const handleRowClick = (songId: string) => {
    router.push(`/admin/songs/${songId}`);
  };

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-navy dark:text-cream mb-6">
        Songs Management
      </h1>

      <Filter onFilter={handleFilter} />

      <div className="rounded-xl border border-slate/20 dark:border-cream/10 overflow-hidden">
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
          Showing {filteredSongs.length === 0 ? 0 : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            filteredSongs.length
          )}{" "}
          of {filteredSongs.length} songs
        </div>
        <div className="flex gap-2">
          <Button
            variant="tertiary"
            size="small"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <button
                key={i}
                onClick={() => table.setPageIndex(i)}
                className={`
                  w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer
                  ${
                    table.getState().pagination.pageIndex === i
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
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}