"use client";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function LUAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: "assistant", content: "Hi there! I'm the LU Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      
      if (data.error) {
        setMessages([...newMessages, { role: "assistant", content: `Error: ${data.error}` }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I am having connection issues right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] bg-[#ef4444] hover:bg-[#dc2626] text-white p-4 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-transform hover:scale-105"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Full Screen Chat Window Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex justify-end items-end pointer-events-none">
          {/* 
            CHANGED: 
            w-full h-full on mobile (no padding, no rounded corners)
            md:w-[450px] md:h-[650px] md:m-6 md:rounded-2xl on desktop
          */}
          <div className="pointer-events-auto w-full h-full md:w-[450px] md:h-[700px] md:m-6 bg-[#0a0a0a] md:bg-[#0a0a0a]/95 md:backdrop-blur-xl md:border md:border-[#1f1f1f] md:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
            
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-[#1f1f1f] bg-[#111]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#ef4444] flex items-center justify-center font-bold text-white text-sm">LU</div>
                <div>
                  <h3 className="text-white font-bold text-sm">LU Assistant</h3>
                  <p className="text-green-500 text-[10px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[90%] p-3 rounded-2xl text-sm ${
                    msg.role === "user" 
                      ? "bg-[#ef4444] text-white rounded-tr-sm" 
                      : "bg-[#1f1f1f] text-gray-200 rounded-tl-sm border border-[#333] overflow-hidden"
                  }`}>
                    {msg.role === "user" ? (
                      msg.content
                    ) : (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            table: ({node, ...props}) => <div className="overflow-x-auto my-2"><table className="w-full text-xs text-left border-collapse" {...props} /></div>,
                            th: ({node, ...props}) => <th className="border-b border-[#444] p-2 bg-[#2a2a2a] text-white font-bold" {...props} />,
                            td: ({node, ...props}) => <td className="border-b border-[#333] p-2 text-gray-300" {...props} />,
                            p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                            strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="text-gray-300" {...props} />,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#1f1f1f] p-3 rounded-2xl rounded-tl-sm border border-[#333]">
                    <Loader2 className="w-5 h-5 text-[#ef4444] animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-3 border-t border-[#1f1f1f] bg-[#0a0a0a] flex gap-2 pb-6 md:pb-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-[#1f1f1f] text-white text-sm px-4 py-2 rounded-xl focus:outline-none focus:border-[#ef4444] border border-transparent transition-colors"
              />
              <button 
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-[#ef4444] hover:bg-[#dc2626] text-white p-2.5 rounded-xl disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
