"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileAudio,
  Loader2,
  MessageSquareText,
  Plus,
  Trash2,
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
  if (status === "completed") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (status === "transcribed") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  if (status === "transcribing" || status === "summarizing") return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  return "bg-zinc-800 text-zinc-300 border-zinc-700";
}

export default function Dashboard() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  const completedCount = useMemo(
    () => meetings.filter((meeting) => meeting.status === "completed").length,
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
      .then((data) => setMeetings(data))
      .catch(() => setMeetings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#18181b_0%,#000_45%)] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <BackButton label="Back to homepage" />

        <div className="flex flex-col justify-between gap-6 border-b border-zinc-900 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
              Workspace
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Your Meetings
            </h1>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Review uploaded meetings, open transcripts, generate summaries,
              and query conversations with AI.
            </p>
          </div>

          <Link href="/">
            <Button className="rounded-full bg-white text-black hover:bg-zinc-200">
              <Plus className="mr-2 h-4 w-4" />
              New meeting
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className="border-zinc-800 bg-zinc-950/70">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-zinc-500">Total meetings</p>
                <p className="mt-1 text-3xl font-semibold text-white">{meetings.length}</p>
              </div>
              <FileAudio className="h-7 w-7 text-zinc-500" />
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/70">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-zinc-500">Completed</p>
                <p className="mt-1 text-3xl font-semibold text-white">{completedCount}</p>
              </div>
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/70">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-zinc-500 ">AI ready</p>
                <p className="mt-1 text-3xl font-semibold text-white">
                  {meetings.filter((m) => m.status !== "uploaded").length}
                </p>
              </div>
              <MessageSquareText className="h-7 w-7 text-zinc-500" />
            </CardContent>
          </Card>
        </div>

        <section className="mt-8">
          {loading && (
            <Card className="border-zinc-800 bg-zinc-950/70">
              <CardContent className="flex items-center gap-3 p-6 text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading meetings...
              </CardContent>
            </Card>
          )}

          {!loading && meetings.length === 0 && (
            <Card className="border-dashed border-zinc-800 bg-zinc-950/50">
              <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900">
                  <FileAudio className="h-7 w-7 text-zinc-400" />
                </div>
                <h2 className="mt-5 text-xl font-semibold">
                  No meetings uploaded yet
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                  Upload your first audio file to generate a transcript,
                  summary, action items, and meeting Q&A.
                </p>
                <Link href="/">
                  <Button className="mt-6 rounded-full bg-white text-black hover:bg-zinc-200">
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
                  className="group border-zinc-800 bg-zinc-950/70 transition hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-950"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
                      <Link
                        href={`/meetings/${meeting.id}`}
                        className="min-w-0 flex-1"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-300">
                            <FileAudio className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <h2 className="truncate text-xl font-semibold text-white group-hover:underline">
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
                            className="rounded-full border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-900"
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