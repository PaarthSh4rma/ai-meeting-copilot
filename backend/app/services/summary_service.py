import json
import requests

OLLAMA_URL = "http://localhost:11434/api/generate"


def generate_meeting_insights(transcript: str):
    prompt = f"""
You are an AI meeting assistant.

Return ONLY valid JSON. Do not include markdown.

The JSON must have this shape:
{{
  "summary": "A concise 3-5 sentence meeting summary.",
  "decisions": ["Decision 1", "Decision 2"],
  "action_items": ["Action item 1", "Action item 2"]
}}

If there are no decisions or action items, return an empty array.

Transcript:
{transcript}
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": "llama3.2",
            "prompt": prompt,
            "stream": False,
            "format": "json",
        },
        timeout=120,
    )

    response.raise_for_status()
    raw_response = response.json().get("response", "{}")

    try:
        return json.loads(raw_response)
    except json.JSONDecodeError:
        return {
            "summary": raw_response,
            "decisions": [],
            "action_items": [],
        }