"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getHealth, uploadMeetingAudio } from "@/lib/api";
import { CheckCircle2, FileText, Mic, Sparkles, Upload } from "lucide-react";

import Link from "next/link";

const features = [
  {
    icon: Mic,
    title: "Transcribe meetings",
    description: "Upload audio and convert conversations into clean transcripts.",
  },
  {
    icon: Sparkles,
    title: "Generate summaries",
    description: "Turn long meetings into concise summaries and key decisions.",
  },
  {
    icon: CheckCircle2,
    title: "Extract action items",
    description: "Identify tasks, owners, deadlines, and follow-ups automatically.",
  },
  {
    icon: FileText,
    title: "Chat with history",
    description: "Ask questions across meeting transcripts using AI retrieval.",
  },
];

export default function Home() {
  const [backendStatus, setBackendStatus] = useState("Checking backend...");

  useEffect(() => {
    getHealth()
      .then((data) => setBackendStatus(data.status))
      .catch(() => setBackendStatus("Backend not reachable"));
  }, []);

  const [uploadStatus, setUploadStatus] = useState("");

async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];

  if (!file) return;

  try {
    setUploadStatus(`Uploading ${file.name}...`);
    const result = await uploadMeetingAudio(file);
    setUploadStatus(`Uploaded: ${result.filename}`);
  } catch {
    setUploadStatus("Upload failed. Is the backend running?");
  }
}

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-28 text-center">
        <Badge variant="outline" className="mb-6 border-zinc-700 text-zinc-300">
          AI-powered meeting intelligence
        </Badge>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
          Turn messy meetings into clear decisions.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-400">
          Upload meeting audio, generate transcripts, summarize decisions,
          extract action items, and chat with your meeting history.
        </p>
<div>
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
                Upload Meeting
              </span>
            </Button>
          </label>
<Link href="/dashboard">
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-zinc-700 bg-transparent text-white hover:bg-zinc-900">
            View Dashboard
          </Button></Link>
        </div>

        <p className="mt-4 text-sm text-zinc-500">
          Backend status:{" "}
          <span
            className={
              backendStatus === "ok" ? "text-green-400" : "text-zinc-500"
            }
          >
            {backendStatus}
          </span>
        </p>
        {uploadStatus && (
  <p className="mt-2 text-sm text-zinc-400">{uploadStatus}</p>
)}

        <div className="mt-16 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-zinc-800 bg-zinc-950/60 text-left backdrop-blur"
            >
              <CardContent className="p-6">
                <feature.icon className="mb-4 h-6 w-6 text-zinc-300" />
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