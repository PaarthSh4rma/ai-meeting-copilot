"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMeeting, transcribeMeeting, summarizeMeeting, askMeeting } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/layout/back-button";

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

const [question, setQuestion] = useState("");
const [answer, setAnswer] = useState("");
const [asking, setAsking] = useState(false);

async function handleAsk() {
  if (!question) return;

  try {
    setAsking(true);
    const res = await askMeeting(meetingId, question);
    setAnswer(res.answer);
  } catch {
    alert("Failed to get answer.");
  } finally {
    setAsking(false);
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
        <BackButton label="Back to dashboard" />

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
    <h2 className="font-semibold text-white">Decisions</h2>

    {meeting.decisions && meeting.decisions.length > 0 ? (
      <ul className="mt-3 space-y-2 text-sm text-zinc-400">
        {meeting.decisions.map((decision, index) => (
          <li key={index}>• {decision}</li>
        ))}
      </ul>
    ) : (
      <p className="mt-2 text-sm text-zinc-400">
        No decisions extracted yet.
      </p>
    )}
  </CardContent>
</Card>
<Card className="border-zinc-800 bg-zinc-950">
  <CardContent className="p-6">
    <h2 className="font-semibold text-white">Action Items</h2>

    {meeting.action_items && meeting.action_items.length > 0 ? (
      <ul className="mt-3 space-y-2 text-sm text-zinc-400">
        {meeting.action_items.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    ) : (
      <p className="mt-2 text-sm text-zinc-400">
        No action items extracted yet.
      </p>
    )}
  </CardContent>
</Card>

<Card className="border-zinc-800 bg-zinc-950 md:col-span-3">
  <CardContent className="p-6 space-y-4">
    <h2 className="font-semibold text-white">Ask this meeting</h2>

    <input
      className="w-full rounded-md bg-zinc-900 p-2 text-sm text-white"
      placeholder="Ask a question..."
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
    />

    <Button onClick={handleAsk} disabled={asking}>
      {asking ? "Thinking..." : "Ask"}
    </Button>

    {answer && (
      <p className="text-sm text-zinc-400 whitespace-pre-line">
        {answer}
      </p>
    )}
  </CardContent>
</Card>
        </div>
      </div>
    </main>
  );
}