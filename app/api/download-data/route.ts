import { createClient } from '@supabase/supabase-js';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return NextResponse.json({ error: 'No auth header' }, { status: 401 });

  const token = authHeader.replace('Bearer ', '');
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Missing Service Role Key' }, { status: 500 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Run all queries in parallel for faster download
    const [profile, posts, messages, connections, groupMessages, closeFriends] = await Promise.all([
      adminClient.from('profiles').select('*').eq('id', user.id).single(),
      adminClient.from('posts').select('*').eq('author_id', user.id),
      adminClient.from('messages').select('*').eq('sender_id', user.id),
      adminClient.from('connections').select('*').or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`),
      adminClient.from('group_messages').select('*').eq('sender_id', user.id),
      adminClient.from('close_friends').select('*').or(`user_id.eq.${user.id},close_friend_id.eq.${user.id}`)
    ]);

    const exportData = {
      export_date: new Date().toISOString(),
      account: { email: user.email, created_at: user.created_at },
      profile: profile.data,
      posts: posts.data || [],
      direct_messages: messages.data || [],
      connections: connections.data || [],
      group_messages: groupMessages.data || [],
      close_friends: closeFriends.data || []
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="lu-connect-data-${user.id}.json"`,
      },
    });
  } catch (error: any) {
    console.error("Export Error:", error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
