"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Input, Select, Button, SelectOption } from "@/app/components/elements";
import { useGenres, useLanguages, useUsers } from "@/hooks/swr";

interface FilterValues {
  id: string;
  name: string;
  genre: string;
  created_by: string;
  language: string;
}

interface FilterProps {
  onFilterChange?: () => void;
}

function Filter({ onFilterChange }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: genres, isLoading: genresLoading } = useGenres();
  const { data: languages, isLoading: languagesLoading } = useLanguages();
  const { data: users, isLoading: usersLoading } = useUsers();

  const genreOptions = useMemo<SelectOption[]>(() => {
    if (!genres) return [];
    return genres.map((g) => ({ value: g.id.toString(), label: g.name }));
  }, [genres]);

  const languageOptions = useMemo<SelectOption[]>(() => {
    if (!languages) return [];
    return languages.map((l) => ({ value: l.id.toString(), label: l.name }));
  }, [languages]);

  const uploaderOptions = useMemo<SelectOption[]>(() => {
    if (!users) return [];
    return users.map((u) => ({ value: u.id, label: u.email || u.id }));
  }, [users]);

  const [filters, setFilters] = useState<FilterValues>({
    id: searchParams.get("id") || "",
    name: searchParams.get("name") || "",
    genre: searchParams.get("genre") || "",
    created_by: searchParams.get("created_by") || "",
    language: searchParams.get("language") || "",
  });

  useEffect(() => {
    setFilters({
      id: searchParams.get("id") || "",
      name: searchParams.get("name") || "",
      genre: searchParams.get("genre") || "",
      created_by: searchParams.get("created_by") || "",
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
    onFilterChange?.();
  };

  const handleReset = () => {
    const emptyFilters: FilterValues = {
      id: "",
      name: "",
      genre: "",
      created_by: "",
      language: "",
    };
    setFilters(emptyFilters);
    router.push("?");
    onFilterChange?.();
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
            placeholder={genresLoading ? "Loading..." : "All genres"}
            size="default"
          />
          <Select
            label="Uploader"
            options={[{ value: "", label: "All uploaders" }, ...uploaderOptions]}
            value={filters.created_by}
            onChange={(value) => updateFilter("created_by", value)}
            placeholder={usersLoading ? "Loading..." : "All uploaders"}
            searchable
            size="default"
          />
          <Select
            label="Language"
            options={[{ value: "", label: "All languages" }, ...languageOptions]}
            value={filters.language}
            onChange={(value) => updateFilter("language", value)}
            placeholder={languagesLoading ? "Loading..." : "All languages"}
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
