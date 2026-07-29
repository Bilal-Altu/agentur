"use client";

import React from "react";
import { motion } from "framer-motion";
import LivePreview from "@/components/live-preview";
import { PROJECTS } from "@/components/projects-data";

function Card({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay }}
        >
            {children}
        </motion.div>
    );
}

export default function ReferenzenGrid() {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {PROJECTS.map((p, i) => {
                const inner = (
                    <>
                        {p.href ? (
                            <LivePreview href={p.href} fallback={p.src} name={p.domain ?? p.name} />
                        ) : (
                            // Noch kein Live-Link: Screenshot, der beim Hover durchscrollt
                            <div className="relative h-[300px] overflow-hidden md:h-[360px]">
                                <img
                                    src={p.src}
                                    alt={`Webseite von ${p.name}`}
                                    className="w-full transition-transform duration-[2500ms] ease-linear group-hover:-translate-y-[55%]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
                                <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] tracking-wide text-neutral-400">
                                    Live-Link folgt
                                </span>
                            </div>
                        )}
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
                                {p.href && (
                                    <span className="ml-auto text-[11px] font-medium tracking-wide text-neutral-500 transition group-hover:text-accent">
                                        Live ansehen ↗
                                    </span>
                                )}
                            </div>
                        </div>
                    </>
                );

                const cardClass =
                    "group block overflow-hidden rounded-2xl bg-surface-strong ring-1 ring-white/10 transition hover:ring-accent/60";

                return (
                    <Card key={p.name + i} delay={(i % 2) * 0.15}>
                        {p.href ? (
                            <a href={p.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
                                {inner}
                            </a>
                        ) : (
                            <div className={cardClass}>{inner}</div>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}
