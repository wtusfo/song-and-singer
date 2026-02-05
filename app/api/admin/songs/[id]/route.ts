import { protectRoute } from "@/lib/supabase/protectRoute";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@supabase/supabase-js";

function createAdminClient() {
  return createSupabaseClient(
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
    const id = request.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("lyrics")
      .select(`
        *,
        genre:genres(id, name),
        language:languages!lyrics_language_id_fkey(id, name),
        translation_language:languages!lyrics_language_translation_id_fkey(id, name)
      `)
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    const adminClient = createAdminClient();
    const { data: userData } = await adminClient.auth.admin.getUserById(data.created_by_id);

    return NextResponse.json({
      data: {
        ...data,
        uploader_email: userData?.user?.email || null,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}, "admin");

// Unpublish a song
export const PATCH = protectRoute(async (request: NextRequest, user: User) => {
  try {
    const id = request.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("lyrics")
      .update({
        published_at: null,
        approved: null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "Song unpublished successfully",
      data,
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}, "admin");

// Delete a song
export const DELETE = protectRoute(async (request: NextRequest, user: User) => {
  try {
    const id = request.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("lyrics")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Song deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}, "admin");
