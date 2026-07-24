import { useEffect, useRef, useState } from "react";
import {
  calculateLoan,
  debtTypes,
  defaultAssumptions,
  formatSek,
  formatPct,
  type Debt,
  type DebtType,
} from "@affiliate/loan-calculator";
import { useTrackClick, useTrackActivation, buildSubId, appendSubId } from "@affiliate/analytics";
import { siteConfig } from "@/config/site";
import { getPrimaryPartner } from "@/config/affiliates";
import { EditableNumber, EditableSelect } from "@/components/EditableField";
import { publishLoanSnapshot } from "@/lib/loanStore";

/**
 * Count a number up to its target over ~600ms; respects reduced motion.
 * Initializes to `target` so the server render (and the first client paint
 * before hydration) shows the final figure with no animation or mismatch.
 */
function useCountUp(target: number, duration = 600): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const from = fromRef.current;
    if (prefersReduced || from === target) {
      fromRef.current = target;
      setValue(target);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

interface DebtRow extends Debt {
  /** Always set for a UI row (makeRow seeds it), unlike the optional domain type. */
  type: DebtType;
  /** Stable key so React doesn't reorder inputs as the user edits. */
  key: string;
}

let nextKey = 0;
const makeRow = (type: DebtType, amount: number): DebtRow => {
  const meta = debtTypes.find((d) => d.id === type)!;
  return { key: `d${nextKey++}`, type, amount, rate: meta.typicalRate };
};

// Pre-seeded realistic example so a working answer shows before any input —
// "show value first". Because this component SSRs, the seeded number is also
// what prerenders into the HTML (no empty hero, good for SEO).
const seedRows: DebtRow[] = [
  makeRow("privatlan", 80_000),
  makeRow("kreditkort", 30_000),
  makeRow("smslan", 15_000),
];

export default function LoanCalculator() {
  const [rows, setRows] = useState<DebtRow[]>(seedRows);
  // Key of a freshly-added row, so it opens straight into amount-edit mode.
  const [autoEditKey, setAutoEditKey] = useState<string | null>(null);
  const [targetRate, setTargetRate] = useState(defaultAssumptions.targetRate);
  const [termYears, setTermYears] = useState(defaultAssumptions.termYears);

  const result = calculateLoan(rows, {
    ...defaultAssumptions,
    targetRate,
    termYears,
  });

  const lostDeduction = useCountUp(result.lostDeductionPerYear);
  const monthlySaving = useCountUp(Math.max(0, result.monthlySaving));

  // Publish the live result so the prerendered story sections below (the cost
  // and consolidation diagrams) show the user's own numbers, not a static demo.
  useEffect(() => {
    publishLoanSnapshot({ result, targetRate });
  }, [result, targetRate]);

  const partner = getPrimaryPartner();
  const subId = buildSubId(siteConfig.slug, "results_cta", partner.id);
  const href = appendSubId(partner.trackingUrl, subId);
  const trackCta = useTrackClick({
    linkId: partner.id,
    program: "adtraction",
    placement: "results_cta",
    destinationUrl: href,
    subId,
  });

  const hasDebt = result.totalDebt > 0;

  // Activation = the visitor made the tool *theirs* (edited the seed). Fired
  // once per session; `result.lostDeductionPerYear` is the magnitude they saw.
  const trackActivation = useTrackActivation("loan_edited");
  const activate = () => trackActivation(result.lostDeductionPerYear);

  function updateRow(key: string, patch: Partial<DebtRow>) {
    activate();
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }
  function addRow() {
    activate();
    const row = makeRow("delbetalning", 0);
    setRows((rs) => [...rs, row]);
    setAutoEditKey(row.key);
  }
  function removeRow(key: string) {
    activate();
    setRows((rs) => rs.filter((r) => r.key !== key));
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
      {/* LEFT — the story + the live number (mobile: first) */}
      <div className="order-1 lg:pt-6">
        <span className="inline-flex items-center rounded-full bg-clay-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-clay">
          Gäller från 1 januari 2026
        </span>
        <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl">
          Ränteavdraget på lån utan säkerhet slopas.
        </h1>

        {/* Qualify before we quantify: who this is for, and the one fact that
            resolves the most hesitation (bolån är undantaget). */}
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Privatlån, kreditkort, snabblån eller delbetalningar? Då gäller det dig — bolån påverkas inte.
        </p>

        {/* the result fused into a sentence — the number is the hero */}
        <div className="mt-7">
          {hasDebt ? (
            <>
              <p className="text-base text-muted-foreground">Det kostar dig</p>
              <p className="tabular mt-1.5 font-display text-5xl font-semibold leading-none text-clay md:text-6xl">
                {formatSek(lostDeduction)}
                <span className="ml-2 align-baseline text-2xl font-medium text-clay/70 md:text-3xl">/ år</span>
              </p>
              <p className="mt-3 max-w-md text-base text-muted-foreground">
                i förlorat avdrag — utan att din ränta ändrats.{" "}
                <span className="whitespace-nowrap text-sm text-muted-foreground/80">Källa: Skatteverket.</span>
              </p>
              {result.worthConsolidating && (
                <p className="mt-4 max-w-md text-sm text-muted-foreground">
                  Du kan spara{" "}
                  <span className="tabular font-semibold text-gold">
                    {formatSek(monthlySaving)}/mån
                  </span>{" "}
                  genom att samla lånen till en lägre ränta.
                </p>
              )}
            </>
          ) : (
            <p className="max-w-md text-base text-muted-foreground">
              Lägg in dina lån i kalkylatorn så ser du direkt vad förändringen kostar dig –
              och vad du kan spara på att samla dem.
            </p>
          )}
        </div>

        <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal/10 text-[10px] text-teal" aria-hidden="true">
            ✓
          </span>
          Inga personuppgifter · allt räknas lokalt i din webbläsare
        </p>
      </div>

      {/* RIGHT — the tool (inputs → facts → one CTA) */}
      <div className="order-2">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
          <h2 className="font-display text-base font-semibold text-foreground">Dina lån</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Exempel ifyllt – byt till dina egna belopp och räntor.
          </p>

          <div className="mt-4 space-y-2">
            {rows.map((row) => (
              <div
                key={row.key}
                className="flex items-center gap-x-1.5 gap-y-1 rounded-xl border border-border bg-background px-3 py-2.5 text-base leading-relaxed"
              >
                <span className="flex flex-1 flex-wrap items-center gap-x-1.5">
                  <EditableSelect<DebtType>
                    value={row.type}
                    options={debtTypes}
                    label="Ändra typ av lån"
                    onChange={(type) => {
                      const meta = debtTypes.find((d) => d.id === type)!;
                      updateRow(row.key, { type, rate: meta.typicalRate });
                    }}
                  />
                  <span className="text-muted-foreground" aria-hidden="true">·</span>
                  <EditableNumber
                    value={row.amount}
                    onChange={(amount) => updateRow(row.key, { amount })}
                    format={(v) => formatSek(v)}
                    label="Ändra belopp"
                    step={1000}
                    inputMode="numeric"
                    autoEdit={row.key === autoEditKey}
                  />
                  <span className="text-muted-foreground" aria-hidden="true">·</span>
                  <EditableNumber
                    value={row.rate}
                    onChange={(rate) => updateRow(row.key, { rate })}
                    format={(v) => `${formatPct(v)} ränta`}
                    label="Ändra ränta"
                    max={40}
                    step={0.5}
                    inputMode="decimal"
                  />
                </span>
                <button
                  type="button"
                  aria-label="Ta bort lån"
                  onClick={() => removeRow(row.key)}
                  className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-clay"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRow}
            className="mt-3 w-full rounded-xl border border-dashed border-border py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-teal hover:text-teal"
          >
            + Lägg till lån
          </button>

          {/* Consolidation assumptions */}
          <div className="mt-5 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <label htmlFor="targetRate" className="text-xs font-medium text-foreground">
                Ränta på samlingslån
              </label>
              <span className="tabular text-xs font-semibold text-teal">{formatPct(targetRate)}</span>
            </div>
            <input
              id="targetRate"
              type="range"
              min={4}
              max={15}
              step={0.5}
              value={targetRate}
              onChange={(e) => {
                activate();
                setTargetRate(Number(e.target.value));
              }}
              className="mt-1.5 w-full accent-[var(--color-teal)]"
            />

            <div className="mt-3 flex items-center justify-between">
              <label htmlFor="termYears" className="text-xs font-medium text-foreground">
                Återbetalningstid
              </label>
              <span className="tabular text-xs font-semibold text-teal">{termYears} år</span>
            </div>
            <input
              id="termYears"
              type="range"
              min={1}
              max={15}
              step={1}
              value={termYears}
              onChange={(e) => {
                activate();
                setTermYears(Number(e.target.value));
              }}
              className="mt-1.5 w-full accent-[var(--color-teal)]"
            />
          </div>

          {/* Supporting facts moved below the CTA — reference, not a focal point. */}
        </div>

        {/* CTA — one clear action */}
        <div className="mt-3">
          <a
            href={href}
            onClick={trackCta}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="block rounded-xl bg-teal px-4 py-3.5 text-center text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-gold hover:text-[#1A2B2F]"
          >
            Jämför samlingslån utan kostnad →
          </a>
          <p className="mt-2 text-center text-[11px] leading-relaxed text-muted-foreground">
            Annonssamarbete · en ansökan, en kreditupplysning (UC), inget köpkrav
          </p>
          <p className="mt-3 rounded-xl border border-clay/20 bg-clay-soft/50 px-3 py-2.5 text-center text-[11px] leading-relaxed text-clay">
            Att låna pengar kostar. Kan du inte betala tillbaka i tid riskerar du en
            betalningsanmärkning. Samla bara lån om den nya räntan och de totala kostnaderna
            faktiskt blir lägre – jämför alltid effektiv ränta.
          </p>
          {hasDebt && (
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
              <div>
                <div className="text-[11px] text-muted-foreground">Total skuld</div>
                <div className="tabular mt-0.5 text-sm font-semibold text-foreground">{formatSek(result.totalDebt)}</div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">Snittränta idag</div>
                <div className="tabular mt-0.5 text-sm font-semibold text-foreground">{formatPct(result.weightedCurrentRate)}</div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">Räntekostnad/år</div>
                <div className="tabular mt-0.5 text-sm font-semibold text-foreground">{formatSek(result.currentAnnualInterest)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
