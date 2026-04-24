"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMeeting, transcribeMeeting, summarizeMeeting } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Meeting = {
  id: string;
  title: string;
  filename: string;
  status: string;
  created_at: string;
  audio_path: string;
  transcript?: string;
  summary?: string;
};

export default function MeetingDetail() {
  const params = useParams();
  const meetingId = params.id as string;

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [transcribing, setTranscribing] = useState(false);
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    if (!meetingId) return;

    getMeeting(meetingId)
      .then((data) => setMeeting(data))
      .catch(() => setMeeting(null))
      .finally(() => setLoading(false));
  }, [meetingId]);

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

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <p className="text-zinc-400">Loading meeting...</p>
      </main>
    );
  }

  if (!meeting) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <p className="text-zinc-400">Meeting not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <Badge variant="outline" className="border-zinc-700 text-zinc-300">
            {meeting.status}
          </Badge>

          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            {meeting.title}
          </h1>

          <p className="mt-2 text-sm text-zinc-500">{meeting.filename}</p>

          <div className="mt-6">
            <Button
              onClick={handleTranscribe}
              disabled={transcribing || meeting.status === "transcribed"}
            >
              {transcribing
                ? "Transcribing..."
                : meeting.status === "transcribed"
                  ? "Transcribed"
                  : "Transcribe Meeting"}
            </Button>
            
          </div>
          <div className="mt-4">
            <Button
                onClick={handleSummarize}
                disabled={summarizing || !meeting.transcript}
            >
                {summarizing ? "Generating summary..." : "Generate Summary"}
            </Button>
            </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-zinc-800 bg-zinc-950 md:col-span-3">
            <CardContent className="p-6">
              <h2 className="font-semibold text-white">Transcript</h2>

              {meeting.transcript ? (
                <p className="mt-3 max-h-72 overflow-y-auto text-sm leading-6 text-zinc-400">
                  {meeting.transcript}
                </p>
              ) : (
                <p className="mt-2 text-sm text-zinc-400">
                  Click “Transcribe Meeting” to generate a transcript.
                </p>
              )}
            </CardContent>
          </Card>

            <Card className="border-zinc-800 bg-zinc-950 md:col-span-3">
            <CardContent className="p-6">
                <h2 className="font-semibold text-white">Summary</h2>

                {meeting.summary ? (
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-400">
                    {meeting.summary}
                </p>
                ) : (
                <p className="mt-2 text-sm text-zinc-400">
                    Click “Generate Summary” to create AI insights.
                </p>
                )}
            </CardContent>
            </Card>
          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="p-6">
              <h2 className="font-semibold text-white">Action Items</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Extracted tasks will appear here.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="p-6">
              <h2 className="font-semibold text-white">Chat</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Meeting Q&A will appear here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}