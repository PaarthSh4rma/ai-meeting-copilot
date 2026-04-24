"use client";

import { useEffect, useState } from "react";
import { deleteMeeting, getMeetings } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { BackButton } from "@/components/layout/back-button";

type Meeting = {
  id: string;
  title: string;
  filename: string;
  status: string;
  created_at: string;
};

export default function Dashboard() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

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
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
          <BackButton label="Back to homepage" />
        <h1 className="text-3xl font-bold mb-8">Your Meetings</h1>

        {loading && <p className="text-zinc-400">Loading...</p>}

        {!loading && meetings.length === 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center">
            <p className="text-zinc-400">No meetings uploaded yet.</p>
            <Link href="/">
              <Button className="mt-4 rounded-full bg-white text-black hover:bg-zinc-200">
                Upload your first meeting
              </Button>
            </Link>
          </div>
        )}

        <div className="grid gap-4">
          {meetings.map((meeting) => (
            <Card
              key={meeting.id}
              className="bg-zinc-900 border-zinc-800"
            >
              <CardContent className="p-6">
                <Link href={`/meetings/${meeting.id}`}>
                <h2 className="text-lg font-semibold">{meeting.title}</h2>
                </Link>
                <p className="text-sm text-zinc-400 mt-1">
                  {meeting.filename}
                </p>

                <p className="text-xs text-zinc-500 mt-2">
                  Status: {meeting.status}
                </p>

                <Button
                    variant="destructive"
                    size="sm"
                    className="mt-4"
                    onClick={() => handleDelete(meeting.id)}
                    >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                    </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}