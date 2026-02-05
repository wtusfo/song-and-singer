import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@supabase/supabase-js";
import { protectRoute } from "@/lib/supabase/protectRoute";

export const GET = protectRoute(async (request: NextRequest, user: User) => {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.from('languages').select('*');

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
})