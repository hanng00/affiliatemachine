import { useState } from "react";
import { formatSek } from "@affiliate/solar-calculator";

interface SavingsChartProps {
  annualKwh: number;
  annualSavings: number;
  electricityPrice: number;
  sellPrice: number;
  selfConsumptionShare: number;
}

export function SavingsChart({
  annualKwh,
  annualSavings,
  electricityPrice,
  sellPrice,
  selfConsumptionShare,
}: SavingsChartProps) {
  const [hovered, setHovered] = useState<"self" | "sold" | null>(null);

  const selfUsedKwh = Math.round(annualKwh * selfConsumptionShare);
  const soldKwh = annualKwh - selfUsedKwh;
  const selfSavings = Math.round(selfUsedKwh * electricityPrice);
  const soldEarnings = Math.round(soldKwh * sellPrice);
  const withoutSolar = Math.round(annualKwh * electricityPrice);
  const withSolar = withoutSolar - annualSavings;

  const savingsPercent = Math.round((annualSavings / withoutSolar) * 100);
  const selfPercent = Math.round((selfSavings / withoutSolar) * 100);
  const soldPercent = Math.round((soldEarnings / withoutSolar) * 100);

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      {/* Title */}
      <div className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        Din elkostnad per år
      </div>

      {/* Without solar */}
      <div className="mb-3">
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-muted-foreground">Utan solceller</span>
          <span className="font-medium text-foreground">{formatSek(withoutSolar)}/år</span>
        </div>
        <div className="mt-1.5 h-7 w-full overflow-hidden rounded-lg bg-red-100">
          <div className="flex h-full items-center justify-center bg-red-400/80 text-[10px] font-medium text-white">
            Köper all el från nätet
          </div>
        </div>
      </div>

      {/* With solar */}
      <div className="mb-3">
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-muted-foreground">Med solceller</span>
          <span className="font-medium text-foreground">{formatSek(withSolar)}/år</span>
        </div>
        <div className="mt-1.5 flex h-7 w-full overflow-hidden rounded-lg bg-muted">
          <div
            className="flex h-full items-center justify-center bg-emerald-500 text-[10px] font-medium text-white transition-opacity hover:opacity-80"
            style={{ width: `${selfPercent}%` }}
            onMouseEnter={() => setHovered("self")}
            onMouseLeave={() => setHovered(null)}
            role="button"
            tabIndex={0}
          >
            {selfPercent > 15 && "Egenanvänd"}
          </div>
          <div
            className="flex h-full items-center justify-center bg-emerald-300 text-[10px] font-medium text-emerald-900 transition-opacity hover:opacity-80"
            style={{ width: `${soldPercent}%` }}
            onMouseEnter={() => setHovered("sold")}
            onMouseLeave={() => setHovered(null)}
            role="button"
            tabIndex={0}
          >
            {soldPercent > 10 && "Såld"}
          </div>
        </div>
      </div>

      {/* Savings highlight */}
      <div className="flex items-baseline justify-between border-t border-border pt-2">
        <span className="text-xs font-medium text-emerald-600">Du sparar</span>
        <span className="font-display text-lg font-extrabold text-foreground">
          {formatSek(annualSavings)}/år
        </span>
      </div>

      {/* Hover tooltip — progressive disclosure */}
      {hovered && (
        <div className="mt-2 rounded-lg bg-muted/70 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
          {hovered === "self" ? (
            <>
              <span className="font-medium text-foreground">Egenanvänd el</span> — du slipper köpa {selfUsedKwh.toLocaleString("sv-SE")} kWh
              från nätet.
              <br />
              {selfUsedKwh.toLocaleString("sv-SE")} kWh × {electricityPrice.toFixed(2)} kr = <span className="font-medium text-foreground">{formatSek(selfSavings)}</span>
            </>
          ) : (
            <>
              <span className="font-medium text-foreground">Såld överskottsel</span> — du säljer {soldKwh.toLocaleString("sv-SE")} kWh
              till nätet.
              <br />
              {soldKwh.toLocaleString("sv-SE")} kWh × {sellPrice.toFixed(2)} kr = <span className="font-medium text-foreground">{formatSek(soldEarnings)}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
