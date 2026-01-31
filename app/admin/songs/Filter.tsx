"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Input, Select, Button, SelectOption } from "@/app/components/elements";
import { mockSongs } from "./mockData";

// Extract unique values from mock data
const getUniqueValues = (key: keyof typeof mockSongs[0]): SelectOption[] => {
  const unique = [...new Set(mockSongs.map((song) => song[key] as string))];
  return unique.map((value) => ({ value, label: value }));
};

const genreOptions = getUniqueValues("genre");
const uploaderOptions = getUniqueValues("uploader");
const languageOptions = getUniqueValues("language");

interface FilterValues {
  id: string;
  name: string;
  genre: string;
  uploader: string;
  language: string;
}

interface FilterProps {
  onFilter: (filters: FilterValues) => void;
}

function Filter({ onFilter }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterValues>({
    id: searchParams.get("id") || "",
    name: searchParams.get("name") || "",
    genre: searchParams.get("genre") || "",
    uploader: searchParams.get("uploader") || "",
    language: searchParams.get("language") || "",
  });

  useEffect(() => {
    setFilters({
      id: searchParams.get("id") || "",
      name: searchParams.get("name") || "",
      genre: searchParams.get("genre") || "",
      uploader: searchParams.get("uploader") || "",
      language: searchParams.get("language") || "",
    });
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    router.push(`?${params.toString()}`);
    onFilter(filters);
  };

  const handleReset = () => {
    const emptyFilters: FilterValues = {
      id: "",
      name: "",
      genre: "",
      uploader: "",
      language: "",
    };
    setFilters(emptyFilters);
    router.push("?");
    onFilter(emptyFilters);
  };

  const updateFilter = (key: keyof FilterValues, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="rounded-xl border border-slate/20 dark:border-cream/10 p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Input
            label="ID"
            value={filters.id}
            onChange={(e) => updateFilter("id", e.target.value)}
            placeholder="Search ID"
            size="default"
          />
          <Input
            label="Name"
            value={filters.name}
            onChange={(e) => updateFilter("name", e.target.value)}
            placeholder="Search name"
            size="default"
          />
          <Select
            label="Genre"
            options={[{ value: "", label: "All genres" }, ...genreOptions]}
            value={filters.genre}
            onChange={(value) => updateFilter("genre", value)}
            placeholder="All genres"
            size="default"
          />
          <Select
            label="Uploader"
            options={[{ value: "", label: "All uploaders" }, ...uploaderOptions]}
            value={filters.uploader}
            onChange={(value) => updateFilter("uploader", value)}
            placeholder="All uploaders"
            searchable
            size="default"
          />
          <Select
            label="Language"
            options={[{ value: "", label: "All languages" }, ...languageOptions]}
            value={filters.language}
            onChange={(value) => updateFilter("language", value)}
            placeholder="All languages"
            size="default"
          />
          <div className="flex items-end gap-2">
            <Button type="submit" size="default" className="flex-1">
              Filter
            </Button>
            <Button
              type="button"
              variant="danger"
              size="default"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export { Filter };
export type { FilterValues };
