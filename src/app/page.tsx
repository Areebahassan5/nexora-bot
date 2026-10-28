"use client";

import { useState } from "react";
import rules from "./rules.json";

type Message = {
  id: number;
  text: string;
  sender: "bot" | "user";
};

const quickQuestions = [
  "What courses do you offer?",
  "Tell me about AI",
  "What are the fees?",
  "How can I get admission?",
  "Do you offer online classes?",
  "Do you provide certificates?"
];

function normalizeText(text: string) {
  return text.toLowerCase().replace(/[^\w\s./-]/g, " ").replace(/\s+/g, " ").trim();
}

function getBotResponse(message: string): string {
  const normalized = normalizeText(message);
  const words = normalized.split(" ");

  if (!normalized) {
    return "Please type a question so I can help you. 😊";
  }

  for (const intent of rules.intents) {
    const matched = intent.keywords.some((keyword) => {
      const normalizedKeyword = normalizeText(keyword);

      if (["hi", "hey", "bye"].includes(normalizedKeyword)) {
        return words.includes(normalizedKeyword);
      }

      return normalized.includes(normalizedKeyword);
    });

    if (matched) return intent.response;
  }

  return rules.fallback;
}

function BotMascot({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center ${
        small ? "h-12 w-12" : "h-64 w-64 sm:h-80 sm:w-80"
      }`}
    >
      {!small && (
        <>
          <div className="absolute inset-5 rounded-full bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200 shadow-inner" />
          <div className="absolute left-1 top-14 animate-bounce text-2xl text-blue-500">
            ✦
          </div>
          <div className="absolute right-2 top-20 animate-pulse text-3xl text-violet-500">
            ✧
          </div>
          <div className="absolute bottom-10 left-4 animate-pulse text-xl text-blue-400">
            ✦
          </div>
          <div className="absolute right-5 bottom-14 text-2xl text-indigo-400">
            •
          </div>
        </>
      )}

      <div
        className={`relative flex items-center justify-center ${
          small ? "h-10 w-10" : "animate-[float_3s_ease-in-out_infinite]"
        }`}
      >
        <div
          className={`relative flex items-center justify-center rounded-[35%] border-4 border-white bg-gradient-to-br from-slate-100 via-white to-blue-100 shadow-[0_18px_40px_rgba(37,99,235,0.2)] ${
            small ? "h-9 w-9 border-2" : "h-40 w-36 sm:h-48 sm:w-44"
          }`}
        >
          {!small && (
            <>
              <div className="absolute -left-4 top-16 h-10 w-5 rounded-full border-4 border-white bg-blue-400" />
              <div className="absolute -right-4 top-16 h-10 w-5 rounded-full border-4 border-white bg-indigo-400" />

              <div className="absolute top-1/2 left-1/2 h-24 w-28 -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-gradient-to-br from-[#123a70] to-[#2563eb] shadow-inner sm:h-28 sm:w-32">
                <div className="flex h-full flex-col items-center justify-center gap-3">
                  <div className="flex gap-7">
                    <span className="h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_12px_#67e8f9]" />
                    <span className="h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_12px_#67e8f9]" />
                  </div>
                  <div className="h-3 w-8 rounded-b-full border-b-[3px] border-cyan-200" />
                </div>
              </div>

              <div className="absolute -bottom-5 left-1/2 flex h-12 w-24 -translate-x-1/2 items-center justify-center rounded-b-2xl rounded-t-lg border-2 border-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
                <span className="text-xl">🎓</span>
              </div>

              <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                <div className="relative flex h-4 w-36 -rotate-6 items-center justify-center rounded-sm bg-[#102f61] shadow-lg sm:w-40">
                  <div className="absolute -top-7 left-1/2 h-8 w-28 -translate-x-1/2 -skew-x-12 rounded-md border-b-4 border-blue-300 bg-gradient-to-r from-[#123a70] to-[#2563eb]" />
                  <div className="absolute -right-1 top-2 h-12 w-1.5 rotate-6 rounded-full bg-amber-400" />
                  <div className="absolute -right-2 top-12 h-3 w-4 rounded-b-full bg-amber-400" />
                </div>
              </div>

              <div className="absolute -left-7 bottom-0 rotate-[-15deg] text-4xl">
                👋
              </div>
            </>
          )}

          {small && (
            <div className="flex h-full w-full items-center justify-center rounded-[25%] bg-gradient-to-br from-blue-600 to-indigo-700 text-xl">
              🤖
            </div>
          )}
        </div>
      </div>

      {!small && (
        <div className="absolute bottom-0 left-1/2 -z-0 h-5 w-40 -translate-x-1/2 rounded-full bg-blue-300/40 blur-xl" />
      )}
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hello! 👋 Welcome to Nexora Learning Institute.\n\nI'm NexoraBot, your learning assistant. I can help you explore courses, fees, admissions, class timings, and certificates.\n\nWhat would you like to learn today?"
    }
  ]);

  const [input, setInput] = useState("");
  const [nextId, setNextId] = useState(2);

  function sendMessage(text: string = input) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((previous) => [
      ...previous,
      { id: nextId, text: trimmed, sender: "user" },
      {
        id: nextId + 1,
        text: getBotResponse(trimmed),
        sender: "bot"
      }
    ]);

    setNextId((previous) => previous + 2);
    setInput("");
  }

  function clearChat() {
    setMessages([
      {
        id: nextId,
        sender: "bot",
        text: "Fresh start! ✨ I'm ready to help you again. What would you like to know?"
      }
    ]);
    setNextId((previous) => previous + 1);
    setInput("");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f7ff] text-[#172747]">
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        html { scroll-behavior: smooth; }
      `}</style>

      <header className="sticky top-0 z-20 border-b border-blue-100/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-2xl text-white shadow-lg shadow-blue-500/20">
              🎓
            </div>
            <div>
              <p className="text-xl font-black tracking-tight">
                Nexora<span className="text-blue-600">.</span>
              </p>
              <p className="text-xs font-medium text-slate-500">
                LEARN WITHOUT LIMITS
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a href="#" className="text-blue-700">Home</a>
            <a href="#courses" className="transition hover:text-blue-700">Courses</a>
            <a href="#features" className="transition hover:text-blue-700">Student Support</a>
          </nav>

          <a
            href="#chat"
            className="rounded-full bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 sm:px-6"
          >
            Chat with NexoraBot <span className="ml-1">↗</span>
          </a>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            YOUR FRIENDLY LEARNING PARTNER
          </div>

          <h1 className="mt-7 max-w-2xl text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Big dreams.
            <span className="mt-2 block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Smart learning.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Meet NexoraBot, your little digital study buddy! Explore learning
            programs, get admission guidance, and find answers to your
            education questions in seconds.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#chat"
              className="rounded-xl bg-blue-600 px-6 py-4 font-bold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-1 hover:bg-blue-700"
            >
              Talk to NexoraBot <span className="ml-2">✦</span>
            </a>
            <a
              href="#courses"
              className="rounded-xl border border-blue-200 bg-white px-6 py-4 font-bold text-blue-800 transition hover:bg-blue-50"
            >
              Explore Courses
            </a>
          </div>

          <div className="mt-9 flex flex-wrap gap-5 text-sm text-slate-600">
            <span>✓ Quick answers</span>
            <span>✓ Easy to use</span>
            <span>✓ Student-friendly</span>
          </div>
        </div>

        <div className="relative flex min-h-[360px] items-center justify-center rounded-[2.5rem] border border-white bg-gradient-to-br from-[#e2edff] via-[#f2efff] to-[#e0f7ff] p-8 shadow-xl shadow-blue-900/5 sm:min-h-[440px]">
          <div className="absolute left-7 top-8 rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-lg shadow-blue-900/5">
            <p className="text-xs font-semibold text-slate-500">YOUR STUDY BUDDY</p>
            <p className="mt-1 font-bold text-blue-800">Always ready to help ✨</p>
          </div>

          <BotMascot />

          <div className="absolute bottom-7 right-5 rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-lg shadow-blue-900/5 sm:right-8">
            <p className="text-sm font-bold text-slate-800">NexoraBot</p>
            <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Learning assistant
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              HERE TO HELP
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Your questions, answered.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-500">
            Choose a topic to see what NexoraBot can help you with.
          </p>
        </div>

        <div id="courses" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: "📚",
              title: "Explore Courses",
              description: "Find learning programs that match your interests.",
              color: "bg-blue-100"
            },
            {
              icon: "📝",
              title: "Admission Guide",
              description: "Understand the steps to get started.",
              color: "bg-violet-100"
            },
            {
              icon: "🕒",
              title: "Class Timings",
              description: "Ask about schedules and learning formats.",
              color: "bg-cyan-100"
            },
            {
              icon: "🏆",
              title: "Certificates",
              description: "Learn about course completion requirements.",
              color: "bg-amber-100"
            }
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-blue-100/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${item.color}`}>
                {item.icon}
              </div>
              <h3 className="mt-5 text-lg font-extrabold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
              <a href="#chat" className="mt-5 inline-flex font-bold text-blue-600 hover:text-blue-800">
                Ask NexoraBot <span className="ml-2">→</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="chat" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mb-9 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            LET'S CHAT
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            Ask away. We’re listening.
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-500">
            Chat with your graduation-cap-wearing learning companion about
            courses, admissions, fees, and more.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#123a70] via-blue-700 to-indigo-700 p-7 text-white sm:p-9">
            <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex justify-center">
              <BotMascot small={false} />
            </div>

            <div className="relative mt-5 text-center">
              <h3 className="text-3xl font-black">NexoraBot</h3>
              <p className="mt-2 font-medium text-blue-100">Your Learning Assistant</p>
              <p className="mt-5 text-sm leading-7 text-blue-100">
                Curious about something? Ask me a question and let's figure
                out your next learning step together.
              </p>
            </div>

            <div className="relative mt-7 rounded-2xl border border-white/15 bg-white/10 p-5">
              <p className="font-bold">I can help you with:</p>
              <ul className="mt-4 space-y-3 text-sm text-blue-50">
                <li>📘 Course information</li>
                <li>🎓 Admission guidance</li>
                <li>💳 Fee information</li>
                <li>🗓️ Class schedules</li>
                <li>🏅 Certificates</li>
              </ul>
            </div>
          </aside>

          <div className="flex min-h-[650px] flex-col overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-2xl shadow-blue-900/5">
            <div className="flex items-center justify-between border-b border-blue-50 px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-50 p-1">
                  <BotMascot small />
                </div>
                <div>
                  <h3 className="font-extrabold">NexoraBot</h3>
                  <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Ready to help
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={clearChat}
                className="rounded-xl border border-blue-100 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-50 sm:px-4"
              >
                Clear Chat
              </button>
            </div>

            <div
              aria-live="polite"
              aria-label="Chat messages"
              className="flex-1 space-y-5 overflow-y-auto bg-gradient-to-b from-[#f8faff] to-white p-4 sm:p-6"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="mb-1 rounded-xl bg-blue-50">
                      <BotMascot small />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 sm:max-w-[80%] ${
                      message.sender === "user"
                        ? "rounded-br-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/10"
                        : "rounded-bl-md border border-blue-100 bg-white text-slate-700 shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.text}</p>
                  </div>

                  {message.sender === "user" && (
                    <div className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-lg">
                      🙂
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-blue-50 bg-white p-4 sm:p-6">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Quick questions
              </p>

              <div className="mb-5 flex flex-wrap gap-2">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => sendMessage(question)}
                    className="rounded-full border border-blue-100 bg-[#f8faff] px-3 py-2 text-xs font-semibold text-blue-800 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    {question}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-2 rounded-2xl border border-blue-100 bg-[#f8faff] p-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
              >
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask NexoraBot anything..."
                  aria-label="Type your message"
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />

                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send message"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ↑
                </button>
              </form>

              <p className="mt-3 text-center text-xs text-slate-400">
                NexoraBot · Student support demo
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-blue-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:px-8">
          <p className="font-black text-slate-800">
            Nexora<span className="text-blue-600">.</span>
          </p>
          <p>Learn today. Build tomorrow. ✨</p>
        </div>
      </footer>
    </main>
  );
}