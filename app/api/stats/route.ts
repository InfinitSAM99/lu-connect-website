import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  // We use the public URL and ANON key since RLS allows reading counts
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { count: users } = await supabase.from("profiles").select("*", { count: "exact", head: true });
  const { count: posts } = await supabase.from("posts").select("*", { count: "exact", head: true });

  return NextResponse.json({
    users: users || 0,
    posts: posts || 0
  });
}
