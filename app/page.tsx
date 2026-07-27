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
        <nav className="pointer-events-auto hidden gap-8 text-[11px] font-medium tracking-[0.2em] text-neutral-400 md:flex">
          <a href="#projekte" className="transition hover:text-neutral-100">PROJEKTE</a>
          <a href="#leistungen" className="transition hover:text-neutral-100">LEISTUNGEN</a>
          <a href="#kontakt" className="transition hover:text-neutral-100">KONTAKT</a>
        </nav>
      </header>

      <div className="h-svh w-full">
        <IntroAnimation />
      </div>

      <Sections />
    </main>
  );
}
