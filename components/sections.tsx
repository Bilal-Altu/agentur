"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

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

// --- Daten (Platzhalter, später ergänzen) ---
const FEATURED_PROJECTS = [
    {
        src: `${BASE}/referenzen/stadtmueller.jpg`,
        name: "Stadtmüller Bedachungen",
        category: "Dachdecker · Lampertheim",
        result: "Neuer Webauftritt für über 80 Jahre Dachdecker-Handwerk.",
        tags: ["Webdesign", "Entwicklung", "SEO"],
        href: "https://bilal-altu.github.io/stadtmueller-bedachungen/",
        domain: "stadtmueller-bedachungen",
    },
    {
        src: `${BASE}/referenzen/gardinen-mannheim-dark.jpg`,
        name: "Gardinen Mannheim",
        category: "Studio für Fenster · Mannheim",
        result: "Licht, Stoff, Raum — edler Auftritt für Maßkonfektion.",
        tags: ["Webdesign", "Branding", "Texte"],
        href: "https://bilal-altu.github.io/gardinenmannheim-studio/",
        domain: "gardinenmannheim-studio",
    },
    {
        src: `${BASE}/referenzen/kfz-nuri.jpg`,
        name: "Ingenieurbüro Nuri",
        category: "Kfz-Gutachten · Heppenheim",
        result: "Gerichtsverwertbare Gutachten, vertrauenswürdig präsentiert.",
        tags: ["Webdesign", "Entwicklung", "Local SEO"],
        href: "https://nuri-ing.netlify.app/",
        domain: "nuri-ing.netlify.app",
    },
    {
        src: `${BASE}/referenzen/campingglueck.jpg`,
        name: "Campingglück",
        category: "Wohnmobil-Service",
        result: "Werkstatt, Ausstattung und Service — alles aus einer Hand.",
        tags: ["Webdesign", "Entwicklung"],
        href: "https://bilal-altu.github.io/campingglueck/",
        domain: "campingglueck",
    },
];

// --- Live-Vorschau: bettet die echte Kundenseite verkleinert ein ---
// Desktop-Breite 1280px wird per transform auf Kachelbreite skaliert;
// bis die Seite geladen ist, liegt der Screenshot als Fallback darunter.
function LivePreview({ href, fallback, name }: { href: string; fallback: string; name: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ w: 0, h: 0 });

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const update = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
        update();
        const obs = new ResizeObserver(update);
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const scale = size.w / 1280;

    return (
        <div>
            {/* Browser-Fenster-Leiste */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-neutral-950/60 px-4 py-2.5">
                <span className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                </span>
                <span className="ml-2 truncate rounded-md bg-white/5 px-3 py-0.5 text-[10px] tracking-wide text-neutral-500">
                    {name}
                </span>
            </div>
            {/* Eingebettete Live-Seite */}
            <div ref={ref} className="pointer-events-none relative h-[300px] select-none overflow-hidden md:h-[360px]">
                <img src={fallback} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover object-top" />
                {scale > 0 && (
                    <iframe
                        src={href}
                        title={`Live-Vorschau: ${name}`}
                        loading="lazy"
                        tabIndex={-1}
                        className="absolute left-0 top-0 origin-top-left border-0 bg-[#0a0a0a]"
                        style={{ width: 1280, height: Math.ceil(size.h / scale), transform: `scale(${scale})` }}
                    />
                )}
            </div>
        </div>
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

const PROCESS = [
    {
        nr: "01",
        title: "Erstgespräch",
        text: "Kostenlos und unverbindlich, 30 Minuten. Wir hören zu: Was braucht euer Betrieb wirklich?",
    },
    {
        nr: "02",
        title: "Konzept & Festpreis",
        text: "Ihr bekommt einen klaren Vorschlag mit Festpreis. Keine versteckten Kosten, keine Überraschungen.",
    },
    {
        nr: "03",
        title: "Umsetzung & Betreuung",
        text: "Wir bauen, ihr gebt Feedback. Nach dem Start bleiben wir dran — Wartung, Updates, Erweiterungen.",
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
    // Cursor-Lampe auch im unteren Seitenbereich
    const cursorX = useMotionValue(-600);
    const cursorY = useMotionValue(-600);
    const spotX = useSpring(cursorX, { stiffness: 250, damping: 30 });
    const spotY = useSpring(cursorY, { stiffness: 250, damping: 30 });
    const lampGlow = useMotionTemplate`radial-gradient(circle 280px at ${spotX}px ${spotY}px, rgba(255,255,255,0.05) 0%, rgba(124,92,255,0.05) 35%, transparent 70%)`;

    return (
        <div
            className="relative bg-[#0a0a0a]"
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                cursorX.set(e.clientX - rect.left);
                cursorY.set(e.clientY - rect.top);
            }}
            onMouseLeave={() => {
                cursorX.set(-600);
                cursorY.set(-600);
            }}
        >
            {/* --- Hintergrund: Raster + Korn + Lampe (wie im Hero) --- */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
                        backgroundSize: "26px 26px",
                    }}
                />
                <motion.div className="absolute inset-0" style={{ background: lampGlow }} />
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
                <div className="grid gap-6 md:grid-cols-2">
                    {FEATURED_PROJECTS.map((p, i) => (
                        <Reveal key={p.name} delay={(i % 2) * 0.15}>
                            <a
                                href={p.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10 transition hover:ring-accent/60"
                            >
                                <LivePreview href={p.href} fallback={p.src} name={p.domain} />
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
                <Reveal className="mt-8">
                    <p className="text-sm text-neutral-500">
                        + 4 weitere Projekte — von Erdbau bis Gebäudereinigung. Tipp: Fahre im Hero oben mit der Maus über die
                        Karten.
                    </p>
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

            {/* --- 5 · Prozess --- */}
            <Section id="prozess" kicker="So läuft es ab" title="In drei Schritten zur fertigen Lösung.">
                <div className="grid gap-6 md:grid-cols-3">
                    {PROCESS.map((step, i) => (
                        <Reveal key={step.nr} delay={i * 0.15}>
                            <div className="h-full rounded-2xl bg-neutral-900 p-8 ring-1 ring-white/10">
                                <p className="text-5xl font-semibold text-accent/30">{step.nr}</p>
                                <h3 className="mt-4 text-xl font-semibold text-neutral-50">{step.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{step.text}</p>
                            </div>
                        </Reveal>
                    ))}
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
