import { useEffect, useMemo, useState } from "react";
import {
  calculateAll,
  heatingTypes,
  formatSek,
  type HeatingId,
  type SystemId,
} from "@affiliate/heatpump-calculator";
import { useTrackClick, useTrackActivation, buildSubId, appendSubId } from "@affiliate/analytics";
import { siteConfig } from "@/config/site";
import { getPrimaryPartner } from "@/config/affiliates";

export interface CalculatorState {
  areaSqm: number;
  bestSystem: SystemId;
  savingsPerYear: number;
}

interface CalculatorProps {
  /** Pre-select + emphasise one system (used on system + spine pages). */
  focusSystem?: SystemId;
  /** Append to the CTA label, e.g. "i Linköping" on a spine page. */
  locationLabel?: string;
  /** Placement tag for click attribution. */
  placement?: string;
  /** Callback when calculator state changes (for driving the 3D scene). */
  onStateChange?: (state: CalculatorState) => void;
}

/**
 * The interactive tool (client island): house inputs → computed cost/ROT/drift/
 * saving/payback per system → quote CTA. Mirrors solceller's search→compute→CTA.
 * Activation fires once a real estimate exists; magnitude = best annual saving.
 */
export function Calculator({ focusSystem, locationLabel, placement = "calc", onStateChange }: CalculatorProps) {
  const [areaSqm, setAreaSqm] = useState(140);
  const [currentHeating, setCurrentHeating] = useState<HeatingId>("direktel");

  const results = useMemo(
    () => calculateAll({ heatedAreaSqm: areaSqm, currentHeating }),
    [areaSqm, currentHeating]
  );

  // Order so the focused system (if any) leads; otherwise best-saving first.
  const ordered = useMemo(() => {
    if (!focusSystem) return results;
    const focus = results.filter((r) => r.system.id === focusSystem);
    const rest = results.filter((r) => r.system.id !== focusSystem);
    return [...focus, ...rest];
  }, [results, focusSystem]);

  const best = ordered[0];
  const hasEstimate = areaSqm > 0 && best.savingPerYear > 0;

  // Notify parent of state changes (for 3D scene)
  useEffect(() => {
    onStateChange?.({
      areaSqm,
      bestSystem: best.system.id,
      savingsPerYear: best.savingPerYear,
    });
  }, [areaSqm, best.system.id, best.savingPerYear, onStateChange]);

  const trackActivation = useTrackActivation("heatpump_estimated");
  useEffect(() => {
    if (hasEstimate) trackActivation(best.savingPerYear);
  }, [hasEstimate, best.savingPerYear, trackActivation]);

  const partner = getPrimaryPartner();
  const subId = buildSubId(siteConfig.slug, placement, partner.id);
  const href = appendSubId(partner.trackingUrl, subId);
  const trackQuote = useTrackClick({
    linkId: partner.id,
    program: "adtraction",
    placement,
    destinationUrl: href,
    subId,
  });

  return (
    <div id="kalkylator" className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-7">
      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-foreground">Uppvärmd boyta</span>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min={50}
              max={400}
              step={10}
              value={areaSqm}
              onChange={(e) => setAreaSqm(Number(e.target.value))}
              className="flex-1 accent-[var(--color-primary)]"
              aria-label="Uppvärmd boyta i kvadratmeter"
            />
            <span className="w-20 text-right font-display text-base font-bold text-foreground">
              {areaSqm} m²
            </span>
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-foreground">Nuvarande uppvärmning</span>
          <select
            value={currentHeating}
            onChange={(e) => setCurrentHeating(e.target.value as HeatingId)}
            className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            {heatingTypes.map((h) => (
              <option key={h.id} value={h.id}>
                {h.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Results: one row per system */}
      <div className="mt-5 space-y-3">
        {ordered.map((r, i) => {
          const isFocus = focusSystem === r.system.id || (!focusSystem && i === 0);
          return (
            <div
              key={r.system.id}
              className={`rounded-2xl border p-4 ${
                isFocus ? "border-primary/40 bg-primary/5" : "border-border bg-background"
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-base font-bold text-foreground">{r.system.name}</h3>
                {isFocus && (
                  <span className="rounded-full bg-grass-soft px-2.5 py-0.5 text-[11px] font-semibold text-grass">
                    Störst besparing
                  </span>
                )}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Fact label="Pris efter ROT" value={formatSek(r.netCost)} sub={`ROT ${formatSek(r.rotDeduction)}`} />
                <Fact label="Driftskostnad/år" value={formatSek(r.driftPerYear)} />
                <Fact label="Besparing/år" value={formatSek(r.savingPerYear)} accent />
                <Fact label="Återbetalning" value={r.paybackYears > 0 ? `${r.paybackYears} år` : "–"} />
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/5 p-4">
        <p className="text-xs leading-relaxed text-muted-foreground">{partner.description}</p>
        <a
          href={href}
          onClick={trackQuote}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="mt-3 block rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
        >
          Få 3 offerter{locationLabel ? ` ${locationLabel}` : ""} →
        </a>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
          Annonssamarbete · kostnadsfritt och utan köpkrav
        </p>
      </div>
    </div>
  );
}

function Fact({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={`mt-0.5 text-sm font-bold ${accent ? "text-grass" : "text-foreground"}`}>{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground">{sub}</div>}
    </div>
  );
}
