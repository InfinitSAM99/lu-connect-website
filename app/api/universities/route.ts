import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: universities, error } = await supabase
    .from("universities")
    .select("id, name, short_name, region, county")
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch universities:", error);
    return NextResponse.json({ universities: [] });
  }

  return NextResponse.json({ universities: universities || [] });
}
