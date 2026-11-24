import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import ProfileRedirectClient from './ProfileRedirectClient';

// Initialize Supabase for server-side fetching
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 1. Generate the Meta Tags for WhatsApp / Facebook
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  // Await the params for Next.js 16
  const { id } = await params;

  const { data } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', id)
    .single();

  const name = data?.full_name || 'LU Connect Student';
  const avatar = data?.avatar_url || 'https://lu-connect-website-sigma.vercel.app/icon.png'; // Fallback icon

  return {
    title: `${name} on LU Connect`,
    description: 'Connect with me on LU Connect, the exclusive social network for Kenyan university students.',
    openGraph: {
      title: `${name} on LU Connect`,
      description: 'Scan to follow me on LU Connect!',
      images: [avatar],
      url: `https://lu-connect-website-sigma.vercel.app/profile/${id}`,
      siteName: 'LU Connect',
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: `${name} on LU Connect`,
      description: 'Scan to follow me on LU Connect!',
      images: [avatar],
    }
  };
}

// 2. Render the Client Component
export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params for Next.js 16
  const { id } = await params;
  
  return <ProfileRedirectClient userId={id} />;
}
