"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function HelpArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from('help_articles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !data) {
        router.push('/help');
      } else {
        setArticle(data);
      }
      setLoading(false);
    };
    if (id) fetchArticle();
  }, [id, supabase, router]);

  if (loading) return <div className="min-h-screen bg-[#050505] flex justify-center items-center"><Loader2 className="w-8 h-8 text-[#ef4444] animate-spin" /></div>;
  if (!article) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 text-white min-h-screen">
      <Link href="/help" className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Help Center
      </Link>
      
      <div className="mb-8">
        <span className="text-[#ef4444] text-sm font-bold tracking-wider uppercase mb-2 block">
          {article.category}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          {article.title}
        </h1>
      </div>

      <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6 md:p-8">
        {/* whitespace-pre-wrap ensures the AI's line breaks show up perfectly */}
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
          {article.content}
        </p>
      </div>
    </div>
  );
}
