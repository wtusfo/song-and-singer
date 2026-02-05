import { protectRoute } from "@/lib/supabase/protectRoute";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@supabase/supabase-js";

export const GET = protectRoute(async (request: NextRequest, user: User) => {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "15", 10);
        const id = searchParams.get("id");
        const name = searchParams.get("name");
        const genre = searchParams.get("genre");
        const language = searchParams.get("language");
        const created_by = searchParams.get("created_by");

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const supabase = await createClient();

        let query = supabase
            .from("lyrics")
            .select("*", { count: "exact" });

        if (id) {
            query = query.eq("id", id);
        }
        if (name) {
            query = query.ilike("name", `%${name}%`);
        }
        if (genre) {
            query = query.eq("genre_id", genre);
        }
        if (language) {
            query = query.eq("language_id", language);
        }
        if (created_by) {
            query = query.eq("created_by_id", created_by);
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
}, "admin");
