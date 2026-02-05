import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import { protectRoute } from "@/lib/supabase/protectRoute";

// Public GET endpoint for fetching published lyrics
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const language = searchParams.get("language");
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "12", 10);

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const supabase = await createClient();

        let query = supabase
            .from("lyrics")
            .select(`
                *,
                genre:genres(id, name),
                language:languages!lyrics_language_id_fkey(id, name),
                translation_language:languages!lyrics_language_translation_id_fkey(id, name)
            `, { count: "exact" })
            .not("published_at", "is", null)
            .order("published_at", { ascending: false });

        if (search) {
            query = query.ilike("name", `%${search}%`);
        }

        if (language) {
            query = query.eq("language_id", language);
        }

        const { data, error, count } = await query.range(from, to);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({
            data,
            metadata: {
                count,
                page,
                limit,
            },
        });
    } catch {
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}

type LyricsPayload = {
    name: string;
    nameTranslation: string | null;
    genre: number;
    language: number;
    languageTranslation: number;
    artistName: string;
    lyrics: string;
    lyricsTranslation: string;
};

const optionalFields = ['nameTranslation']

export const POST = protectRoute(async (request: NextRequest, user: User) => {
    console.log({ user })
    try {
        const payload = (await request.json()) as Partial<LyricsPayload>;

        const genre = Number(payload?.genre);
        const language = Number(payload?.language);
        const languageTranslation = Number(payload?.languageTranslation);

        const hasMissingFields = Object.entries(payload).some(([key, value]) => !value && !optionalFields.includes(key));

        if (hasMissingFields) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const publishedAt = user.app_metadata.role === 'admin' ? new Date().toISOString() : null;
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("lyrics")
            .insert([
                {
                    name: payload.name,
                    name_translation: payload.nameTranslation ?? null,
                    genre_id: genre,
                    language_id: language,
                    language_translation_id: languageTranslation,
                    artist_name: payload.artistName,
                    lyrics: payload.lyrics,
                    lyrics_translation: payload.lyricsTranslation,
                    published_at: publishedAt,
                    created_by_id: user.id,
                },
            ])
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
})
