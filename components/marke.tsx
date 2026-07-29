// Markenzeichen laut CD-Guide: Wortmarke ohne Subline, Mastericon für dunklen Grund.
// Beide Assets liegen in public/brand/ und sind die verbindliche Logoquelle.

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function Wortmarke({ className = "h-6" }: { className?: string }) {
    return (
        <img
            src={`${BASE}/brand/wordmark.png`}
            alt="Code²"
            className={`w-auto select-none ${className}`}
        />
    );
}

export function Mastericon({ className = "h-10 w-10" }: { className?: string }) {
    return (
        <img
            src={`${BASE}/brand/icon.png`}
            alt=""
            aria-hidden
            className={`select-none rounded-[22%] ${className}`}
        />
    );
}
