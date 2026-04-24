"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMeeting } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Meeting = {
  id: string;
  title: string;
  filename: string;
  status: string;
  created_at: string;
  audio_path: string;
};

export default function MeetingDetail() {
  const params = useParams();
  const meetingId = params.id as string;

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!meetingId) return;

    getMeeting(meetingId)
      .then((data) => setMeeting(data))
      .catch(() => setMeeting(null))
      .finally(() => setLoading(false));
  }, [meetingId]);

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
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="p-6">
              <h2 className="font-semibold text-white">Transcript</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Coming next: Whisper transcription.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="p-6">
              <h2 className="font-semibold text-white">Summary</h2>
              <p className="mt-2 text-sm text-zinc-400">
                AI summary will appear here.
              </p>
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
        </div>
      </div>
    </main>
  );
}