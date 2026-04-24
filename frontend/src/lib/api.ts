const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function getHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);

  if (!res.ok) {
    throw new Error("API health check failed");
  }

  return res.json();
}

export async function uploadMeetingAudio(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Audio upload failed");
  }

  return res.json();
}

export async function getMeetings() {
  const res = await fetch(`${API_BASE_URL}/api/meetings`);

  if (!res.ok) {
    throw new Error("Failed to fetch meetings");
  }

  return res.json();
}

export async function deleteMeeting(meetingId: string) {
  const res = await fetch(`${API_BASE_URL}/api/meetings/${meetingId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete meeting");
  }

  return res.json();
}

export async function getMeeting(meetingId: string) {
  const res = await fetch(`${API_BASE_URL}/api/meetings/${meetingId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch meeting");
  }

  return res.json();
}

export async function transcribeMeeting(meetingId: string) {
  const res = await fetch(`${API_BASE_URL}/api/meetings/${meetingId}/transcribe`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to transcribe meeting");
  }

  return res.json();
}

export async function summarizeMeeting(meetingId: string) {
  const res = await fetch(`${API_BASE_URL}/api/meetings/${meetingId}/summarize`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to summarize meeting");
  }

  return res.json();
}