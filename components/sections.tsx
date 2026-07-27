"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, useSpring, useScroll } from "framer-motion";
import LivePreview from "@/components/live-preview";
import { FEATURED_PROJECTS } from "@/components/projects-data";

// --- Scroll-Reveal: Elemente fliegen beim Reinscrollen aus einem Blur ein ---
function Reveal({
    children,
    delay = 0,
    className,
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay }}
        >
            {children}
        </motion.div>
    );
}

// --- Sektions-Gerüst: Kicker + Überschrift + Inhalt ---
function Section({
    id,
    kicker,
    title,
    children,
    className = "",
}: {
    id: string;
    kicker: string;
    title: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section id={id} className={`relative mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32 ${className}`}>
            <Reveal>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-accent">{kicker}</p>
                <h2 className="mb-12 max-w-2xl text-3xl font-semibold tracking-tight text-neutral-50 md:text-5xl">
                    {title}
                </h2>
            </Reveal>
            {children}
        </section>
    );
}

const SERVICES = [
    {
        nr: "01",
        name: "Webseiten",
        product: "Der digitale Auftritt",
        text: "Moderne, schnelle Webseiten, die Anfragen bringen — nicht nur gut aussehen. Von der ersten Idee bis zur laufenden Seite, alles aus einer Hand.",
        points: ["Design & Entwicklung", "Texte & Bildsprache", "SEO & Google Business", "Hosting & Wartung"],
        scenario: "Kunde googelt „Dachdecker in der Nähe“ → findet euch → fragt direkt über die Seite an.",
    },
    {
        nr: "02",
        name: "Automatisierung",
        product: "Der Büro-Autopilot",
        text: "Wiederkehrende Abläufe laufen von selbst: Angebote, Terminbestätigungen, Rechnungen, Nachfassen. Ihr spart Stunden — jede Woche.",
        points: ["Angebots- & Rechnungsabläufe", "Termin-Erinnerungen", "E-Mail-Vorlagen & Nachfassen", "Anbindung eurer Tools"],
        scenario: "Anfrage kommt rein → Angebot geht raus → Nachfassen passiert automatisch.",
    },
    {
        nr: "03",
        name: "KI-Agenten",
        product: "Der KI-Mitarbeiter",
        text: "Ein digitaler Mitarbeiter, der Anrufe entgegennimmt, E-Mails beantwortet und Anfragen vorsortiert — rund um die Uhr, auch am Wochenende.",
        points: ["Telefon-Assistent", "E-Mail-Beantwortung", "Anfragen-Qualifizierung", "Übergabe an euch, wenn es wichtig wird"],
        scenario: "Kunde ruft um 19 Uhr an → KI nimmt den Auftrag auf → der Termin steht morgens im Kalender.",
    },
];

// Die Reise vom ersten Hallo bis zum Launch (Zeitangaben = Platzhalter)
const JOURNEY = [
    {
        nr: "01",
        time: "Tag 1",
        title: "Erstgespräch",
        text: "30 Minuten, kostenlos, ohne Fachchinesisch. Wir hören zu: Was macht euren Betrieb aus — und was soll die Seite für euch erledigen?",
    },
    {
        nr: "02",
        time: "Tag 2–3",
        title: "Konzept & Festpreis",
        text: "Ihr bekommt einen klaren Plan: Aufbau, Inhalte, Zeitplan — und einen Festpreis, der hält. Keine versteckten Kosten, keine Überraschungen.",
    },
    {
        nr: "03",
        time: "Woche 1",
        title: "Der erste Entwurf",
        text: "Der Moment, auf den wir uns am meisten freuen: Ihr seht eure neue Seite zum ersten Mal. Live im Browser — nicht als PDF.",
    },
    {
        nr: "04",
        time: "Woche 2",
        title: "Feinschliff",
        text: "Ihr sagt, was besser geht — wir setzen um. So lange, bis ihr sagt: Genau so. Kurze Wege, schnelle Antworten.",
    },
    {
        nr: "05",
        time: "Woche 3–4",
        title: "Launch & Betreuung",
        text: "Eure Seite geht online: blitzschnell, Google-optimiert, auf jedem Gerät. Und danach bleiben wir dran — Wartung, Updates, neue Ideen.",
    },
];

const FAQS = [
    {
        q: "Was kostet eine Webseite?",
        a: "Das hängt vom Umfang ab. Nach dem kostenlosen Erstgespräch bekommt ihr einen Festpreis — keine versteckten Kosten. [Platzhalter: Preisspanne ergänzen, z. B. „ab X €“]",
    },
    {
        q: "Wie lange dauert die Umsetzung?",
        a: "Eine typische Firmenwebseite ist 2–4 Wochen nach Konzeptfreigabe online. Automatisierungen und KI-Agenten je nach Umfang. [Platzhalter: eigene Erfahrungswerte ergänzen]",
    },
    {
        q: "Übernehmt ihr auch Hosting und Wartung?",
        a: "Ja. Auf Wunsch kümmern wir uns um alles Laufende: Hosting, Updates, Sicherheit und kleine Anpassungen — damit ihr euch nie mit Technik beschäftigen müsst.",
    },
    {
        q: "Ich habe schon eine Webseite. Könnt ihr die übernehmen?",
        a: "Klar. Wir schauen uns den bestehenden Auftritt an und sagen ehrlich, ob sich ein Relaunch lohnt oder gezielte Verbesserungen reichen.",
    },
    {
        q: "Wie funktioniert ein KI-Agent in meinem Betrieb?",
        a: "Der Agent wird auf euren Betrieb eingerichtet: eure Leistungen, eure Preise, euer Ton. Er nimmt Anrufe und E-Mails an, beantwortet Standardfragen und übergibt an euch, sobald es konkret wird.",
    },
];

// --- FAQ-Eintrag mit Auf/Zu-Logik ---
function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-white/10">
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
                aria-expanded={open}
            >
                <span className="text-base font-medium text-neutral-100 md:text-lg">{q}</span>
                <span
                    className={`text-xl text-accent transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                >
                    +
                </span>
            </button>
            <div
                className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
                <p className="overflow-hidden text-sm leading-relaxed text-neutral-400 md:text-base">{a}</p>
            </div>
        </div>
    );
}

export default function Sections() {
    // Prozess-Timeline: Linie füllt sich beim Scrollen mit Licht
    const journeyRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: journeyRef,
        offset: ["start 70%", "end 55%"],
    });
    const lineProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

    return (
        <div className="relative bg-[#0a0a0a]">
            {/* --- Hintergrund: Raster + Korn (die Cursor-Lampe bleibt dem Hero vorbehalten) --- */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
                        backgroundSize: "26px 26px",
                    }}
                />
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    }}
                />
            </div>

            {/* --- 2 · Zahlen-Leiste --- */}
            <div className="relative border-y border-white/10">
                <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-white/10 px-6 md:px-10">
                    {[
                        ["8+", "Projekte live"],
                        ["7", "Branchen"],
                        ["< 24h", "Antwortzeit"],
                    ].map(([nr, label], i) => (
                        <Reveal key={label} delay={i * 0.12} className="py-8 text-center md:py-10">
                            <p className="text-2xl font-semibold text-neutral-50 md:text-4xl">{nr}</p>
                            <p className="mt-1 text-xs tracking-wide text-neutral-500 md:text-sm">{label}</p>
                        </Reveal>
                    ))}
                </div>
            </div>

            {/* --- 3 · Projekte --- */}
            <Section id="projekte" kicker="Ausgewählte Projekte" title="Echte Betriebe. Echte Ergebnisse.">
                {/* Mobil: horizontales Wisch-Karussell · Desktop: 2×2-Raster */}
                <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
                    {FEATURED_PROJECTS.map((p, i) => (
                        <Reveal key={p.name} delay={(i % 2) * 0.15} className="w-[85vw] max-w-[420px] flex-none snap-center md:w-auto md:max-w-none">
                            <a
                                href={p.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10 transition hover:ring-accent/60"
                            >
                                <LivePreview href={p.href!} fallback={p.src} name={p.domain!} />
                                <div className="p-6">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">{p.category}</p>
                                    <h3 className="mt-1 text-xl font-semibold text-neutral-50">{p.name}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-neutral-400">{p.result}</p>
                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                        {p.tags.map((t) => (
                                            <span
                                                key={t}
                                                className="rounded-full border border-white/10 px-3 py-1 text-[11px] tracking-wide text-neutral-400"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                        <span className="ml-auto text-[11px] font-medium tracking-wide text-neutral-500 transition group-hover:text-accent">
                                            Live ansehen ↗
                                        </span>
                                    </div>
                                </div>
                            </a>
                        </Reveal>
                    ))}
                </div>
                <p className="mt-3 text-center text-xs text-neutral-600 md:hidden">← wischen →</p>
                <Reveal className="mt-8">
                    <Link
                        href="/referenzen"
                        className="inline-flex items-center gap-2 text-sm font-medium text-neutral-300 transition hover:text-accent"
                    >
                        Alle 8 Referenzen ansehen <span aria-hidden>→</span>
                    </Link>
                </Reveal>
            </Section>

            {/* --- 4 · Leistungen --- */}
            <Section id="leistungen" kicker="Leistungen" title="Drei Wege, wie wir euren Betrieb digital stärken.">
                <div className="space-y-6">
                    {SERVICES.map((s, i) => (
                        <Reveal key={s.nr} delay={i * 0.1}>
                            <div className="grid gap-6 rounded-2xl bg-neutral-900 p-8 ring-1 ring-white/10 md:grid-cols-[auto_1fr_1fr] md:gap-10 md:p-10">
                                <p className="text-4xl font-semibold text-white/15 md:text-5xl">{s.nr}</p>
                                <div>
                                    <h3 className="text-2xl font-semibold text-neutral-50">{s.name}</h3>
                                    <p className="mt-0.5 text-sm font-medium text-accent">„{s.product}“</p>
                                    <p className="mt-3 text-sm leading-relaxed text-neutral-400">{s.text}</p>
                                </div>
                                <div className="flex flex-col justify-between gap-4">
                                    <ul className="space-y-2">
                                        {s.points.map((pt) => (
                                            <li key={pt} className="flex items-start gap-2 text-sm text-neutral-300">
                                                <span className="mt-0.5 text-accent">✓</span> {pt}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="rounded-xl border border-accent/20 bg-accent/5 p-3 text-xs leading-relaxed text-neutral-400">
                                        {s.scenario}
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </Section>

            {/* --- 5 · Prozess: die Reise zum Launch --- */}
            <Section id="prozess" kicker="So läuft es ab" title="Vom ersten Hallo bis zum Launch — eure Reise mit uns.">
                <div ref={journeyRef} className="relative">
                    {/* Grundlinie + Licht-Linie, die sich beim Scrollen füllt */}
                    <div className="absolute left-4 top-0 h-full w-px bg-white/10 md:left-1/2" />
                    <motion.div
                        style={{ scaleY: lineProgress }}
                        className="absolute left-4 top-0 h-full w-px origin-top bg-accent shadow-[0_0_12px_rgba(124,92,255,0.7)] md:left-1/2"
                    />

                    <div className="space-y-12 md:space-y-20">
                        {JOURNEY.map((step, i) => {
                            const leftSide = i % 2 === 0; // Desktop: abwechselnd links/rechts der Linie
                            return (
                                <Reveal key={step.nr}>
                                    <div
                                        className={`relative pl-12 md:w-1/2 md:pl-0 ${
                                            leftSide ? "md:pr-16 md:text-right" : "md:ml-auto md:pl-16"
                                        }`}
                                    >
                                        {/* Checkpoint: leuchtet auf, wenn er erreicht wird */}
                                        <motion.span
                                            className={`absolute left-4 top-1.5 z-10 h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-[#0a0a0a] md:left-auto ${
                                                leftSide
                                                    ? "md:right-0 md:translate-x-1/2"
                                                    : "md:left-0 md:-translate-x-1/2"
                                            }`}
                                            initial={{ backgroundColor: "#404040", scale: 1, boxShadow: "0 0 0px rgba(124,92,255,0)" }}
                                            whileInView={{
                                                backgroundColor: "#7c5cff",
                                                scale: 1.2,
                                                boxShadow: "0 0 18px rgba(124,92,255,0.8)",
                                            }}
                                            viewport={{ once: true, margin: "-45% 0px -45% 0px" }}
                                            transition={{ duration: 0.4 }}
                                        />
                                        <span className="inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                                            {step.time}
                                        </span>
                                        <h3 className="mt-3 text-xl font-semibold text-neutral-50 md:text-2xl">
                                            <span className="mr-2 text-accent/40">{step.nr}</span>
                                            {step.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-neutral-400 md:text-base">{step.text}</p>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>

                    {/* Launch-Moment am Ende der Linie */}
                    <div className="relative mt-16 pl-12 text-left md:mt-24 md:pl-0 md:text-center">
                        <span className="absolute left-4 top-1 flex h-4 w-4 -translate-x-1/2 md:left-1/2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                            <span className="relative inline-flex h-4 w-4 rounded-full bg-accent shadow-[0_0_20px_rgba(124,92,255,0.9)]" />
                        </span>
                        <Reveal>
                            <p className="pt-1 text-sm text-neutral-400 md:pt-10">Bereit für den ersten Schritt?</p>
                            <a
                                href="#kontakt"
                                className="mt-4 inline-block rounded-full bg-accent px-8 py-4 text-sm font-semibold tracking-wide text-white transition hover:bg-accent/80"
                            >
                                Startschuss geben
                            </a>
                        </Reveal>
                    </div>
                </div>
            </Section>

            {/* --- 6 · Über uns --- */}
            <Section id="ueber-uns" kicker="Über uns" title="Ihr sprecht immer mit den Leuten, die eure Seite bauen.">
                <div className="grid gap-10 md:grid-cols-[1fr_auto]">
                    <Reveal>
                        <p className="max-w-xl text-lg leading-relaxed text-neutral-300 md:text-xl">
                            Keine Agentur-Etagen, keine Ticketsysteme, keine Praktikanten. Wir sind zwei Gründer aus der
                            Region — einer baut, einer denkt mit. Kurze Wege, ehrliche Ansagen, Ergebnisse, die man messen
                            kann.
                        </p>
                        <p className="mt-4 text-sm text-neutral-500">
                            [Platzhalter: 2–3 Sätze zu euch beiden — Werdegang, warum ihr das macht]
                        </p>
                    </Reveal>
                    <div className="flex gap-6">
                        {[
                            ["B", "Bilal", "[Rolle ergänzen]"],
                            ["?", "[Name Kollege]", "[Rolle ergänzen]"],
                        ].map(([initial, name, role], i) => (
                            <Reveal key={name} delay={i * 0.15}>
                                <div className="text-center">
                                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-neutral-800 text-3xl font-semibold text-accent ring-1 ring-white/10">
                                        {initial}
                                    </div>
                                    <p className="mt-3 text-sm font-medium text-neutral-100">{name}</p>
                                    <p className="text-xs text-neutral-500">{role}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </Section>

            {/* --- 7 · FAQ --- */}
            <Section id="faq" kicker="Häufige Fragen" title="Was Kunden uns vor dem Start fragen.">
                <Reveal>
                    <div className="max-w-3xl border-t border-white/10">
                        {FAQS.map((f) => (
                            <FaqItem key={f.q} q={f.q} a={f.a} />
                        ))}
                    </div>
                </Reveal>
            </Section>

            {/* --- 8 · Kontakt --- */}
            <section id="kontakt" className="relative border-t border-white/10">
                <div className="mx-auto max-w-6xl px-6 py-24 text-center md:px-10 md:py-36">
                    <Reveal>
                        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-accent">Kontakt</p>
                        <h2 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-neutral-50 md:text-6xl">
                            Lasst uns über euer Projekt sprechen.
                        </h2>
                        <p className="mx-auto mt-5 max-w-xl text-base text-neutral-400">
                            Kostenloses Erstgespräch — unverbindlich, 30 Minuten, mit konkreten Ideen für euren Betrieb.
                        </p>
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                            <a
                                href="mailto:hallo@beispiel.de" /* TODO: echte E-Mail ergänzen */
                                className="rounded-full bg-accent px-8 py-4 text-sm font-semibold tracking-wide text-white transition hover:bg-accent/80"
                            >
                                Projekt anfragen
                            </a>
                            <a
                                href="#" /* TODO: WhatsApp-Link ergänzen */
                                className="rounded-full border border-white/20 px-8 py-4 text-sm font-semibold tracking-wide text-neutral-100 transition hover:border-accent hover:text-accent"
                            >
                                WhatsApp schreiben
                            </a>
                        </div>
                    </Reveal>
                </div>
                <footer className="relative border-t border-white/10">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-neutral-500 md:flex-row md:px-10">
                        <span className="font-bold tracking-[0.35em] text-neutral-300">STUDIO</span>
                        <span>© 2026 — Webseiten · Automatisierung · KI für den Mittelstand</span>
                        <span className="flex gap-6">
                            <a href="#" className="hover:text-neutral-300">Impressum</a>
                            <a href="#" className="hover:text-neutral-300">Datenschutz</a>
                        </span>
                    </div>
                </footer>
            </section>
        </div>
    );
}
