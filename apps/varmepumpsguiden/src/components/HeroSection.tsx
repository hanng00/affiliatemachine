import { lazy, Suspense, useCallback, useState } from "react";
import { Calculator, type CalculatorState } from "./Calculator";
import type { SystemId } from "@affiliate/heatpump-calculator";

const HouseScene = lazy(() => import("./HouseScene"));

interface HeroSectionProps {
  focusSystem?: SystemId;
  locationLabel?: string;
  placement?: string;
}

/**
 * The redesigned hero: 3D house (left/top) + calculator (right/bottom).
 * The house reacts to calculator state — area scales it, system swaps the
 * heat pump unit, savings drive the warm glow. The 3D is lazy-loaded so it
 * never blocks prerender or hurts LCP.
 */
export function HeroSection({ focusSystem, locationLabel, placement = "hero" }: HeroSectionProps) {
  const [calcState, setCalcState] = useState<CalculatorState>({
    areaSqm: 140,
    bestSystem: focusSystem ?? "bergvarme",
    savingsPerYear: 24000,
  });

  const handleStateChange = useCallback((state: CalculatorState) => {
    setCalcState(state);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1a2a3a] via-[#1f3344] to-background">
      {/* Ambient glow behind the scene */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(255,136,68,0.15),transparent_60%)]" />

      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Header text */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-white md:text-4xl">
            Vad kostar en värmepump för{" "}
            <span className="text-ember">ditt</span> hus?
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70 md:text-base">
            Dra i reglaget, se hur ditt hus värms upp — och få en uppskattning av
            investering, ROT-avdrag, driftskostnad och besparing.
          </p>
        </div>

        {/* Two-column layout: house + calculator */}
        <div className="mx-auto mt-6 grid max-w-6xl gap-6 lg:grid-cols-2 lg:items-start">
          {/* 3D House — lazy loaded, client only */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#1a2a3a] shadow-2xl lg:aspect-square lg:sticky lg:top-24">
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-ember" />
                </div>
              }
            >
              <HouseScene
                areaSqm={calcState.areaSqm}
                system={focusSystem ?? calcState.bestSystem}
                savingsPerYear={calcState.savingsPerYear}
              />
            </Suspense>

            {/* Overlay stats on the scene */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between gap-2">
              <SceneStat label="Boyta" value={`${calcState.areaSqm} m²`} />
              <SceneStat
                label="Besparing/år"
                value={`${Math.round(calcState.savingsPerYear / 1000)}k kr`}
                accent
              />
            </div>
          </div>

          {/* Calculator */}
          <div className="lg:pt-0">
            <Calculator
              focusSystem={focusSystem}
              locationLabel={locationLabel}
              placement={placement}
              onStateChange={handleStateChange}
            />
          </div>
        </div>
      </div>

      {/* Transition gradient to content below */}
      <div className="h-16 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}

function SceneStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl bg-black/40 px-3 py-2 backdrop-blur-sm">
      <div className="text-[10px] uppercase tracking-wide text-white/60">{label}</div>
      <div className={`font-display text-sm font-bold ${accent ? "text-grass" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}
