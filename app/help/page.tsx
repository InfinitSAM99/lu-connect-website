"use client";

import Link from "next/link";

export default function HelpCenter() {
  // You can easily add more videos to this array later!
  const videos = [
    {
      id: "i_MrSAbc2D8",
      title: "How to Download & Install",
      description: "Step-by-step guide to getting LU Connect on your Android phone.",
      duration: "1:45",
      category: "Getting Started"
    },
    // Placeholders for when you make the next videos:
    {
      id: "dQw4w9WgXcQ", // Just a placeholder ID for testing
      title: "How to Setup Your Profile",
      description: "Upload a profile picture, set your bio, and link your university.",
      duration: "2:30",
      category: "Getting Started"
    },
    {
      id: "dQw4w9WgXcQ", // Just a placeholder ID for testing
      title: "How to Post & Use Groups",
      description: "Learn how to post to the feed, join groups, and chat with students.",
      duration: "3:15",
      category: "Using the App"
    }
  ];

  return (
    <div className="max-w-[900px] mx-auto py-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-[42px] font-black mb-2 text-white">Help Center</h1>
        <p className="text-muted text-[18px]">Watch our video guides to master LU Connect.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video, index) => (
          <a
            key={index}
            href={`https://youtu.be/${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-[#181818] border border-[#2a2a2a] rounded-[20px] overflow-hidden hover:border-[#ef4444] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(239,68,68,0.15)]"
          >
            {/* Thumbnail Area */}
            <div className="relative">
              <img
                src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                alt={video.title}
                className="w-full h-[200px] object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6)] group-hover:scale-110 transition-transform duration-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" className="ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[12px] font-bold px-2 py-1 rounded">
                {video.duration}
              </div>

              {/* Category Badge */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/10">
                {video.category}
              </div>
            </div>

            {/* Text Area */}
            <div className="p-5">
              <h3 className="text-white font-bold text-[18px] leading-tight mb-2 group-hover:text-[#ef4444] transition-colors">
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
        <Link href="/" className="inline-block bg-[#27272a] hover:bg-[#3f3f46] text-white font-bold py-3 px-8 rounded-xl transition-colors">
          Contact Support
        </Link>
      </div>
    </div>
  );
}
