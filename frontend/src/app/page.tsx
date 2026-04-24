import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, FileText, Sparkles, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Transcribe meetings",
    description: "Upload audio and convert conversations into clean transcripts.",
  },
  {
    icon: Sparkles,
    title: "Generate summaries",
    description: "Turn long meetings into concise summaries and key decisions.",
  },
  {
    icon: CheckCircle2,
    title: "Extract action items",
    description: "Identify tasks, owners, deadlines, and follow-ups automatically.",
  },
  {
    icon: FileText,
    title: "Chat with history",
    description: "Ask questions across meeting transcripts using AI retrieval.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
        <Badge variant="outline" className="mb-6 border-zinc-700 text-zinc-300">
          AI-powered meeting intelligence
        </Badge>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
          Turn messy meetings into clear decisions.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-400">
          Upload meeting audio, generate transcripts, summarize decisions, extract
          action items, and chat with your meeting history.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="rounded-full">
            Upload Meeting
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-zinc-700 text-black"
          >
            View Dashboard
          </Button>
        </div>

        <div className="mt-16 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-zinc-800 bg-zinc-950/80 text-left">
              <CardContent className="p-6">
                <feature.icon className="mb-4 h-6 w-6 text-zinc-300" />
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}