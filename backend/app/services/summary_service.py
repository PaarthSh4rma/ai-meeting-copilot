import json
import os

import requests
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-2.5-flash-lite"

GEMINI_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/"
    f"{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
)


def generate_meeting_insights(transcript: str):
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not set")

    prompt = f"""
You are an AI meeting assistant.

Extract structured meeting insights from this transcript.

Return JSON with:
- summary: concise 3-5 sentence summary
- decisions: array of key decisions
- action_items: array of action items

Transcript:
{transcript}
"""

    response = requests.post(
        GEMINI_URL,
        json={
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "response_mime_type": "application/json",
            },
        },
        timeout=120,
    )

    response.raise_for_status()

    data = response.json()
    text = data["candidates"][0]["content"]["parts"][0]["text"]

    parsed = json.loads(text)

    return {
        "summary": parsed.get("summary", ""),
        "decisions": parsed.get("decisions", []),
        "action_items": parsed.get("action_items", []),
    }


def answer_meeting_question(transcript: str, question: str):
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not set")

    prompt = f"""
You are an AI assistant answering questions about a meeting.

Use only the transcript below. If the answer is not in the transcript, say so.

Transcript:
{transcript}

Question:
{question}

Answer clearly and concisely.
"""

    response = requests.post(
        GEMINI_URL,
        json={
            "contents": [{"parts": [{"text": prompt}]}],
        },
        timeout=120,
    )

    response.raise_for_status()

    data = response.json()
    return data["candidates"][0]["content"]["parts"][0]["text"]