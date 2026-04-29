"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Bot,
  CheckCircle2,
  FileAudio,
  FileText,
  ListChecks,
  Loader2,
  MessageSquareText,
  Send,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { BackButton } from "@/components/layout/back-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  askMeeting,
  getMeeting,
  summarizeMeeting,
  transcribeMeeting,
} from "@/lib/api";

type Meeting = {
  id: string;
  title?: string;
  filename?: string;
  status?: string;
  created_at?: string;
  audio_path?: string;
  transcript?: string;
  summary?: string;
  decisions?: string[];
  action_items?: string[];
};

function getStatusClass(status?: string) {
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

export default function MeetingDetail() {
  const params = useParams();
  const meetingId = params.id as string;

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [transcribing, setTranscribing] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);
function formatActionItem(item: unknown) {
  if (typeof item === "string") return item;

  if (item && typeof item === "object") {
    const action = item as {
      assignee?: string;
      owner?: string;
      task?: string;
      due_date?: string;
      dueDate?: string;
    };

    const assignee = action.assignee || action.owner;
    const dueDate = action.due_date || action.dueDate;

    return [
      assignee ? `${assignee}:` : null,
      action.task || JSON.stringify(item),
      dueDate ? `(Due: ${dueDate})` : null,
    ]
      .filter(Boolean)
      .join(" ");
  }

  return String(item);
}
  async function refreshMeeting() {
    if (!meetingId) return;

    try {
      const data = await getMeeting(meetingId);

      if (!data || !data.id) {
        setMeeting(null);
        setError("Meeting could not be loaded.");
        return;
      }

      setMeeting(data);
      setError("");
    } catch {
      setMeeting(null);
      setError(
        "Meeting could not be loaded. It may have been deleted or the backend restarted."
      );
    }
  }

  useEffect(() => {
    if (!meetingId) return;

    setLoading(true);
    refreshMeeting().finally(() => setLoading(false));
  }, [meetingId]);

  async function handleTranscribe() {
    if (!meetingId) return;

    try {
      setTranscribing(true);
      setError("");

      const updatedMeeting = await transcribeMeeting(meetingId);

      if (!updatedMeeting || !updatedMeeting.id) {
        await refreshMeeting();
        return;
      }

      setMeeting(updatedMeeting);
    } catch {
      setError("Failed to transcribe meeting.");
      await refreshMeeting();
    } finally {
      setTranscribing(false);
    }
  }

  async function handleSummarize() {
    if (!meetingId) return;

    try {
      setSummarizing(true);
      setError("");

      const updatedMeeting = await summarizeMeeting(meetingId);

      if (!updatedMeeting || !updatedMeeting.id) {
        await refreshMeeting();
        return;
      }

      setMeeting(updatedMeeting);
    } catch {
      setError(
        "Failed to generate insights. The backend may still be processing, or the AI provider may have failed."
      );
      await refreshMeeting();
    } finally {
      setSummarizing(false);
    }
  }

  async function handleAsk() {
    if (!question.trim() || !meetingId) return;

    try {
      setAsking(true);
      setError("");

      const res = await askMeeting(meetingId, question.trim());
      setAnswer(res.answer || "No answer returned.");
    } catch {
      setError("Failed to get an answer for this meeting.");
    } finally {
      setAsking(false);
    }
  }

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black px-6 py-16 text-white">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.24),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(168,85,247,0.14),transparent_36%)]" />

        <div className="relative mx-auto max-w-7xl">
          <p className="flex items-center gap-2 text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading meeting...
          </p>
        </div>
      </main>
    );
  }

  if (!meeting) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black px-6 py-16 text-white">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.24),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(168,85,247,0.14),transparent_36%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton label="Back to dashboard" />

          <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 backdrop-blur">
            <h1 className="text-2xl font-semibold">Meeting unavailable</h1>

            <p className="mt-3 text-zinc-400">
              {error || "This meeting could not be found."}
            </p>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={refreshMeeting}
                className="rounded-2xl bg-white text-black hover:bg-zinc-200"
              >
                Retry
              </Button>

              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/10 bg-transparent text-white hover:bg-white/5"
                >
                  Return to dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const title = meeting.title || meeting.filename || "Untitled meeting";
  const status = meeting.status || "unknown";
  const decisions = Array.isArray(meeting.decisions) ? meeting.decisions : [];
  const actionItems = Array.isArray(meeting.action_items)
    ? meeting.action_items
    : [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-6 py-10 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.24),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(168,85,247,0.14),transparent_36%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      <div className="relative mx-auto max-w-7xl">
        <BackButton label="Back to dashboard" />

        {error && (
          <div className="mb-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/70 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="relative p-8 sm:p-10">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
              <div className="min-w-0">
                <Badge variant="outline" className={getStatusClass(status)}>
                  {status}
                </Badge>

                <h1 className="mt-6 max-w-5xl truncate text-5xl font-bold tracking-tight sm:text-6xl">
                  <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-300 bg-clip-text text-transparent">
                    {title}
                  </span>
                </h1>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                  <span className="flex items-center gap-2">
                    <FileAudio className="h-4 w-4" />
                    {meeting.filename || "No filename available"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleTranscribe}
                  disabled={transcribing || Boolean(meeting.transcript)}
                  className="h-12 rounded-2xl bg-white px-6 text-black hover:bg-zinc-200"
                >
                  {transcribing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Transcribing...
                    </>
                  ) : meeting.transcript ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Transcribed
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Transcribe
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleSummarize}
                  disabled={summarizing || !meeting.transcript}
                  variant="outline"
                  className="h-12 rounded-2xl border-white/10 bg-transparent px-6 text-white hover:bg-white/5"
                >
                  {summarizing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <WandSparkles className="mr-2 h-4 w-4" />
                      Generate insights
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-white/10 bg-zinc-950/60 backdrop-blur">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-cyan-200">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">Transcript</h2>
                  <p className="text-xs text-zinc-500">
                    Raw meeting text generated by Whisper
                  </p>
                </div>
              </div>

              {meeting.transcript ? (
                <div className="max-h-[520px] overflow-y-auto rounded-3xl border border-white/10 bg-black/60 p-5">
                  <p className="whitespace-pre-line text-sm leading-7 text-zinc-300">
                    {meeting.transcript}
                  </p>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-black/40 p-10 text-center">
                  <p className="text-sm text-zinc-500">
                    Click Transcribe to generate a transcript.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-white/10 bg-zinc-950/60 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-200">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">Summary</h2>
                    <p className="text-xs text-zinc-500">
                      AI-generated meeting brief
                    </p>
                  </div>
                </div>

                {meeting.summary ? (
                  <p className="whitespace-pre-line text-sm leading-7 text-zinc-300">
                    {meeting.summary}
                  </p>
                ) : (
                  <p className="text-sm text-zinc-500">
                    Generate insights to create a summary.
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Card className="border-white/10 bg-zinc-950/60 backdrop-blur">
                <CardContent className="p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <h2 className="font-semibold text-white">Decisions</h2>
                  </div>

                  {decisions.length > 0 ? (
                    <ul className="space-y-3 text-sm text-zinc-300">
                      {decisions.map((decision, index) => (
                        <li
                          key={index}
                          className="rounded-2xl border border-white/10 bg-black/50 p-4"
                        >
                          {decision}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-zinc-500">No decisions yet.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-zinc-950/60 backdrop-blur">
                <CardContent className="p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                      <ListChecks className="h-5 w-5" />
                    </div>
                    <h2 className="font-semibold text-white">Action Items</h2>
                  </div>

                  {actionItems.length > 0 ? (
                    <ul className="space-y-3 text-sm text-zinc-300">
                      {actionItems.map((item, index) => (
                        <li
                          key={index}
                          className="rounded-2xl border border-white/10 bg-black/50 p-4"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-zinc-500">No action items yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Card className="mt-6 border-white/10 bg-zinc-950/60 backdrop-blur">
          <CardContent className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-cyan-200">
                <MessageSquareText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-white">Ask this meeting</h2>
                <p className="text-xs text-zinc-500">
                  Query the transcript with AI
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                className="h-12 border-white/10 bg-black/70 text-white placeholder:text-zinc-600"
                placeholder="Ask: who owns the next steps?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAsk();
                }}
              />

              <Button
                onClick={handleAsk}
                disabled={asking || !meeting.transcript}
                className="h-12 rounded-2xl bg-white px-6 text-black hover:bg-zinc-200"
              >
                {asking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Ask
                  </>
                )}
              </Button>
            </div>

            {answer && (
              <div className="mt-5 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-cyan-200">
                  <Bot className="h-4 w-4" />
                  Copilot answer
                </div>
                <p className="whitespace-pre-line text-sm leading-7 text-zinc-300">
                  {answer}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}