import { protectRoute } from "@/lib/supabase/protectRoute";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@supabase/supabase-js";

enum Decision {
    APPROVE = "APPROVE",
    REJECT = "REJECT",
}

interface ReviewRequest {
    id: string;
    decision: Decision;
    note?: string;
}

export const POST = protectRoute(async (request: NextRequest, user: User) => {
    try {
        const body = await request.json() as ReviewRequest;
        const { id, decision, note } = body;

        if (!id || !decision || decision !== Decision.APPROVE && decision !== Decision.REJECT) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const supabase = await createClient();

        const isApproved = decision === Decision.APPROVE;
        const updatePayload = {
            approved: isApproved,
            published_at: isApproved ? new Date().toISOString() : undefined,
            note: note ?? null,
        }

        const { data, error } = await supabase
            .from("lyrics")
            .update(updatePayload)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({
            message: `Lyrics ${isApproved ? "approved" : "rejected"} successfully`,
            data,
        });
    } catch {
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}, "admin");
