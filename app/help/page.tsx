"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";

export default function HelpCenterPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await supabase.from('help_articles').select('*').order('category');
      if (data) setArticles(data);
      setLoading(false);
    };
    fetchArticles();
  }, [supabase]);

  // Filter articles based on search
  const filteredArticles = articles.filter(
    (a) => a.title.toLowerCase().includes(search.toLowerCase()) || 
           a.content.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const categories = Array.from(new Set(filteredArticles.map(a => a.category)));

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 text-white min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
        <p className="text-gray-400 mb-8">Search our knowledge base or browse categories below.</p>
        
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search for answers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#1f1f1f] text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-[#ef4444] transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading guides...</p>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-20 bg-[#0a0a0a] rounded-2xl border border-[#1f1f1f]">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
          <p className="text-gray-400">Try searching for different keywords.</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {categories.map(category => (
            <div key={category} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl overflow-hidden">
              <div className="bg-[#111111] px-6 py-4 border-b border-[#1f1f1f]">
                <h2 className="text-lg font-bold text-[#ef4444]">{category}</h2>
              </div>
              <div className="divide-y divide-[#1f1f1f]">
                {filteredArticles.filter(a => a.category === category).map(article => (
                  <Link 
                    href={`/help/${article.id}`} 
                    key={article.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-[#1a1a1a] transition-colors group"
                  >
                    <span className="text-gray-300 group-hover:text-white">{article.title}</span>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#ef4444]" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
