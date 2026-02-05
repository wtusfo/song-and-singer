"use client";
import { Genre, Language } from "@/types/models";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import useSWR, { Fetcher, Key, SWRConfiguration } from "swr";

const cacheKeys = {
    getMeKey: "/api/auth/me",
    getGenresKey: "/api/genres",
    getLanguagesKey: "/api/languages",
    getUsersKey: "/api/users",
}

export function useAuthSwr<
    T,
    SWROptions extends SWRConfiguration<T> | undefined = SWRConfiguration<T, Error, Fetcher<T>> | undefined,
>(key: Key, cb: Fetcher<T>, swrConfig?: SWROptions & { onError: (error: any) => void }) {
    const router = useRouter()

    return useSWR(key, cb, {
        ...swrConfig,
        onError: error => {
            if (error.status === 401) {
                router.push('/auth/signin')
            }

            if (swrConfig?.onError) {
                swrConfig.onError(error)
            }
        }
    });
}

export function useMe() {
    return useAuthSwr(cacheKeys.getMeKey, async () => {
        const response = await fetch(cacheKeys.getMeKey);

        if (!response.ok) {
            throw response
        }

        const json = await response.json()
        return json.data as User
    });
}

export function useAuthStatus() {
    const { data, error, isLoading, mutate } = useSWR(
        cacheKeys.getMeKey,
        async () => {
            const response = await fetch(cacheKeys.getMeKey);

            if (!response.ok) {
                return null;
            }

            const json = await response.json();
            return json.data as User;
        },
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    );

    return {
        user: data ?? null,
        isLoading,
        isAuthenticated: !!data && !error,
        mutate,
    };
}



export function useGenres() {
    return useAuthSwr(cacheKeys.getGenresKey, async () => {
        const response = await fetch(cacheKeys.getGenresKey);

        if (!response.ok) {
            throw response
        }

        const json = await response.json()
        return json.data as Genre[]
    });
}


export function useLanguages() {
    return useAuthSwr(cacheKeys.getLanguagesKey, async () => {
        const response = await fetch(cacheKeys.getLanguagesKey);
        if (!response.ok) {
            throw response
        }

        const json = await response.json()
        return json.data as Language[]
    });
}

export function useUsers() {
    return useAuthSwr(cacheKeys.getUsersKey, async () => {
        const response = await fetch(cacheKeys.getUsersKey);
        if (!response.ok) {
            throw response
        }

        const json = await response.json()
        return json.data as User[]
    });
}

export interface Lyrics {
    id: number;
    created_at: string;
    published_at: string | null;
    name: string;
    name_translation: string | null;
    genre_id: number;
    language_id: number;
    language_translation_id: number;
    artist_name: string;
    lyrics: string;
    lyrics_translation: string;
    approved: boolean | null;
    note: string | null;
    uploader_id: string | null;
}

export interface LyricsWithRelations extends Lyrics {
    genre: { id: number; name: string } | null;
    language: { id: number; name: string } | null;
    translation_language: { id: number; name: string } | null;
    uploader_email: string | null;
}

export interface AdminSongsFilters {
    id?: string;
    name?: string;
    genre?: string;
    language?: string;
    uploader?: string;
}

export interface AdminSongsPagination {
    page: number;
    limit: number;
}

export interface AdminSongsMetadata {
    count: number | null;
    page: number;
    limit: number;
}

export function useAdminSongs(filters: AdminSongsFilters, pagination: AdminSongsPagination) {
    const buildQueryString = () => {
        const params = new URLSearchParams();
        params.set("page", pagination.page.toString());
        params.set("limit", pagination.limit.toString());

        if (filters.id) params.set("id", filters.id);
        if (filters.name) params.set("name", filters.name);
        if (filters.genre) params.set("genre", filters.genre);
        if (filters.language) params.set("language", filters.language);
        if (filters.uploader) params.set("uploader", filters.uploader);

        return params.toString();
    };

    const key = `/api/admin/songs/list?${buildQueryString()}`;

    return useAuthSwr(key, async () => {
        const response = await fetch(key);

        if (!response.ok) {
            throw response;
        }

        const json = await response.json();
        return {
            data: json.data as Lyrics[],
            metadata: json.metadata as AdminSongsMetadata,
        };
    });
}

export function useAdminSong(id: string | string[] | undefined) {
    const key = id ? `/api/admin/songs/${id}` : null;

    return useAuthSwr(key, async () => {
        if (!key) throw new Error("No ID provided");

        const response = await fetch(key);

        if (!response.ok) {
            throw response;
        }

        const json = await response.json();
        return json.data as LyricsWithRelations;
    });
}

// Helper to invalidate admin songs list cache
export const ADMIN_SONGS_LIST_KEY_PREFIX = "/api/admin/songs/list";

// Public lyrics listing
export interface LyricsFilters {
    search?: string;
    language?: string;
}

export interface LyricsPagination {
    page: number;
    limit: number;
}

export interface LyricsMetadata {
    count: number | null;
    page: number;
    limit: number;
}

export function useLyrics(filters: LyricsFilters, pagination: LyricsPagination) {
    const buildQueryString = () => {
        const params = new URLSearchParams();
        params.set("page", pagination.page.toString());
        params.set("limit", pagination.limit.toString());

        if (filters.search) params.set("search", filters.search);
        if (filters.language) params.set("language", filters.language);

        return params.toString();
    };

    const key = `/api/lyrics?${buildQueryString()}`;

    return useSWR(
        key,
        async (url: string) => {
            const response = await fetch(url);

            if (!response.ok) {
                throw response;
            }

            const json = await response.json();
            return {
                data: json.data as LyricsWithRelations[],
                metadata: json.metadata as LyricsMetadata,
            };
        },
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
        }
    );
}

export function useLyric(id: string | string[] | undefined) {
    const key = id ? `/api/lyrics/${id}` : null;

    return useSWR(
        key,
        async (url: string) => {
            const response = await fetch(url);

            if (!response.ok) {
                const json = await response.json().catch(() => null);
                const message =
                    json?.error ??
                    `Failed to load lyrics (status ${response.status})`;
                throw new Error(message);
            }

            const json = await response.json();
            return json.data as LyricsWithRelations;
        },
        {
            revalidateOnFocus: false,
        }
    );
}