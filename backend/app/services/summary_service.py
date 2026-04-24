import requests

OLLAMA_URL = "http://localhost:11434/api/generate"


def generate_summary(transcript: str):
    prompt = f"""
You are an AI meeting assistant.

Given the following transcript, generate:

1. A concise summary
2. Key decisions
3. Action items (as bullet points)

Transcript:
{transcript}
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": "llama3.2",
            "prompt": prompt,
            "stream": False,
        },
    )

    data = response.json()

    return data.get("response", "")