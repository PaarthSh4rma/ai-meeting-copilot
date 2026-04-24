from fastapi import APIRouter, UploadFile, File
from datetime import datetime
import json
import os
import uuid

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