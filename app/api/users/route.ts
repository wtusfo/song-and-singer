import { protectRoute } from "@/lib/supabase/protectRoute";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@supabase/supabase-js";

function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}

export const GET = protectRoute(async (request: NextRequest, user: User) => {
    try {
        const supabase = createAdminClient();

        const { data: { users }, error } = await supabase.auth.admin.listUsers();

        const usersRedacted = users.map((user) => ({
            id: user.id,
            email: user.email,
            created_at: user.created_at,
        }));

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ data: usersRedacted });
    } catch {
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}, "admin");
