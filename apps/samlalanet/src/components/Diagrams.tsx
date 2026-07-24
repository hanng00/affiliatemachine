/**
 * Live story diagrams for the prerendered sections — they read the user's own
 * numbers from the loan store (the same `result` the hero computes), so they
 * SHOW the user's situation instead of telling a generic story.
 *
 * First principles for each chart = the question the user is asking at that
 * spot on the page:
 *
 *  1. CostDiagram ("ränteavdrag 2026") answers "how does a tax-rule change
 *     turn into money out of my pocket?" → show this year's interest as a bar,
 *     and the slice the state USED to refund you (30 %) — now struck out and
 *     gone. The honest, personal version of "30 → 15 → 0".
 *
 *  2. ConsolidationDiagram ("så funkar samlingslån") answers "would one loan
 *     actually cost me less?" → show annual interest in kr today vs at the
 *     target rate. Bar height encodes kr (what people actually read), never the
 *     rate.
 *
 * Both render server-side from the seeded example (populated, no-JS HTML for
 * SEO) and update live on the client. Decorative SVG; the adjacent prose +
 * aria-label carry the meaning for screen readers.
 */
import { formatSek, formatPct } from "@affiliate/loan-calculator";
import { useLoanSnapshot } from "@/lib/loanStore";

const TEAL = "#13505B";
const GOLD = "#C8881A";
const CLAY = "#B4532A";
const MUTED = "#5C6B6E";
const HAIRLINE = "#E7E1D5";

/**
 * Your interest this year, and the refund that's now gone.
 * A full bar = annual interest you pay. The top slice (= 30 % of it) is what
 * the skattereduktion used to give back — drawn struck-through to show it has
 * vanished from 2026. The number called out is the user's own lost deduction.
 */
export function CostDiagram({ className }: { className?: string }) {
  const { result } = useLoanSnapshot();
  const interest = result.currentAnnualInterest;
  const lost = result.lostDeductionPerYear;

  // Geometry: one tall bar, full height = annual interest. The refund slice is
  // the top `lost/interest` fraction (≈30 %). Guard the empty state.
  const H = 150;
  const barTop = 24;
  const barX = 70;
  const barW = 120;
  const refundFrac = interest > 0 ? lost / interest : 0;
  const refundH = (H - barTop) * refundFrac;
  const paidH = H - barTop - refundH;

  return (
    <svg
      viewBox="0 0 380 200"
      className={className}
      role="img"
      aria-label={`Av din räntekostnad på ${formatSek(interest)} per år fick du tidigare tillbaka ${formatSek(lost)} via ränteavdraget. Från 2026 är den summan noll.`}
    >
      {/* paid portion — what stays your cost (teal, solid) */}
      <rect x={barX} y={barTop + refundH} width={barW} height={Math.max(0, paidH)} rx="4" fill={TEAL} />
      {/* refund portion — what used to come back, now gone (clay, faded + struck) */}
      <rect x={barX} y={barTop} width={barW} height={Math.max(0, refundH)} rx="4" fill={CLAY} opacity={0.28} />
      {refundH > 10 && (
        <line
          x1={barX + 8}
          y1={barTop + refundH / 2}
          x2={barX + barW - 8}
          y2={barTop + refundH / 2}
          stroke={CLAY}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}

      {/* refund callout (right) */}
      <line x1={barX + barW} y1={barTop + refundH / 2} x2={barX + barW + 18} y2={barTop + refundH / 2} stroke={HAIRLINE} strokeWidth="1.5" />
      <text x={barX + barW + 24} y={barTop + refundH / 2 - 4} fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700" fill={CLAY}>
        {formatSek(lost)}/år
      </text>
      <text x={barX + barW + 24} y={barTop + refundH / 2 + 12} fontFamily="Inter, sans-serif" fontSize="10.5" fill={MUTED}>
        försvinner 2026
      </text>

      {/* paid callout (right) */}
      <text x={barX + barW + 24} y={barTop + refundH + paidH / 2 - 4} fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700" fill={TEAL}>
        {formatSek(Math.max(0, interest - lost))}/år
      </text>
      <text x={barX + barW + 24} y={barTop + refundH + paidH / 2 + 12} fontFamily="Inter, sans-serif" fontSize="10.5" fill={MUTED}>
        du betalar ändå
      </text>

      {/* total label (left) */}
      <text x={barX - 12} y={barTop + 4} textAnchor="end" fontFamily="Inter, sans-serif" fontSize="11" fill={MUTED}>
        Ränta/år
      </text>
      <text x={barX - 12} y={barTop + 18} textAnchor="end" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700" fill={MUTED}>
        {formatSek(interest)}
      </text>

      <line x1={barX - 4} y1={H} x2={300} y2={H} stroke={HAIRLINE} strokeWidth="2" />
    </svg>
  );
}

/**
 * Today's annual interest vs consolidated — in kr.
 * Tall clay bar = interest you pay now; short teal bar = interest at the target
 * rate. Bar height = money (what people read), and the gap is the saving.
 */
export function ConsolidationDiagram({ className }: { className?: string }) {
  const { result, targetRate } = useLoanSnapshot();
  const now = result.currentAnnualInterest;
  const after = result.consolidatedAnnualInterest;
  const saving = Math.max(0, result.annualInterestSaving);

  const baseY = 150;
  const top = 30;
  const maxH = baseY - top;
  const max = Math.max(now, after, 1);
  const nowH = (now / max) * maxH;
  const afterH = (after / max) * maxH;

  return (
    <svg
      viewBox="0 0 420 188"
      className={className}
      role="img"
      aria-label={`Din räntekostnad är ${formatSek(now)} per år idag. Med ett samlingslån på ${formatPct(targetRate)} blir den ${formatSek(after)} per år – en minskning på ${formatSek(saving)} per år.`}
    >
      {/* today */}
      <rect x={70} y={baseY - nowH} width={70} height={nowH} rx="5" fill={CLAY} opacity={0.85} />
      <text x={105} y={baseY - nowH - 8} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="12.5" fill={CLAY}>
        {formatSek(now)}
      </text>
      <text x={105} y={baseY + 18} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fill={MUTED}>
        idag · {formatPct(result.weightedCurrentRate)}
      </text>

      {/* arrow */}
      <g stroke={MUTED} strokeWidth="2.5" fill="none">
        <path d="M180 95 H250" strokeLinecap="round" />
        <path d="M242 87 L250 95 L242 103" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* consolidated */}
      <rect x={290} y={baseY - afterH} width={70} height={afterH} rx="5" fill={TEAL} />
      <text x={325} y={baseY - afterH - 8} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="12.5" fill={TEAL}>
        {formatSek(after)}
      </text>
      <text x={325} y={baseY + 18} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fill={MUTED}>
        samlat · {formatPct(targetRate)}
      </text>

      {/* saving callout above the arrow */}
      {saving > 0 && (
        <text x={215} y={70} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700" fill={GOLD}>
          −{formatSek(saving)}/år
        </text>
      )}

      <line x1={40} y1={baseY} x2={390} y2={baseY} stroke={HAIRLINE} strokeWidth="2" />
    </svg>
  );
}
