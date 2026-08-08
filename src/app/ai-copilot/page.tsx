"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  Bot,
  FileText,
  History,
  Paperclip,
  Send,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";

import Shell from "../../components/layout/Shell";
import { askCopilot, type CopilotResponse } from "../../lib/ai-engine";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  response?: CopilotResponse;
};

type QuickAction = {
  label: string;
  icon: string;
  prompt: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Summarize document",
    icon: "📄",
    prompt:
      "Summarize the Master Circular for Stock Brokers in 5 key points.",
  },
  {
    label: "Generate workflow",
    icon: "⚙️",
    prompt:
      "Generate compliance workflows for the top 5 highest-risk obligations.",
  },
  {
    label: "High-risk obligations",
    icon: "🛡",
    prompt:
      "Show me all critical and high-risk obligations that need immediate attention.",
  },
  {
    label: "Explain clause",
    icon: "🔍",
    prompt:
      "Explain Clause 14.2 Enhanced Customer Due Diligence in plain English.",
  },
  {
    label: "Inspection report",
    icon: "📊",
    prompt:
      "Generate a comprehensive SEBI inspection readiness report with evidence status.",
  },
];

const SUGGESTED_PROMPTS = [
  "What is my current compliance score?",
  "Which obligations are overdue?",
  "Explain STR filing requirements",
  "Show gaps versus industry benchmarks",
];

const HISTORY_ITEMS = [
  {
    label: "What are the key AML obligations?",
    time: "Yesterday",
  },
  {
    label: "Explain Clause 14.2 in plain English",
    time: "Yesterday",
  },
  {
    label: "Generate inspection readiness report",
    time: "2 days ago",
  },
  {
    label: "What evidence is needed for Clause 47.3?",
    time: "3 days ago",
  },
  {
    label: "Compare v2 vs v3 of Circular 089",
    time: "5 days ago",
  },
];

function currentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MarkdownText({ text }: { text: string }) {
  return (
    <div className="space-y-1 leading-7">
      {text.split("\n").map((line, index) => {
        if (!line) {
          return <div key={index} className="h-2" />;
        }

        const parts = line.split(/(\*\*[^*]+\*\*)/g);

        return (
          <p key={index}>
            {parts.map((part, partIndex) => {
              const isBold =
                part.startsWith("**") &&
                part.endsWith("**");

              return isBold ? (
                <strong
                  key={partIndex}
                  className="font-semibold text-white"
                >
                  {part.replace(/\*\*/g, "")}
                </strong>
              ) : (
                <span key={partIndex}>{part}</span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}

function CopilotAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/20">
      <Sparkles size={14} className="text-white" />
    </div>
  );
}

export default function AICopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I’m your REGOS-SEBI AI Copilot. I can help you interpret clauses, assess obligations, generate workflows, and prepare for SEBI inspections. What would you like to explore?",
      timestamp: "09:14 AM",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const sendMessage = async (value: string) => {
    const query = value.trim();

    if (!query || isTyping) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: currentTime(),
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);
    setInput("");
    setIsTyping(true);

    try {
      const result = await askCopilot(query);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: result.answer,
        timestamp: currentTime(),
        response: result,
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The copilot could not complete this request.";

      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: `I was unable to process that request.\n\n${message}`,
          timestamp: currentTime(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleInputKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content:
          "Conversation cleared. Ask me about SEBI circulars, obligations, workflows, evidence, or risk posture.",
        timestamp: currentTime(),
      },
    ]);
  };

  return (
    <Shell
      mode="demo"
      docName="Master Circular – Stock Brokers"
      docPages={419}
    >
      <div className="flex min-h-[calc(100vh-64px)] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#05080f] lg:flex-row">
        <aside className="w-full shrink-0 overflow-y-auto border-b border-white/10 bg-[rgba(4,7,13,0.75)] lg:w-[280px] lg:border-b-0 lg:border-r">
          <div className="p-4">
            <p className="mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.07em] text-zinc-500">
              Active Document
            </p>

            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.04] p-4">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-9 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-cyan-500/20 bg-cyan-500/10">
                  <FileText size={16} className="text-cyan-400" />
                  <span className="text-[7px] font-bold text-cyan-400">
                    PDF
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-[13px] font-bold leading-5 text-white">
                    Master Circular – Stock Brokers
                  </p>

                  <p className="mt-1 truncate font-mono text-[9.5px] text-zinc-500">
                    SEBI/HO/MIRSD/2024/089
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {[
                  ["Pages", "419"],
                  ["Clauses", "532"],
                  ["Obligations", "148"],
                  ["AI Score", "94%"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-cyan-500/10 bg-cyan-500/[0.04] p-2 text-center"
                  >
                    <p className="text-sm font-extrabold text-cyan-300">
                      {value}
                    </p>

                    <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-zinc-500">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-4 pb-4">
            <p className="mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.07em] text-zinc-500">
              Quick Actions
            </p>

            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                disabled={isTyping}
                onClick={() => void sendMessage(action.prompt)}
                className="mb-1.5 flex w-full items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left text-xs text-zinc-300 transition-colors hover:border-cyan-500/30 hover:bg-cyan-500/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="text-sm">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>

          <div className="px-4 pb-5">
            <div className="mb-3 h-px bg-white/10" />

            <p className="mb-2.5 flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.07em] text-zinc-500">
              <History size={12} />
              History
            </p>

            {HISTORY_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                disabled={isTyping}
                onClick={() => void sendMessage(item.label)}
                className="mb-1 w-full rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-cyan-500/[0.06] disabled:opacity-50"
              >
                <p className="text-xs leading-5 text-zinc-300">
                  {item.label}
                </p>

                <p className="mt-0.5 text-[10px] text-zinc-600">
                  {item.time}
                </p>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex min-h-[680px] min-w-0 flex-1 flex-col bg-[radial-gradient(ellipse_60%_40%_at_70%_-10%,rgba(56,189,248,0.04),transparent_60%),#05080f]">
          <header className="flex items-center gap-3 border-b border-white/10 bg-black/20 px-5 py-3.5 lg:px-6">
            <CopilotAvatar />

            <div>
              <p className="text-[15px] font-bold text-white">
                AI Copilot
              </p>

              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Online · SEBI context loaded
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={clearConversation}
                className="btn-ghost text-xs"
              >
                <X size={12} />
                Clear
              </button>

              <button
                type="button"
                className="btn-secondary hidden text-xs sm:inline-flex"
              >
                Export Chat
              </button>
            </div>
          </header>

          <div className="flex gap-2 overflow-x-auto border-b border-cyan-500/[0.08] bg-black/10 px-5 py-2.5 lg:px-6">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={isTyping}
                onClick={() => void sendMessage(prompt)}
                className="shrink-0 rounded-full border border-cyan-500/15 bg-cyan-500/[0.06] px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-cyan-500/10 hover:text-cyan-300 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 lg:px-7">
            {messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    isUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {isUser ? (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500 text-xs font-bold text-white">
                      RS
                    </div>
                  ) : (
                    <CopilotAvatar />
                  )}

                  <div
                    className={`max-w-[88%] lg:max-w-[75%] ${
                      isUser ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`rounded-[18px] p-4 text-sm ${
                        isUser
                          ? "rounded-br-[4px] border border-cyan-500/25 bg-cyan-500/10 text-white"
                          : "rounded-bl-[4px] border border-cyan-500/10 bg-slate-950/70 text-zinc-300"
                      }`}
                    >
                      {isUser ? (
                        <p className="leading-7">
                          {message.content}
                        </p>
                      ) : (
                        <MarkdownText text={message.content} />
                      )}

                      {message.response ? (
                        <div className="mt-4 space-y-3 border-t border-white/10 pt-3 text-left">
                          {message.response.sourceCirculars.length >
                          0 ? (
                            <div>
                              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                                Sources
                              </p>

                              <div className="space-y-1.5">
                                {message.response.sourceCirculars.map(
                                  (source) => (
                                    <p
                                      key={source}
                                      className="flex items-center gap-1.5 text-xs text-zinc-400"
                                    >
                                      <FileText size={11} />
                                      {source}
                                    </p>
                                  ),
                                )}
                              </div>
                            </div>
                          ) : null}

                          {message.response.suggestedActions.length >
                          0 ? (
                            <div className="flex flex-wrap gap-2">
                              {message.response.suggestedActions.map(
                                (action) => (
                                  <button
                                    key={action}
                                    type="button"
                                    onClick={() =>
                                      void sendMessage(action)
                                    }
                                    className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-1 text-[11px] text-cyan-300"
                                  >
                                    {action}
                                  </button>
                                ),
                              )}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    <p
                      className={`mt-1.5 px-1.5 text-[10px] text-zinc-600 ${
                        isUser ? "text-right" : "text-left"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}

            {isTyping ? (
              <div className="flex items-center gap-3">
                <CopilotAvatar />

                <div className="flex items-center gap-1.5 rounded-[18px] rounded-bl-[4px] border border-cyan-500/10 bg-slate-950/70 px-4 py-3">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400"
                      style={{
                        animationDelay: `${delay}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-white/10 bg-black/20 px-5 pb-4 pt-3 lg:px-6"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
              <button
                type="button"
                className="btn-icon h-8 w-8 shrink-0"
                aria-label="Attach file"
              >
                <Paperclip size={15} />
              </button>

              <textarea
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={handleInputKeyDown}
                rows={1}
                placeholder="Ask about clauses, obligations, risk scores, workflows..."
                className="max-h-32 min-h-8 flex-1 resize-none bg-transparent px-1 py-1 text-sm leading-6 text-white outline-none placeholder:text-zinc-600"
              />

              <button
                type="button"
                className="btn-icon hidden h-8 w-8 shrink-0 sm:inline-flex"
                aria-label="Voice input"
              >
                <Volume2 size={15} />
              </button>

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 text-slate-950 transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            </div>

            <p className="mt-2 text-center text-[10px] text-zinc-600">
              Context: 419 pages · 532 clauses · 148 obligations · Knowledge graph active
            </p>
          </form>
        </section>
      </div>
    </Shell>
  );
}