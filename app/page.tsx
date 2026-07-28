import Link from "next/link";
import IntroAnimation from "@/components/ui/scroll-morph-hero";
import Sections from "@/components/sections";

export default function Home() {
  return (
    <main className="relative">
      {/* Top-Bar mit Platzhalter-Wortmarke und Sprungmarken */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 md:px-10">
        <span className="text-sm font-bold tracking-[0.35em] text-neutral-100">
          STUDIO
        </span>
        <nav className="pointer-events-auto flex gap-4 text-[11px] font-medium tracking-[0.2em] text-neutral-400 md:gap-8">
          <a href="#projekte" className="hidden transition hover:text-neutral-100 md:inline">PROJEKTE</a>
          <a href="#leistungen" className="hidden transition hover:text-neutral-100 md:inline">LEISTUNGEN</a>
          <Link href="/referenzen" className="transition hover:text-neutral-100">REFERENZEN</Link>
          <a href="#kontakt" className="transition hover:text-neutral-100">KONTAKT</a>
        </nav>
      </header>

      <IntroAnimation />

      <Sections />
    </main>
  );
}
