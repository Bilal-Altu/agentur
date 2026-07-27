import IntroAnimation from "@/components/ui/scroll-morph-hero";

export default function Home() {
  return (
    <main className="relative h-svh w-full">
      {/* Top-Bar mit Platzhalter-Wortmarke */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 md:px-10">
        <span className="text-sm font-bold tracking-[0.35em] text-neutral-100">
          STUDIO
        </span>
        <span className="hidden text-[11px] font-medium tracking-[0.2em] text-neutral-500 md:block">
          WEBSEITEN · AUTOMATISIERUNG · KI
        </span>
      </header>

      <IntroAnimation />
    </main>
  );
}
