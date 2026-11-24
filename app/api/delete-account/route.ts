import { createClient } from '@supabase/supabase-js';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const token = authHeader.replace('Bearer ', '');
  
  // Verify user with their token
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Admin client for deletion
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // 1. Manually clean up tables that block deletion (NO ACTION)
    await adminClient.from('active_calls').delete().or(`caller_id.eq.${user.id},receiver_id.eq.${user.id}`);
    await adminClient.from('admin_messages').delete().eq('user_id', user.id);
    
    // For reviews, we just set the reviewer to null so the payment record isn't deleted
    await adminClient.from('payments').update({ reviewed_by: null }).eq('reviewed_by', user.id);
    await adminClient.from('ban_appeals').update({ reviewed_by: null }).eq('reviewed_by', user.id);
    await adminClient.from('comments').update({ reply_to_user_id: null }).eq('reply_to_user_id', user.id);

    // 2. Delete the profile (this will cascade and delete the rest of their data)
    const { error: profileError } = await adminClient.from('profiles').delete().eq('id', user.id);
    if (profileError) throw profileError;

    // 3. Delete the Auth User entirely
    const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(user.id);
    if (authDeleteError) throw authDeleteError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete Account Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to delete account' }, { status: 500 });
  }
}
