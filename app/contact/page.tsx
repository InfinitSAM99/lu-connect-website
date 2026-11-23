"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", msg: "" });

    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.from("contact_messages").insert([{
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message")
    }]);

    if (error) {
      setStatus({ type: "error", msg: "Error sending message: " + error.message });
    } else {
      setStatus({ type: "success", msg: "Message sent successfully! We will get back to you soon." });
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-[500px] mx-auto py-10">
      <div className="text-center mb-10 animate-fade-down">
        <h1 className="text-[42px] font-black mb-2 text-text transition-colors">Contact Us</h1>
        <p className="text-muted text-[18px]">Have a question or want to partner? Reach out.</p>
      </div>

      <div className="bg-surface border border-border rounded-[24px] p-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-colors">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            name="name" 
            type="text" 
            placeholder="Your Name" 
            required 
            className="w-full bg-bg border border-border rounded-[16px] px-5 py-4 text-text placeholder-muted focus:outline-none focus:border-luRed transition-colors" 
          />
          <input 
            name="email" 
            type="email" 
            placeholder="Your Email" 
            required 
            className="w-full bg-bg border border-border rounded-[16px] px-5 py-4 text-text placeholder-muted focus:outline-none focus:border-luRed transition-colors" 
          />
          <textarea 
            name="message" 
            placeholder="Your Message" 
            required 
            rows={5} 
            className="w-full bg-bg border border-border rounded-[16px] px-5 py-4 text-text placeholder-muted focus:outline-none focus:border-luRed transition-colors resize-none" 
          />
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-luRed hover:bg-[#dc2626] text-white font-bold py-4 rounded-[16px] text-[18px] transition-all disabled:opacity-50 mt-2 shadow-lg shadow-luRed/20"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
          
          {status.msg && (
            <p className={`text-center text-sm mt-2 font-medium ${status.type === "error" ? "text-luRed" : "text-green-500"}`}>
              {status.msg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
