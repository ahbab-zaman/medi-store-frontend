"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi, I can provide doctor-level medicine guidance, product details, and order support. Share age, symptoms, current medicines, and conditions for a more precise answer.",
    },
  ]);

  const endRef = useRef<HTMLDivElement | null>(null);

  const apiUrl = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ?? "";
    return `${base}/rag/chat`;
  }, []);

  const scrollToBottom = () => {
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const message = input.trim();
    if (!message || isStreaming) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: message }, { role: "assistant", content: "" }]);
    setIsStreaming(true);

    try {
      const clientRequestId = crypto.randomUUID();
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-request-id": clientRequestId,
        },
        body: JSON.stringify({ message, sessionId }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Chat request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const eventBlock of events) {
          const lines = eventBlock.split("\n").map((line) => line.trim());
          const eventName = lines.find((line) => line.startsWith("event:"))?.replace("event:", "").trim();
          const dataLine = lines.find((line) => line.startsWith("data:"));
          if (!dataLine) continue;

          const rawData = dataLine.replace("data:", "").trim();
          if (!rawData) continue;

          try {
            const parsed = JSON.parse(rawData);

            if (eventName === "meta" && parsed?.sessionId) {
              setSessionId(parsed.sessionId);
            }
            if (eventName === "warning") {
              continue;
            }

            if (parsed?.token) {
              setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last?.role !== "assistant") return prev;

                next[next.length - 1] = {
                  ...last,
                  content: `${last.content}${parsed.token}`,
                };
                return next;
              });
              scrollToBottom();
            }
          } catch {
            // Ignore malformed stream chunks.
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role !== "assistant" || last.content) return prev;

        next[next.length - 1] = {
          ...last,
          content: "Sorry, I could not process that right now.",
        };
        return next;
      });
    } finally {
      setIsStreaming(false);
      scrollToBottom();
    }
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.96 }}
        aria-label="Toggle chat"
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-2xl"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-semibold text-white">
              MediStore Clinical Assistant
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-emerald-50/30 p-4">
              {messages.map((m, idx) => (
                <motion.div
                  key={`${m.role}-${idx}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`max-w-[85%] overflow-hidden whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto bg-emerald-600 text-white"
                      : "bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {m.content || (isStreaming ? "..." : "")}
                </motion.div>
              ))}
              <div ref={endRef} />
            </div>

            <form onSubmit={onSubmit} className="border-t border-emerald-100 bg-white p-3">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 px-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a medical, product, or order question"
                  className="h-10 flex-1 bg-transparent text-sm outline-none"
                />
                <button
                  type="submit"
                  disabled={isStreaming || !input.trim()}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
