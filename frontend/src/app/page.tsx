"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  MessageSquareText,
  Mic,
  Sparkles,
  Upload,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getHealth, uploadMeetingAudio } from "@/lib/api";

const features = [
  {
    icon: Mic,
    title: "Whisper transcription",
    description: "Convert uploaded meeting audio into clean text transcripts.",
  },
  {
    icon: Sparkles,
    title: "Structured AI insights",
    description: "Generate summaries, decisions, and action items with LLMs.",
  },
  {
    icon: MessageSquareText,
    title: "Ask your meeting",
    description: "Query transcripts conversationally using local AI inference.",
  },
  {
    icon: FileText,
    title: "Meeting memory",
    description: "Keep a searchable history of uploaded meetings and outcomes.",
  },
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
    } catch {
      setUploadStatus("Upload failed. Check backend is running.");
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#18181b_0%,#000_42%)] text-white">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Badge
            variant="outline"
            className="border-zinc-700 bg-zinc-950/60 text-zinc-300"
          >
            Local AI meeting intelligence
          </Badge>

          <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
            Turn meeting chaos into clean execution.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Upload audio, transcribe it with Whisper, extract decisions and
            action items with LLMs, then ask questions across the meeting.
          </p>

          <div className="mt-8 max-w-md">
            <Input
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="Meeting display name, e.g. Product sync"
              className="h-12 border-zinc-800 bg-zinc-950 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label>
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              <Button
                size="lg"
                className="rounded-full bg-white text-black hover:bg-zinc-200"
                asChild
              >
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload meeting
                </span>
              </Button>
            </label>

            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-zinc-700 bg-transparent text-white hover:bg-zinc-900"
              >
                Open dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-3 text-sm text-zinc-500">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                backendStatus === "online" ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
            Backend {backendStatus}
          </div>

          {uploadStatus && (
            <p className="mt-3 text-sm text-zinc-400">{uploadStatus}</p>
          )}
        </div>

        <Card className="border-zinc-800 bg-zinc-950/70 shadow-2xl shadow-black/40 backdrop-blur">
          <CardContent className="p-6">
            <div className="rounded-2xl border border-zinc-800 bg-black p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Latest meeting</p>
                  <h2 className="mt-1 text-xl font-semibold">Product sync</h2>
                </div>

                <Badge className="bg-emerald-500/10 text-emerald-400">
                  completed
                </Badge>
              </div>

              <div className="space-y-4">
                {[
                  "Transcript generated with Whisper",
                  "3 action items extracted",
                  "2 decisions identified",
                  "Q&A ready",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-zinc-900 bg-zinc-950 p-3"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border-zinc-800 bg-zinc-950/60 transition hover:-translate-y-1 hover:border-zinc-700"
            >
              <CardContent className="p-6">
                <feature.icon className="mb-5 h-6 w-6 text-zinc-300" />
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
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