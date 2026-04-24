"use client";

import { useEffect, useState } from "react";
import { getMeetings } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

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

  useEffect(() => {
    getMeetings()
      .then((data) => setMeetings(data))
      .catch(() => setMeetings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Meetings</h1>

        {loading && <p className="text-zinc-400">Loading...</p>}

        {!loading && meetings.length === 0 && (
          <p className="text-zinc-500">No meetings uploaded yet.</p>
        )}

        <div className="grid gap-4">
          {meetings.map((meeting) => (
            <Card
              key={meeting.id}
              className="bg-zinc-900 border-zinc-800"
            >
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold">{meeting.title}</h2>

                <p className="text-sm text-zinc-400 mt-1">
                  {meeting.filename}
                </p>

                <p className="text-xs text-zinc-500 mt-2">
                  Status: {meeting.status}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}