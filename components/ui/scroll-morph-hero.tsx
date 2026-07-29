"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue, useMotionTemplate, useScroll } from "framer-motion";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface Project {
    src: string;
    name: string;
    category: string;
}

interface FlipCardProps {
    project: Project;
    index: number;
    target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

// --- FlipCard Component ---
const IMG_WIDTH = 60;
const IMG_HEIGHT = 85;

function FlipCard({ project, index, target }: FlipCardProps) {
    // Beim Hover richtet sich die Karte gerade auf und flippt dann —
    // sonst dreht sie sich um ihre schräge Achse und wirkt windschief
    const [hovered, setHovered] = useState(false);
    return (
        <motion.div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            animate={{
                x: target.x,
                y: target.y,
                rotate: hovered ? 0 : target.rotation,
                scale: hovered ? target.scale * 1.12 : target.scale,
                opacity: target.opacity,
            }}
            transition={{
                type: "spring",
                stiffness: 40,
                damping: 15,
                rotate: { type: "spring", stiffness: 150, damping: 20 },
                scale: { type: "spring", stiffness: 150, damping: 20 },
            }}
            style={{
                position: "absolute",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                transformStyle: "preserve-3d",
                perspective: "1000px",
                zIndex: hovered ? 30 : "auto",
            }}
            className="cursor-pointer group"
        >
            <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: hovered ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 170, damping: 22 }}
            >
                {/* Front Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg shadow-black/50 bg-surface-strong ring-1 ring-white/10"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <img
                        src={project.src}
                        alt={project.name}
                        className="h-full w-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-transparent" />
                </div>

                {/* Back Face — Glasoptik nach Vorbild des Mastericons */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg shadow-black/50 ring-1 ring-white/10"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        background: "linear-gradient(150deg, #17171f 0%, #0e0e10 55%, #0a0a0b 100%)",
                    }}
                >
                    {/* Lichtkante oben */}
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                    {/* Farbschimmer aus der Ecke */}
                    <span
                        className="pointer-events-none absolute -left-5 -top-6 h-20 w-20 rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(123,92,255,0.4) 0%, transparent 70%)" }}
                    />
                    <span
                        className="pointer-events-none absolute -bottom-8 -right-6 h-20 w-20 rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(255,45,161,0.22) 0%, transparent 70%)" }}
                    />
                    <div
                        className="relative flex h-full flex-col items-center justify-center px-1.5 text-center"
                        style={{
                            hyphens: "auto",
                            textRendering: "geometricPrecision",
                            WebkitFontSmoothing: "antialiased",
                        }}
                        lang="de"
                    >
                        <p className="text-[7.5px] font-semibold leading-[1.15] tracking-[-0.01em] text-white break-words">
                            {project.name}
                        </p>
                        <p className="mt-[3px] text-[5px] font-semibold uppercase leading-none tracking-[0.16em] text-white/55 break-words">
                            {project.category}
                        </p>
                        <span className="mt-1.5 h-px w-4 bg-gradient-to-r from-violet to-pink" />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// --- Main Hero Component ---

// Referenzprojekte (echte Kundenwebseiten)
// basePath-Präfix nötig, weil <img src> von Next.js nicht automatisch umgeschrieben wird
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const PROJECTS: Project[] = [
    { src: `${BASE}/referenzen/handpan-noll.jpg`, name: "Michael Noll", category: "Handpan-Artist" },
    { src: `${BASE}/referenzen/kfz-nuri.jpg`, name: "Ingenieurbüro Nuri", category: "Kfz-Gutachten" },
    { src: `${BASE}/referenzen/sordillo.jpg`, name: "Sordillo", category: "Erdbau & Abbruch" },
    { src: `${BASE}/referenzen/mp-dienstleistungen.jpg`, name: "MP-Dienstleistungen", category: "Gebäudereinigung" },
    { src: `${BASE}/referenzen/stadtmueller.jpg`, name: "Stadtmüller", category: "Bedachungen" },
    { src: `${BASE}/referenzen/campingglueck.jpg`, name: "Campingglück", category: "Wohnmobil-Service" },
    { src: `${BASE}/referenzen/avci-geruestbau.jpg`, name: "AVCI", category: "Gerüstbau" },
    { src: `${BASE}/referenzen/gardinen-mannheim-dark.jpg`, name: "Gardinen Mannheim", category: "Fenster-Studio" },
    { src: `${BASE}/referenzen/gardinen-mannheim-light.jpg`, name: "Gardinen Mannheim", category: "Fenster-Studio" },
];

// Jedes Projekt zweimal: Duplikate liegen dadurch im Kreis genau gegenüber
const CARDS: Project[] = [...PROJECTS, ...PROJECTS];
const TOTAL_IMAGES = CARDS.length;

// Helper for linear interpolation
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function IntroAnimation() {
    const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // --- Container Size ---
    useEffect(() => {
        if (!containerRef.current) return;

        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                setContainerSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        };

        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);

        // Initial set
        setContainerSize({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
        });

        return () => observer.disconnect();
    }, []);

    // --- Scroll-Steuerung ---
    // Der Hero klebt (sticky) in einer hohen Sektion: Die Animation läuft mit dem
    // echten Seiten-Scroll ab, statt Mausrad und Touch abzufangen. Dadurch bleiben
    // Trackpad-Schwung, Scrollbalken, Tastatur und der Übergang zu den Sektionen sauber.
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end end'],
    });

    // 1. Morph: Kreis -> Bogen, im ersten Drittel des Scrollwegs
    const morphProgress = useTransform(scrollYProgress, [0, 0.34], [0, 1]);
    const smoothMorph = useSpring(morphProgress, { stiffness: 90, damping: 26, restDelta: 0.0005 });

    // 2. Danach wandern die Karten im Bogen weiter
    const scrollRotate = useTransform(scrollYProgress, [0.34, 1], [0, 360]);
    const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 90, damping: 26, restDelta: 0.0005 });

    // --- Mouse Parallax + Cursor-Lampe ---
    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

    // Cursor-Position in px (startet außerhalb, damit ohne Maus keine Lampe sichtbar ist)
    const cursorX = useMotionValue(-600);
    const cursorY = useMotionValue(-600);
    const spotX = useSpring(cursorX, { stiffness: 250, damping: 30 });
    const spotY = useSpring(cursorY, { stiffness: 250, damping: 30 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const relativeY = e.clientY - rect.top;

            // Normalize -1 to 1
            const normalizedX = (relativeX / rect.width) * 2 - 1;
            // Move +/- 100px
            mouseX.set(normalizedX * 100);

            cursorX.set(relativeX);
            cursorY.set(relativeY);
        };
        const handleMouseLeave = () => {
            cursorX.set(-600);
            cursorY.set(-600);
        };
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);
        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [mouseX, cursorX, cursorY]);

    // Lampen-Schein + Maske, die das Punktraster unterm Cursor aufdeckt
    const lampGlow = useMotionTemplate`radial-gradient(circle 280px at ${spotX}px ${spotY}px, rgba(255,255,255,0.07) 0%, rgba(124,92,255,0.06) 35%, transparent 70%)`;
    const lampMask = useMotionTemplate`radial-gradient(circle 220px at ${spotX}px ${spotY}px, black 0%, transparent 75%)`;

    // --- Intro Sequence ---
    useEffect(() => {
        // Beim Neuladen mitten auf der Seite direkt in den Kreis springen,
        // statt das Intro unsichtbar im Hintergrund abzuspielen
        if (window.scrollY > 40) {
            setIntroPhase("circle");
            return;
        }
        const timer1 = setTimeout(() => setIntroPhase("line"), 500);
        const timer2 = setTimeout(() => setIntroPhase("circle"), 2500);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    // --- Random Scatter Positions ---
    const scatterPositions = useMemo(() => {
        return CARDS.map(() => ({
            x: (Math.random() - 0.5) * 1500,
            y: (Math.random() - 0.5) * 1000,
            rotation: (Math.random() - 0.5) * 180,
            scale: 0.6,
            opacity: 0,
        }));
    }, []);

    // --- Render Loop (Manual Calculation for Morph) ---
    const [morphValue, setMorphValue] = useState(0);
    const [rotateValue, setRotateValue] = useState(0);
    const [parallaxValue, setParallaxValue] = useState(0);

    useEffect(() => {
        const unsubscribeMorph = smoothMorph.on("change", setMorphValue);
        const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue);
        const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
        return () => {
            unsubscribeMorph();
            unsubscribeRotate();
            unsubscribeParallax();
        };
    }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

    // --- Content Opacity ---
    // Fade in content when arc is formed (morphValue > 0.8)
    const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
    const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

    return (
        // Hohe Sektion gibt den Scrollweg vor; der Hero bleibt darin stehen (sticky)
        <section ref={sectionRef} className="relative h-[240vh]">
        <div ref={containerRef} className="sticky top-0 h-svh w-full bg-surface overflow-hidden">
            {/* --- Hintergrund-Ebenen (rein dekorativ) --- */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
                {/* Akzent-Glow: wandert beim Morph mit den Karten nach unten */}
                <div
                    className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(124,92,255,0.16) 0%, rgba(124,92,255,0.05) 35%, transparent 65%)",
                        transform: `translate(-50%, calc(-50% + ${morphValue * 22}vh)) scale(${1 + morphValue * 0.25})`,
                    }}
                />
                {/* Feines Punktraster, zu den Rändern ausgeblendet */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
                        backgroundSize: "26px 26px",
                        maskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 78%)",
                        WebkitMaskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 78%)",
                    }}
                />
                {/* Cursor-Lampe: weicher Lichtschein ... */}
                <motion.div
                    className="absolute inset-0"
                    style={{ background: lampGlow }}
                />
                {/* ... und hellere Rasterpunkte im Lichtkegel */}
                <motion.div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.22) 1px, transparent 1px)",
                        backgroundSize: "26px 26px",
                        maskImage: lampMask,
                        WebkitMaskImage: lampMask,
                    }}
                />
                {/* Filmkorn */}
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    }}
                />
                {/* Vignette */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
                    }}
                />
            </div>

            {/* Container */}
            <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">

                {/* Intro Text (Fades out) */}
                {/* Textbreite bleibt innerhalb des Kartenkreises (Radius ≈ min(38vmin, 350px)) */}
                <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2 max-w-[min(46vmin,540px)]">
                    <motion.h1
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 1 }}
                        className="brand-hero text-xl text-foreground sm:text-3xl md:text-4xl lg:text-5xl"
                    >
                        Wir bauen digitale Auftritte, die arbeiten.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 0.5 - morphValue } : { opacity: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="mt-3 text-[9px] font-bold tracking-[0.2em] text-neutral-500 md:text-xs"
                    >
                        SCROLLEN ZUM ENTDECKEN
                    </motion.p>
                </div>

                {/* Arc Active Content (Fades in) */}
                <motion.div
                    style={{ opacity: contentOpacity, y: contentY }}
                    className="absolute top-[10%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
                >
                    <h2 className="text-3xl md:text-5xl font-semibold text-neutral-50 tracking-tight mb-4">
                        Webseiten. Automatisierung. KI&#8209;Agenten.
                    </h2>
                    <p className="text-sm md:text-base text-neutral-400 max-w-lg leading-relaxed">
                        Wir entwickeln digitale Auftritte, Automatisierungen und KI&#8209;Mitarbeiter
                        für kleine und mittelständische Unternehmen — <br className="hidden md:block" />
                        damit ihr euch auf euer Geschäft konzentrieren könnt.
                    </p>
                </motion.div>

                {/* Main Container */}
                <div className="relative flex items-center justify-center w-full h-full">
                    {CARDS.map((project, i) => {
                        let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                        // 1. Intro Phases (Scatter -> Line)
                        if (introPhase === "scatter") {
                            target = scatterPositions[i];
                        } else if (introPhase === "line") {
                            const lineSpacing = 70;
                            const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                            const lineX = i * lineSpacing - lineTotalWidth / 2;
                            target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
                        } else {
                            // 2. Circle Phase & Morph Logic

                            // Responsive Calculations
                            const isMobile = containerSize.width < 768;
                            const minDimension = Math.min(containerSize.width, containerSize.height);

                            // A. Calculate Circle Position
                            // Mobil etwas größerer Radius, damit der Text im Kreis Platz hat
                            const circleRadius = Math.min(minDimension * (isMobile ? 0.38 : 0.35), 350);

                            const circleAngle = (i / TOTAL_IMAGES) * 360;
                            const circleRad = (circleAngle * Math.PI) / 180;
                            const circlePos = {
                                x: Math.cos(circleRad) * circleRadius,
                                y: Math.sin(circleRad) * circleRadius,
                                rotation: circleAngle + 90,
                            };

                            // B. Calculate Bottom Arc Position
                            // "Rainbow" Arch: Convex up. Center is highest point.
                            const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
                            const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);

                            const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
                            const arcCenterY = arcApexY + arcRadius;

                            const spreadAngle = isMobile ? 100 : 130;
                            const startAngle = -90 - (spreadAngle / 2);
                            const step = spreadAngle / (TOTAL_IMAGES - 1);

                            // Bounded scroll rotation (keeps cards in view)
                            const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
                            const maxRotation = spreadAngle * 0.8;
                            const boundedRotation = -scrollProgress * maxRotation;

                            const currentArcAngle = startAngle + (i * step) + boundedRotation;
                            const arcRad = (currentArcAngle * Math.PI) / 180;

                            const arcPos = {
                                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                                rotation: currentArcAngle + 90,
                                scale: isMobile ? 1.4 : 1.8,
                            };

                            // C. Interpolate (Morph)
                            target = {
                                x: lerp(circlePos.x, arcPos.x, morphValue),
                                y: lerp(circlePos.y, arcPos.y, morphValue),
                                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                                scale: lerp(1, arcPos.scale, morphValue),
                                opacity: 1,
                            };
                        }

                        return (
                            <FlipCard
                                key={i}
                                project={project}
                                index={i}
                                target={target}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
        </section>
    );
}
