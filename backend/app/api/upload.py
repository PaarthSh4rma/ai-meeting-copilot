from fastapi import APIRouter, UploadFile, File
from datetime import datetime
import json
import os
import uuid
from fastapi import HTTPException
from app.services.transcription_service import transcribe_audio
from app.services.summary_service import generate_summary

router = APIRouter()

UPLOAD_DIR = "uploads"
DATA_DIR = "data"
MEETINGS_FILE = f"{DATA_DIR}/meetings.json"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

if not os.path.exists(MEETINGS_FILE):
    with open(MEETINGS_FILE, "w") as f:
        json.dump([], f)


def load_meetings():
    with open(MEETINGS_FILE, "r") as f:
        return json.load(f)


def save_meetings(meetings):
    with open(MEETINGS_FILE, "w") as f:
        json.dump(meetings, f, indent=2)


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    meeting_id = str(uuid.uuid4())
    file_ext = file.filename.split(".")[-1]
    file_path = f"{UPLOAD_DIR}/{meeting_id}.{file_ext}"

    content = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(content)

    meeting = {
        "id": meeting_id,
        "title": file.filename.rsplit(".", 1)[0],
        "filename": file.filename,
        "audio_path": file_path,
        "status": "uploaded",
        "created_at": datetime.utcnow().isoformat(),
    }

    meetings = load_meetings()
    meetings.append(meeting)
    save_meetings(meetings)

    return meeting


@router.get("/meetings")
def get_meetings():
    return load_meetings()

@router.delete("/meetings/{meeting_id}")
def delete_meeting(meeting_id: str):
    meetings = load_meetings()

    meeting_to_delete = next(
        (meeting for meeting in meetings if meeting["id"] == meeting_id),
        None,
    )

    if not meeting_to_delete:
        return {"message": "meeting not found"}

    audio_path = meeting_to_delete.get("audio_path")

    if audio_path and os.path.exists(audio_path):
        os.remove(audio_path)

    updated_meetings = [
        meeting for meeting in meetings if meeting["id"] != meeting_id
    ]

    save_meetings(updated_meetings)

    return {
        "message": "meeting deleted successfully",
        "meeting_id": meeting_id,
    }

@router.get("/meetings/{meeting_id}")
def get_meeting(meeting_id: str):
    meetings = load_meetings()

    meeting = next(
        (meeting for meeting in meetings if meeting["id"] == meeting_id),
        None,
    )

    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    return meeting

@router.post("/meetings/{meeting_id}/transcribe")
def transcribe_meeting(meeting_id: str):
    meetings = load_meetings()

    meeting = next(
        (meeting for meeting in meetings if meeting["id"] == meeting_id),
        None,
    )

    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    audio_path = meeting.get("audio_path")

    if not audio_path or not os.path.exists(audio_path):
        raise HTTPException(status_code=404, detail="Audio file not found")

    meeting["status"] = "transcribing"
    save_meetings(meetings)

    transcript = transcribe_audio(audio_path)

    meeting["transcript"] = transcript
    meeting["status"] = "transcribed"
    save_meetings(meetings)

    return meeting

@router.post("/meetings/{meeting_id}/summarize")
def summarize_meeting(meeting_id: str):
    meetings = load_meetings()

    meeting = next(
        (meeting for meeting in meetings if meeting["id"] == meeting_id),
        None,
    )

    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    transcript = meeting.get("transcript")

    if not transcript:
        raise HTTPException(status_code=400, detail="No transcript available")

    meeting["status"] = "summarizing"
    save_meetings(meetings)

    summary = generate_summary(transcript)

    meeting["summary"] = summary
    meeting["status"] = "completed"
    save_meetings(meetings)

    return meeting