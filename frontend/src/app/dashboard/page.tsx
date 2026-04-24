"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AudioWaveform,
  Calendar,
  CheckCircle2,
  FileAudio,
  Loader2,
  MessageSquareText,
  Plus,
  Trash2,
  WandSparkles,
} from "lucide-react";

import { BackButton } from "@/components/layout/back-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteMeeting, getMeetings } from "@/lib/api";

type Meeting = {
  id: string;
  title: string;
  filename: string;
  status: string;
  created_at: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getStatusClass(status: string) {
  if (status === "completed") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
  }

  if (status === "transcribed") {
    return "border-cyan-400/20 bg-cyan-400/10 text-cyan-200";
  }

  if (status === "transcribing" || status === "summarizing") {
    return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
  }

  return "border-zinc-700 bg-zinc-900 text-zinc-300";
}

export default function Dashboard() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  const completedCount = useMemo(
    () => meetings.filter((meeting) => meeting.status === "completed").length,
    [meetings]
  );

  const aiReadyCount = useMemo(
    () => meetings.filter((meeting) => meeting.status !== "uploaded").length,
    [meetings]
  );

  async function handleDelete(meetingId: string) {
    try {
      await deleteMeeting(meetingId);
      setMeetings((current) =>
        current.filter((meeting) => meeting.id !== meetingId)
      );
    } catch {
      alert("Failed to delete meeting.");
    }
  }

  useEffect(() => {
    getMeetings()
      .then((data) => setMeetings(Array.isArray(data) ? data : []))
      .catch(() => setMeetings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-6 py-10 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.24),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(168,85,247,0.14),transparent_36%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      <div className="relative mx-auto max-w-7xl">
        <BackButton label="Back to homepage" />

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/70 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="relative p-8 sm:p-10">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <Badge
                  variant="outline"
                  className="border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-cyan-200"
                >
                  <WandSparkles className="mr-2 h-3.5 w-3.5" />
                  Workspace
                </Badge>

                <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">
                  Your meeting{" "}
                  <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-300 bg-clip-text text-transparent">
                    command center.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
                  Review uploaded meetings, open transcripts, generate
                  structured insights, and query conversations with AI.
                </p>
              </div>

              <Link href="/">
                <Button className="h-12 rounded-2xl bg-white px-6 text-black hover:bg-zinc-200">
                  <Plus className="mr-2 h-4 w-4" />
                  New meeting
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Total meetings",
              value: meetings.length,
              icon: FileAudio,
              glow: "text-zinc-300",
            },
            {
              label: "Completed",
              value: completedCount,
              icon: CheckCircle2,
              glow: "text-emerald-400",
            },
            {
              label: "AI ready",
              value: aiReadyCount,
              icon: MessageSquareText,
              glow: "text-cyan-300",
            },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="group border-white/10 bg-zinc-950/60 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-400/30"
            >
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-zinc-500">{stat.label}</p>
                  <p className="mt-2 text-4xl font-semibold text-white">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 transition group-hover:bg-cyan-400/10">
                  <stat.icon className={`h-6 w-6 ${stat.glow}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mt-6">
          {loading && (
            <Card className="border-white/10 bg-zinc-950/70 backdrop-blur">
              <CardContent className="flex items-center gap-3 p-6 text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading meetings...
              </CardContent>
            </Card>
          )}

          {!loading && meetings.length === 0 && (
            <Card className="border-dashed border-white/10 bg-zinc-950/60 backdrop-blur">
              <CardContent className="flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="relative">
                  <div className="absolute -inset-5 rounded-full bg-cyan-400/20 blur-2xl" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-black">
                    <AudioWaveform className="h-8 w-8" />
                  </div>
                </div>

                <h2 className="mt-7 text-2xl font-semibold">
                  No meetings yet
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
                  Upload your first audio file to generate a transcript,
                  summary, decisions, action items, and meeting Q&A.
                </p>

                <Link href="/">
                  <Button className="mt-7 h-12 rounded-2xl bg-white px-6 text-black hover:bg-zinc-200">
                    <Plus className="mr-2 h-4 w-4" />
                    Upload meeting
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {!loading && meetings.length > 0 && (
            <div className="grid gap-4">
              {meetings.map((meeting) => (
                <Card
                  key={meeting.id}
                  className="group overflow-hidden border-white/10 bg-zinc-950/60 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-zinc-950/80"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
                      <Link
                        href={`/meetings/${meeting.id}`}
                        className="min-w-0 flex-1"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-zinc-300 transition group-hover:bg-cyan-400/10 group-hover:text-cyan-200">
                            <FileAudio className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <h2 className="truncate text-xl font-semibold text-white group-hover:bg-gradient-to-r group-hover:from-cyan-200 group-hover:to-violet-300 group-hover:bg-clip-text group-hover:text-transparent">
                              {meeting.title || meeting.filename}
                            </h2>
                            <p className="mt-1 truncate text-sm text-zinc-500">
                              {meeting.filename}
                            </p>
                          </div>
                        </div>
                      </Link>

                      <div className="flex flex-wrap items-center gap-3 md:justify-end">
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                          <Calendar className="h-4 w-4" />
                          {formatDate(meeting.created_at)}
                        </div>

                        <Badge
                          variant="outline"
                          className={getStatusClass(meeting.status)}
                        >
                          {meeting.status}
                        </Badge>

                        <Link href={`/meetings/${meeting.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-white/10 bg-transparent text-zinc-200 hover:bg-white/5"
                          >
                            Open
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                          onClick={() => handleDelete(meeting.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}