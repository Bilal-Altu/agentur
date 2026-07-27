// Zentrale Projektliste — Startseite zeigt die Featured-Auswahl,
// /referenzen zeigt alle. Fehlende hrefs = Live-Link folgt noch.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export interface ProjectRef {
    src: string;
    name: string;
    category: string;
    result: string;
    tags: string[];
    href?: string;
    domain?: string;
    featured?: boolean;
}

export const PROJECTS: ProjectRef[] = [
    {
        src: `${BASE}/referenzen/stadtmueller.jpg`,
        name: "Stadtmüller Bedachungen",
        category: "Dachdecker · Lampertheim",
        result: "Neuer Webauftritt für über 80 Jahre Dachdecker-Handwerk.",
        tags: ["Webdesign", "Entwicklung", "SEO"],
        href: "https://bilal-altu.github.io/stadtmueller-bedachungen/",
        domain: "stadtmueller-bedachungen",
        featured: true,
    },
    {
        src: `${BASE}/referenzen/gardinen-mannheim-dark.jpg`,
        name: "Gardinen Mannheim",
        category: "Studio für Fenster · Mannheim",
        result: "Licht, Stoff, Raum — edler Auftritt für Maßkonfektion.",
        tags: ["Webdesign", "Branding", "Texte"],
        href: "https://bilal-altu.github.io/gardinenmannheim-studio/",
        domain: "gardinenmannheim-studio",
        featured: true,
    },
    {
        src: `${BASE}/referenzen/kfz-nuri.jpg`,
        name: "Ingenieurbüro Nuri",
        category: "Kfz-Gutachten · Heppenheim",
        result: "Gerichtsverwertbare Gutachten, vertrauenswürdig präsentiert.",
        tags: ["Webdesign", "Entwicklung", "Local SEO"],
        href: "https://nuri-ing.netlify.app/",
        domain: "nuri-ing.netlify.app",
        featured: true,
    },
    {
        src: `${BASE}/referenzen/campingglueck.jpg`,
        name: "Campingglück",
        category: "Wohnmobil-Service",
        result: "Werkstatt, Ausstattung und Service — alles aus einer Hand.",
        tags: ["Webdesign", "Entwicklung"],
        href: "https://bilal-altu.github.io/campingglueck/",
        domain: "campingglueck",
        featured: true,
    },
    {
        src: `${BASE}/referenzen/sordillo.jpg`,
        name: "Sordillo",
        category: "Erdbau & Abbruch · Dittelsheim-Heßloch",
        result: "Markanter Auftritt für über 40 Jahre Erdbau und Abbruch.",
        tags: ["Webdesign", "Branding"],
    },
    {
        src: `${BASE}/referenzen/mp-dienstleistungen.jpg`,
        name: "MP-Dienstleistungen",
        category: "Gebäudereinigung · Bürstadt",
        result: "Saubere Gebäude, auf die Verlass ist — seriös präsentiert.",
        tags: ["Webdesign", "Texte"],
    },
    {
        src: `${BASE}/referenzen/avci-geruestbau.jpg`,
        name: "AVCI Gerüstbau",
        category: "Gerüstbau · Bürstadt",
        result: "Sicher, zuverlässig, regional — Vertrauen ab dem ersten Klick.",
        tags: ["Webdesign", "Local SEO"],
    },
    {
        src: `${BASE}/referenzen/handpan-noll.jpg`,
        name: "Michael Noll",
        category: "Handpan-Artist · Worms",
        result: "Musik und Coaching — ein Auftritt mit Atmosphäre.",
        tags: ["Webdesign", "Branding"],
    },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
