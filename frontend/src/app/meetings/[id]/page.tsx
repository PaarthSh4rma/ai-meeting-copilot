"use client";

import { useEffect, useState } from "react";
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
  title: string;
  filename: string;
  status: string;
  created_at: string;
  audio_path: string;
  transcript?: string;
  summary?: string;
  decisions?: string[];
  action_items?: string[];
};

function getStatusClass(status: string) {
  if (status === "completed") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
  }

  if (status === "transcribed") {
    return "border-blue-500/20 bg-blue-500/10 text-blue-400";
  }

  if (status === "transcribing" || status === "summarizing") {
    return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
  }

  return "border-zinc-700 bg-zinc-800 text-zinc-300";
}

export default function MeetingDetail() {
  const params = useParams();
  const meetingId = params.id as string;

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [transcribing, setTranscribing] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    if (!meetingId) return;

    getMeeting(meetingId)
      .then((data) => setMeeting(data))
      .catch(() => setMeeting(null))
      .finally(() => setLoading(false));
  }, [meetingId]);

  async function handleTranscribe() {
    if (!meetingId) return;

    try {
      setTranscribing(true);
      const updatedMeeting = await transcribeMeeting(meetingId);
      setMeeting(updatedMeeting);
    } catch {
      alert("Failed to transcribe meeting.");
    } finally {
      setTranscribing(false);
    }
  }

  async function handleSummarize() {
    if (!meetingId) return;

    try {
      setSummarizing(true);
      const updatedMeeting = await summarizeMeeting(meetingId);
      setMeeting(updatedMeeting);
    } catch {
      alert("Failed to summarize meeting.");
    } finally {
      setSummarizing(false);
    }
  }

  async function handleAsk() {
    if (!question.trim()) return;

    try {
      setAsking(true);
      const res = await askMeeting(meetingId, question.trim());
      setAnswer(res.answer);
    } catch {
      alert("Failed to get answer.");
    } finally {
      setAsking(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
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
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-zinc-400">Meeting not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#18181b_0%,#000_45%)] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <BackButton label="Back to dashboard" />

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 shadow-2xl shadow-black/30">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div className="min-w-0">
              <Badge variant="outline" className={getStatusClass(meeting.status)}>
                {meeting.status}
              </Badge>

              <h1 className="mt-5 max-w-4xl truncate text-4xl font-bold tracking-tight sm:text-5xl">
                {meeting.title || meeting.filename}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                <span className="flex items-center gap-2">
                  <FileAudio className="h-4 w-4" />
                  {meeting.filename}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleTranscribe}
                disabled={transcribing || meeting.status === "transcribed" || meeting.status === "completed"}
                className="rounded-full bg-white text-black hover:bg-zinc-200"
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
                className="rounded-full border-zinc-700 bg-transparent text-white hover:bg-zinc-900"
              >
                {summarizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate insights
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-zinc-800 bg-zinc-950/70">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-zinc-900 p-2">
                  <FileText className="h-5 w-5 text-zinc-300" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">Transcript</h2>
                  <p className="text-xs text-zinc-500">
                    Raw meeting text generated by Whisper
                  </p>
                </div>
              </div>

              {meeting.transcript ? (
                <div className="max-h-[460px] overflow-y-auto rounded-2xl border border-zinc-900 bg-black/60 p-4">
                  <p className="whitespace-pre-line text-sm leading-7 text-zinc-300">
                    {meeting.transcript}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-zinc-800 bg-black/40 p-8 text-center">
                  <p className="text-sm text-zinc-500">
                    Click Transcribe to generate a transcript.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-zinc-800 bg-zinc-950/70">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-zinc-900 p-2">
                    <Sparkles className="h-5 w-5 text-zinc-300" />
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
              <Card className="border-zinc-800 bg-zinc-950/70">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl bg-zinc-900 p-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h2 className="font-semibold text-white">Decisions</h2>
                  </div>

                  {meeting.decisions && meeting.decisions.length > 0 ? (
                    <ul className="space-y-3 text-sm text-zinc-300">
                      {meeting.decisions.map((decision, index) => (
                        <li key={index} className="rounded-xl bg-black/50 p-3">
                          {decision}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-zinc-500">No decisions yet.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-zinc-800 bg-zinc-950/70">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl bg-zinc-900 p-2">
                      <ListChecks className="h-5 w-5 text-blue-400" />
                    </div>
                    <h2 className="font-semibold text-white">Action Items</h2>
                  </div>

                  {meeting.action_items && meeting.action_items.length > 0 ? (
                    <ul className="space-y-3 text-sm text-zinc-300">
                      {meeting.action_items.map((item, index) => (
                        <li key={index} className="rounded-xl bg-black/50 p-3">
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

        <Card className="mt-6 border-zinc-800 bg-zinc-950/70">
          <CardContent className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-zinc-900 p-2">
                <MessageSquareText className="h-5 w-5 text-zinc-300" />
              </div>
              <div>
                <h2 className="font-semibold text-white">Ask this meeting</h2>
                <p className="text-xs text-zinc-500">
                  Query the transcript with local AI
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                className="h-12 border-zinc-800 bg-black text-white placeholder:text-zinc-600"
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
                className="h-12 rounded-full bg-white px-6 text-black hover:bg-zinc-200"
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
              <div className="mt-5 rounded-2xl border border-zinc-800 bg-black/60 p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-300">
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