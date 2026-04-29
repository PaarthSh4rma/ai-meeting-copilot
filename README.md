# AI Meeting Copilot

> Turn messy meeting audio into clear decisions and actionable insights.

AI Meeting Copilot is a full-stack AI application that transforms meeting audio into structured outputs — including transcripts, summaries, decisions, and action items — with the ability to query meetings using natural language.

---

## Features

- Upload meeting audio files
- Automatic transcription (Whisper)
- AI-generated:
  - Summary
  - Key decisions
  - Action items
- Ask questions about your meeting
- Fast, clean UI with real-time feedback

---

## 🧠 How It Works

1. Upload an audio file
2. Backend transcribes audio using Whisper
3. Transcript is sent to Gemini
4. Gemini generates:
   - Summary
   - Decisions
   - Action items
5. Users can query the transcript via AI

---

## Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui

### Backend

* FastAPI
* Python

### AI / ML

* Whisper (`faster-whisper`) → transcription
* Google Gemini API (LLM)

### Deployment
- Vercel (frontend)
- Render (backend)

---

## Project Structure

frontend/ → Next.js app
backend/ → FastAPI server
uploads/ → audio files (local dev)
data/ → meeting metadata (JSON)

---

## Getting Started

### 1. Clone repo

```bash
git clone https://github.com/yourusername/ai-meeting-copilot.git
cd ai-meeting-copilot
```

---

### 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt
```

Create .env:

```bash
GEMINI_API_KEY=your_key_here
```

Run server:

```bash
uvicorn app.main:app --reload
```
---

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```
---

### 4. Open app

```text
http://localhost:3000
```

---

## Why I Built This

Meetings are messy. Important decisions get buried in long conversations.

This project explores how **local AI models** can:

* structure unstructured data (audio → insights)
* improve productivity
* make information retrieval instant

---

## Possible Future Improvements

* Persistent storage (Supabase / S3)
* Real-time transcription
* Speaker identification
* Highlight answers inside transcript
* Export summaries (PDF / Notion)

---

## Key Learnings

* Building end-to-end AI pipelines
* Integrating LLMs into real applications
* Designing APIs for AI workflows
* Handling async processing + UI states

