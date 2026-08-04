"use client";

import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { askCopilot, type CopilotResponse } from "../../lib/ai-engine";
import { Send, Bot, Sparkles, ExternalLink, MessageSquareText } from "lucide-react";

const suggestedPrompts = [
  "Which departments are non-compliant?",
  "Show all obligations related to cybersecurity.",
  "What changed after Circular SEBI/HO/MRD/MRD-PoD-2/CIR/P/2025/045?",
  "Generate inspection report for the last quarter.",
  "Summarize pending risks.",
];

interface Message {
  role: "user" | "assistant";
  content: string;
  response?: CopilotResponse;
}

export default function AICopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello Kumari, I’m your Compliance Digital Twin copilot. Ask me anything about circulars, obligations, or risk posture.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (query: string) => {
    if (!query.trim() || loading) return;

    setMessages((m) => [...m, { role: "user", content: query }]);
    setInput("");
    setLoading(true);

    try {
      const res = await askCopilot(query);
      setMessages((m) => [...m, { role: "assistant", content: res.answer, response: res }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
          <p className="section-label">Natural language interface</p>
          <h1 className="page-title mt-4">AI Copilot</h1>
          <p className="page-subtitle">
            Query the Compliance Digital Twin in natural language for circulars, obligations,
            changes, workflow posture, and risk exposure.
          </p>
        </div>

        <Card className="rounded-[28px] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Session mode
              </p>
              <p className="mt-2 text-lg font-semibold text-white">Context-aware assistant</p>
              <p className="mt-1 text-sm text-zinc-400">Compliance Q&A and action guidance</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
              <Bot size={18} className="text-cyan-300" />
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-zinc-300">
              Circular analysis
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-zinc-300">
              Obligation reasoning
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-zinc-300">
              Risk summarization
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => send(prompt)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-zinc-400 transition-colors hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            {prompt}
          </button>
        ))}
      </div>

      <Card className="flex min-h-[560px] flex-1 flex-col rounded-[28px] p-0">
        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <MessageSquareText size={16} className="text-cyan-300" />
            <p className="text-sm font-semibold text-white">Conversation</p>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl border p-4 text-sm ${
                  m.role === "user"
                    ? "border-cyan-500/30 bg-cyan-500/10 text-gray-100"
                    : "border-white/10 bg-white/[0.03] text-gray-200"
                }`}
              >
                {m.role === "assistant" ? (
                  <div className="mb-2 flex items-center gap-1.5 text-cyan-400">
                    <Bot size={12} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
                      Copilot
                    </span>
                  </div>
                ) : null}

                <p className="leading-7">{m.content}</p>

                {m.response ? (
                  <div className="mt-4 space-y-3 border-t border-white/10 pt-3">
                    {m.response.sourceCirculars.length > 0 ? (
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                          Sources
                        </p>
                        <div className="mt-2 space-y-1.5">
                          {m.response.sourceCirculars.map((s) => (
                            <p key={s} className="flex items-center gap-1.5 text-xs text-zinc-400">
                              <ExternalLink size={11} />
                              {s}
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {m.response.suggestedActions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {m.response.suggestedActions.map((a, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-1 text-[11px] text-cyan-300"
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          ))}

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Sparkles size={14} className="animate-pulse text-cyan-400" />
              Thinking...
            </div>
          ) : null}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-white/10 px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about obligations, risk, or circulars..."
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:outline-none"
            />
            <Button type="submit" className="px-4 py-3">
              <Send size={14} />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
