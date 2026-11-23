"use client";
import { useEffect, useState } from "react";

type University = {
  id: string;
  name: string;
  short_name: string;
  region: string;
  county: string;
};

export default function Universities() {
  const [unis, setUnis] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/universities")
      .then((res) => res.json())
      .then((data) => {
        setUnis(data.universities || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter based on search input
  const filteredUnis = unis.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.short_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="mt-24 mb-16">
      <div className="text-center mb-10">
        <div className="inline-block bg-luGold/10 border border-luGold/30 text-luGold font-bold px-4 py-1.5 rounded-full text-sm mb-4">
          Over {unis.length > 0 ? unis.length : "40"}+ Campuses Nationwide
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
          Your University is <span className="text-luRed">Here.</span>
        </h2>
        <p className="text-muted text-base max-w-lg mx-auto">
          LU Connect unites students from every major university across Kenya. Find your campus and join the conversation.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8 relative">
        <input 
          type="text" 
          placeholder="Search for your university..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface border border-border rounded-[20px] px-5 py-4 text-white text-sm focus:outline-none focus:border-luRed transition-colors"
        />
        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-muted">🔍</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-24 bg-surface border border-border rounded-[16px] animate-pulse"></div>
          ))}
        </div>
      ) : filteredUnis.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredUnis.map((uni) => (
            <div 
              key={uni.id} 
              className="group bg-surface border border-border rounded-[16px] p-4 flex items-center gap-4 hover:border-luRed/50 hover:bg-[#151515] transition-all duration-300"
            >
              {/* Short Name Box */}
              <div className="w-12 h-12 rounded-xl bg-[#111] border border-[#222] text-muted flex items-center justify-center font-black text-[11px] group-hover:bg-luRed/10 group-hover:text-luRed group-hover:border-luRed/30 transition-colors shrink-0">
                {uni.short_name}
              </div>
              
              {/* Details */}
              <div className="text-left overflow-hidden">
                <div className="text-[13px] font-bold text-white leading-tight truncate group-hover:text-luRed transition-colors">
                  {uni.name}
                </div>
                <div className="text-[10px] text-muted mt-1 uppercase tracking-wider">
                  {uni.county} County
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted">No university found for "{search}"</p>
        </div>
      )}

      <div className="text-center mt-8">
        <p className="text-sm text-muted">
          Don't see your university? <a href="/contact" className="text-luRed hover:underline font-semibold">Request to add it here</a>.
        </p>
      </div>
    </section>
  );
}
