import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: idUnparsed } = await params;
    const id = Number(idUnparsed);

    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid lyric id" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lyrics")
      .select(
        `
        *,
        genre:genres(id, name),
        language:languages!lyrics_language_id_fkey(id, name),
        translation_language:languages!lyrics_language_translation_id_fkey(id, name)
      `
      )
      .eq("id", id)
      .not("published_at", "is", null)
      .single();
    console.log(data, error)

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
