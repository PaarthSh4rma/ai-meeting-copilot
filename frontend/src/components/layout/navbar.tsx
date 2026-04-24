import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <span className="font-semibold tracking-tight text-white">
            Meeting Copilot
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-zinc-300 hover:text-white">
              Dashboard
            </Button>
          </Link>

          <Link href="/">
            <Button className="rounded-full bg-white text-black hover:bg-zinc-200">
              Upload
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}