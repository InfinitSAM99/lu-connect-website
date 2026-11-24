"use client";

import Link from "next/link";

export default function VideoGuides() {
  const videos = [
    {
      id: "i_MrSAbc2D8",
      title: "How to Download & Install",
      description: "Step-by-step guide to getting LU Connect on your Android phone.",
      duration: "1:45",
      category: "Getting Started"
    }
  ];

  return (
    /* Added pt-[100px] to push it down below the fixed header */
    <div className="max-w-[800px] mx-auto pt-[100px] pb-24 px-4 w-full">
      <div className="text-center mb-8">
        <h1 className="text-[36px] md:text-[42px] font-black mb-2 text-white">Video Guides</h1>
        <p className="text-muted text-[16px]">Watch our quick tutorials to master LU Connect.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {videos.map((video, index) => (
          <a
            key={index}
            href={`https://youtu.be/${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-[#181818] border border-[#2a2a2a] rounded-[20px] overflow-hidden hover:border-[#ef4444] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(239,68,68,0.15)] w-full max-w-[500px] mx-auto"
          >
            <div className="relative w-full">
              <img
                src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                alt={video.title}
                className="w-full h-auto aspect-video object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.8)] group-hover:scale-110 transition-transform duration-300">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" className="ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[12px] font-bold px-2 py-1 rounded">
                {video.duration}
              </div>

              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/10">
                {video.category}
              </div>
            </div>

            <div className="p-5 text-left">
              <h3 className="text-white font-bold text-[20px] leading-tight mb-2 group-hover:text-[#ef4444] transition-colors">
                {video.title}
              </h3>
              <p className="text-[#a1a1aa] text-[14px] leading-relaxed">
                {video.description}
              </p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-[#a1a1aa] text-sm mb-4">Still need help?</p>
        <Link href="/help" className="inline-block bg-[#27272a] hover:bg-[#3f3f46] text-white font-bold py-3 px-8 rounded-xl transition-colors">
          Go to Help Center
        </Link>
      </div>
    </div>
  );
}
