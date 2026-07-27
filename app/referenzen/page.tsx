import type { Metadata } from "next";
import Link from "next/link";
import ReferenzenGrid from "@/components/referenzen-grid";

export const metadata: Metadata = {
  title: "Referenzen — STUDIO",
  description:
    "Alle Webseiten, die wir für kleine und mittelständische Betriebe umgesetzt haben — vom Dachdecker bis zum Fenster-Studio.",
};

export default function ReferenzenPage() {
  return (
    <main className="relative min-h-svh bg-[#0a0a0a]">
      {/* Dezenter Hintergrund wie auf der Startseite */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="text-sm font-bold tracking-[0.35em] text-neutral-100">
          STUDIO
        </Link>
        <Link
          href="/"
          className="text-[11px] font-medium tracking-[0.2em] text-neutral-400 transition hover:text-neutral-100"
        >
          ← STARTSEITE
        </Link>
      </header>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-20">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-accent">Referenzen</p>
        <h1 className="mb-4 max-w-2xl text-3xl font-semibold tracking-tight text-neutral-50 md:text-5xl">
          Alle Projekte im Überblick.
        </h1>
        <p className="mb-12 max-w-xl text-sm leading-relaxed text-neutral-400 md:text-base">
          Acht Betriebe, acht Branchen — jede Seite maßgeschneidert. Bei den Kacheln mit Live-Vorschau
          läuft die echte Kundenseite direkt im Rahmen; ein Klick öffnet sie in voller Größe.
        </p>
        <ReferenzenGrid />
      </div>

      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-neutral-500 md:flex-row md:px-10">
          <span className="font-bold tracking-[0.35em] text-neutral-300">STUDIO</span>
          <Link href="/#kontakt" className="transition hover:text-neutral-300">
            Projekt anfragen →
          </Link>
        </div>
      </footer>
    </main>
  );
}
