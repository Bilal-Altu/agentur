"use client";

import React, { useState, useEffect, useRef } from "react";

// Live-Vorschau: bettet die echte Kundenseite verkleinert ein.
// Desktop-Breite 1280px wird per transform auf Kachelbreite skaliert;
// bis die Seite geladen ist, liegt der Screenshot als Fallback darunter.
export default function LivePreview({
    href,
    fallback,
    name,
}: {
    href: string;
    fallback: string;
    name: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ w: 0, h: 0 });
    // Die eingebettete Seite läuft nur, solange die Kachel im Bild ist — sonst
    // animieren vier fremde Webseiten gleichzeitig und bremsen das Scrollen aus.
    const [active, setActive] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const update = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
        update();
        const resizeObs = new ResizeObserver(update);
        resizeObs.observe(el);

        if (typeof IntersectionObserver === "undefined") {
            setActive(true);
            return () => resizeObs.disconnect();
        }

        const viewObs = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
            rootMargin: "150px",
        });
        viewObs.observe(el);

        return () => {
            resizeObs.disconnect();
            viewObs.disconnect();
        };
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
                {active && scale > 0 && (
                    <iframe
                        src={href}
                        title={`Live-Vorschau: ${name}`}
                        loading="lazy"
                        tabIndex={-1}
                        className="absolute left-0 top-0 origin-top-left border-0 bg-surface"
                        style={{ width: 1280, height: Math.ceil(size.h / scale), transform: `scale(${scale})` }}
                    />
                )}
            </div>
        </div>
    );
}
