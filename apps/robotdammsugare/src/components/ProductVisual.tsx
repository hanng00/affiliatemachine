import { cn } from "@/lib/utils";

type Brand = {
  /** gradient stops, light → deep */
  from: string;
  to: string;
};

// Manufacturer brand cues — used for the visual tile + table monogram.
// Honest stand-in art (a top-down robot-vacuum mark), not a fabricated product photo.
const BRANDS: Record<string, Brand> = {
  roborock: { from: "#5468E8", to: "#2A2F8F" },
  dreame: { from: "#8B5CF6", to: "#5B21B6" },
  irobot: { from: "#10B981", to: "#065F46" },
  xiaomi: { from: "#FF8A3D", to: "#E0510E" },
  ecovacs: { from: "#F87171", to: "#B91C1C" },
  samsung: { from: "#3B7DED", to: "#13287B" },
  electrolux: { from: "#38BDF8", to: "#0369A1" },
};

const DEFAULT_BRAND: Brand = { from: "#5EEAD4", to: "#0E7C72" };

export function brandKey(name: string): string {
  return name.trim().split(/\s+/)[0].toLowerCase();
}

export function getBrand(name: string): Brand {
  return BRANDS[brandKey(name)] ?? DEFAULT_BRAND;
}

/** Single-letter monogram chip (used in the comparison table where logos 404'd). */
export function BrandMonogram({ name, className }: { name: string; className?: string }) {
  const brand = getBrand(name);
  const letter = name.trim().charAt(0).toUpperCase();
  return (
    <div
      className={cn("flex items-center justify-center rounded-lg font-display text-sm font-bold text-white", className)}
      style={{ background: `linear-gradient(135deg, ${brand.from}, ${brand.to})` }}
      aria-hidden="true"
    >
      {letter}
    </div>
  );
}

interface ProductVisualProps {
  name: string;
  className?: string;
  /** show the faint brand wordmark under the mark */
  showLabel?: boolean;
}

/** Branded gradient tile with a top-down robot-vacuum mark. */
export function ProductVisual({ name, className, showLabel = false }: ProductVisualProps) {
  const brand = getBrand(name);
  return (
    <div
      className={cn("relative flex items-center justify-center overflow-hidden rounded-2xl", className)}
      style={{ background: `linear-gradient(140deg, ${brand.from}, ${brand.to})` }}
      role="img"
      aria-label={`${name} – robotdammsugare`}
    >
      {/* soft top-light highlight */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 90% at 25% 10%, rgba(255,255,255,0.30), transparent 55%)" }}
      />
      {/* top-down robot vacuum mark */}
      <svg viewBox="0 0 100 100" className="relative h-3/5 w-3/5 drop-shadow-lg" fill="none">
        <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.95)" />
        <circle cx="50" cy="50" r="40" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" />
        {/* front sensor bar */}
        <path d="M22 38 A40 40 0 0 1 78 38" stroke={brand.to} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
        {/* LiDAR turret */}
        <circle cx="50" cy="50" r="13" fill={brand.to} opacity="0.92" />
        <circle cx="50" cy="50" r="5" fill="rgba(255,255,255,0.9)" />
      </svg>
      {showLabel && (
        <span className="absolute bottom-3 left-0 right-0 text-center font-display text-xs font-semibold uppercase tracking-widest text-white/85">
          {brandKey(name)}
        </span>
      )}
    </div>
  );
}
