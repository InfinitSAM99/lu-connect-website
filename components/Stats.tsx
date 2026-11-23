"use client";
import { useEffect, useState } from "react";

export default function Stats() {
  const [stats, setStats] = useState({ users: 0, posts: 0 });

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => console.error("Failed to load stats"));
  }, []);

  return (
    <div className="flex justify-center gap-[30px] my-[40px] flex-wrap text-center">
      <div className="bg-surface px-[40px] py-[20px] rounded-[16px] border border-border">
        <h2 className="text-luGold text-[36px] font-bold m-0">{stats.users > 0 ? `${stats.users}+` : "--"}</h2>
        <p className="text-muted text-sm uppercase tracking-wider mt-[5px]">Students</p>
      </div>
      <div className="bg-surface px-[40px] py-[20px] rounded-[16px] border border-border">
        <h2 className="text-luGold text-[36px] font-bold m-0">{stats.posts > 0 ? `${stats.posts}+` : "--"}</h2>
        <p className="text-muted text-sm uppercase tracking-wider mt-[5px]">Posts</p>
      </div>
    </div>
  );
}
