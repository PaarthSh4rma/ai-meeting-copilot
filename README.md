# AI Meeting Copilot

> Turn messy meeting audio into structured insights using local AI.

---

## Features

* **Audio → Transcript**
  Uses Whisper (`faster-whisper`) to convert meeting audio into clean text

* **AI Summaries (Local LLM)**
  Generates concise summaries, key decisions, and action items using a local LLM via Ollama

* **Structured Outputs**
  Extracts:

  * Summary
  * Decisions
  * Action Items

* **Ask Your Meeting**
  Ask natural language questions about the meeting transcript

* **Meeting Dashboard**
  View, manage, and revisit past meetings

* **Custom Meeting Titles**
  Assign meaningful names to uploaded meetings

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
* Ollama → local LLM inference (Llama 3)

---

## Architecture

```text
Audio Upload
   ↓
FastAPI Backend
   ↓
File Storage (local)
   ↓
Whisper Transcription
   ↓
LLM (Ollama)
   ↓
Structured Insights (JSON)
   ↓
Frontend UI (Next.js)
```

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

Run backend:

```bash
uvicorn app.main:app --reload
```

---

### 3. Install Ollama (for LLM)

Install Ollama, then:

```bash
ollama pull llama3.2
```

Ollama runs automatically on:

```text
http://localhost:11434
```

---

### 4. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

---

### 5. Open app

```text
http://localhost:3000
```

---

## Example Use Case

Upload a meeting audio like:

> “We decided to prioritize performance improvements.
> Alex will optimize database queries by Thursday.
> Priya will redesign the UI.”

Output:

* **Summary:** short overview
* **Decisions:** prioritize performance
* **Action Items:**

  * Alex → optimize DB
  * Priya → redesign UI

---

## Why I Built This

Meetings generate a lot of unstructured information that is often lost.

This project explores how **local AI models** can:

* convert speech → structured data
* extract actionable insights
* enable natural language interaction

without relying on external APIs.

---

## Future Improvements

* Auto pipeline (upload → auto process)
* Chat history (multi-turn conversation)
* Embeddings + RAG for scalable querying
* Cloud deployment (Vercel + Render)
* User authentication

---

## Key Learnings

* Building end-to-end AI pipelines (not just models)
* Integrating LLMs into real applications
* Designing APIs for AI workflows
* Handling async processing + UI states

---

## 📄 License

MIT

