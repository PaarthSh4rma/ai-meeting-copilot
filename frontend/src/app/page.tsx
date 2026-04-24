"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  AudioWaveform,
  Bot,
  FileText,
  MessageSquareText,
  Mic,
  Sparkles,
  Upload,
  WandSparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getHealth, uploadMeetingAudio } from "@/lib/api";

const features = [
  {
    icon: Mic,
    title: "Transcribe",
    description: "Convert meeting audio into clean, searchable text.",
  },
  {
    icon: Sparkles,
    title: "Summarize",
    description: "Extract summaries, decisions, and action items.",
  },
  {
    icon: MessageSquareText,
    title: "Ask",
    description: "Query your meeting transcript with local AI.",
  },
  {
    icon: FileText,
    title: "Remember",
    description: "Keep a clean dashboard of meeting history.",
  },
];

const pipeline = [
  "Upload audio",
  "Whisper transcription",
  "Structured LLM insights",
  "Meeting Q&A",
];

export default function Home() {
  const [backendStatus, setBackendStatus] = useState("checking");
  const [uploadStatus, setUploadStatus] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");

  useEffect(() => {
    getHealth()
      .then(() => setBackendStatus("online"))
      .catch(() => setBackendStatus("offline"));
  }, []);

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus(`Uploading ${file.name}...`);
      const result = await uploadMeetingAudio(file, meetingTitle.trim());
      setUploadStatus(`Uploaded ${result.title || result.filename}`);
      setMeetingTitle("");
      event.target.value = "";

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 700);
    } catch {
      setUploadStatus("Upload failed. Check backend is running.");
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.24),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(168,85,247,0.14),transparent_36%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      <section className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Badge
            variant="outline"
            className="border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-cyan-200"
          >
            <WandSparkles className="mr-2 h-3.5 w-3.5" />
            Local AI meeting intelligence
          </Badge>

          <h1 className="mt-7 max-w-5xl text-5xl font-bold tracking-tight sm:text-7xl">
            Turn raw meeting audio into{" "}
            <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-300 bg-clip-text text-transparent">
              instant clarity.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Upload a meeting, generate a transcript, extract decisions and
            action items, then ask questions like you have a searchable memory
            of the conversation.
          </p>

          <div className="mt-8 max-w-xl rounded-3xl border border-white/10 bg-zinc-950/70 p-4 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Input
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="Name this meeting, e.g. Product sync"
                className="h-12 border-zinc-800 bg-black/70 text-white placeholder:text-zinc-600"
              />

              <label>
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                <Button
                  size="lg"
                  className="h-12 w-full rounded-2xl bg-white px-6 text-black hover:bg-zinc-200 sm:w-auto"
                  asChild
                >
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </span>
                </Button>
              </label>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    backendStatus === "online"
                      ? "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]"
                      : backendStatus === "checking"
                        ? "bg-yellow-400"
                        : "bg-red-400"
                  }`}
                />
                Backend {backendStatus}
              </div>

              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="rounded-full text-zinc-300 hover:bg-zinc-900 hover:text-white"
                >
                  Open dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {uploadStatus && (
              <p className="mt-3 rounded-2xl border border-zinc-800 bg-black/50 px-4 py-3 text-sm text-zinc-300">
                {uploadStatus}
              </p>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-cyan-500/20 to-violet-500/20 blur-3xl" />

          <Card className="relative overflow-hidden border-white/10 bg-zinc-950/80 shadow-2xl shadow-black/60 backdrop-blur-xl">
            <CardContent className="p-0">
              <div className="border-b border-white/10 bg-white/[0.03] px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>
              </div>

              <div className="p-6">
                <div className="rounded-3xl border border-zinc-800 bg-black/70 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">
                        AI pipeline
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold">
                        Meeting processed
                      </h2>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                      <AudioWaveform className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-7 space-y-3">
                    {pipeline.map((item, index) => (
                      <div
                        key={item}
                        className="flex items-center gap-4 rounded-2xl border border-zinc-900 bg-zinc-950 p-4"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
                          {index + 1}
                        </div>
                        <span className="text-sm text-zinc-300">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-200">
                      <Bot className="h-4 w-4" />
                      Copilot insight
                    </div>
                    <p className="text-sm leading-6 text-zinc-300">
                      “Alex owns query optimization, Priya owns UI cleanup, and
                      the team agreed to ship next week.”
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border-white/10 bg-zinc-950/60 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-zinc-950"
            >
              <CardContent className="p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-zinc-300 transition group-hover:bg-cyan-400/10 group-hover:text-cyan-200">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}