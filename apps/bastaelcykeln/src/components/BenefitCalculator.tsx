import { useMemo, useState } from "react";
import {
  calculateBenefit,
  defaultAssumptions,
  marginalTaxLevels,
  termsMonths,
  formatSek,
  formatPercent,
} from "@affiliate/bike-benefit";
import { useTrackClick, useTrackActivation, buildSubId, appendSubId } from "@affiliate/analytics";
import { siteConfig } from "@/config/site";
import { getLeasingPartner, getRetailPartner } from "@/config/affiliates";

const PRICE_MIN = 8_000;
const PRICE_MAX = 60_000;

/**
 * The interactive förmånscykel calculator. Client-only by virtue of being lazy-
 * loaded behind a prerendered placeholder, so it never runs during SSR and the
 * page still ranks as static HTML.
 */
export default function BenefitCalculator() {
  const [bikePrice, setBikePrice] = useState(25_000);
  const [termMonths, setTermMonths] = useState<(typeof termsMonths)[number]>(36);
  const [taxId, setTaxId] = useState<(typeof marginalTaxLevels)[number]["id"]>("mid");

  const marginalTaxRate =
    marginalTaxLevels.find((t) => t.id === taxId)?.rate ?? 0.5;

  const result = useMemo(
    () => calculateBenefit({ bikePrice, termMonths, marginalTaxRate }),
    [bikePrice, termMonths, marginalTaxRate]
  );

  // Activation = first edit of the seeded scenario → user's own net-cost figure.
  const trackActivation = useTrackActivation("benefit_calculated");
  const activate = () => trackActivation(result.savingTotal);

  const leasing = getLeasingPartner();
  const subId = buildSubId(siteConfig.slug, "results_cta", leasing.id);
  const href = appendSubId(leasing.trackingUrl, subId);
  const trackLeasing = useTrackClick({
    linkId: leasing.id,
    program: "adtraction",
    placement: "results_cta",
    destinationUrl: href,
    subId,
  });

  const retail = getRetailPartner();
  const retailSubId = buildSubId(siteConfig.slug, "results_retail", retail.id);
  const retailHref = appendSubId(retail.trackingUrl, retailSubId);
  const trackRetail = useTrackClick({
    linkId: retail.id,
    program: "adtraction",
    placement: "results_retail",
    destinationUrl: retailHref,
    subId: retailSubId,
  });

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* Inputs — 2/5 on desktop */}
      <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
        <h3 className="font-display text-base font-bold text-foreground">Dina uppgifter</h3>

        <label htmlFor="price" className="mt-4 block text-sm font-medium text-foreground">
          Cykelns pris
          <span className="ml-2 font-bold text-primary">{formatSek(bikePrice)}</span>
        </label>
        <input
          id="price"
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={500}
          value={bikePrice}
          onChange={(e) => {
            activate();
            setBikePrice(Number(e.target.value));
          }}
          className="mt-2 w-full accent-[var(--color-primary)]"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>{formatSek(PRICE_MIN)}</span>
          <span>{formatSek(PRICE_MAX)}</span>
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm font-medium text-foreground">Avtalslängd</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {termsMonths.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  activate();
                  setTermMonths(t);
                }}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                  termMonths === t
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40"
                }`}
              >
                {t} mån
              </button>
            ))}
          </div>
        </fieldset>

        <label htmlFor="tax" className="mt-5 block text-sm font-medium text-foreground">
          Din marginalskatt
        </label>
        <select
          id="tax"
          value={taxId}
          onChange={(e) => {
            activate();
            setTaxId(e.target.value as typeof taxId);
          }}
          className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          {marginalTaxLevels.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          Marginalskatten är skatten på din sista intjänade hundralapp. Tjänar du över
          brytpunkten (~53 600 kr/mån 2026) betalar du statlig skatt och sparar mer.
        </p>
      </div>

      {/* Results — 3/5 on desktop */}
      <div className="flex flex-col gap-3 lg:col-span-3">
        {/* Hero saving */}
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-primary">
            Din besparing mot kontantköp
          </div>
          <div className="mt-1 flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="font-display text-4xl font-extrabold text-foreground">
              {formatSek(result.savingTotal)}
            </span>
            <span className="pb-1 text-sm font-semibold text-primary">
              ≈ {formatPercent(result.savingShare)} billigare
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Över {termMonths} månader, jämfört med att köpa samma cykel för beskattade pengar.
          </p>
        </div>

        {/* Key numbers */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="text-[11px] text-muted-foreground">Nettokostnad / mån</div>
            <div className="mt-0.5 text-base font-bold text-foreground">
              {formatSek(result.netCostMonthly)}
            </div>
            <div className="text-[10px] text-muted-foreground">
              brutto {formatSek(result.grossDeductionMonthly)}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="text-[11px] text-muted-foreground">Total nettokostnad</div>
            <div className="mt-0.5 text-base font-bold text-foreground">
              {formatSek(result.netCostTotal)}
            </div>
            <div className="text-[10px] text-muted-foreground">
              kontant {formatSek(result.cashCostTotal)}
            </div>
          </div>
          <div className="col-span-2 rounded-xl border border-border bg-card p-3 sm:col-span-1">
            <div className="text-[11px] text-muted-foreground">Förmånsvärde / år</div>
            <div className="mt-0.5 text-base font-bold text-foreground">
              {formatSek(result.annualBenefitValueGross)}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {result.annualBenefitValueTaxable > 0
                ? `skattepliktigt ${formatSek(result.annualBenefitValueTaxable)}`
                : "skattefritt (under 3 000 kr)"}
            </div>
          </div>
        </div>

        {/* CTA — leasing */}
        <div className="rounded-2xl border border-primary/30 bg-card p-4">
          <p className="text-xs leading-relaxed text-muted-foreground">{leasing.description}</p>
          <a
            href={href}
            onClick={trackLeasing}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="mt-3 block rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
          >
            Jämför förmånscykel-leverantörer →
          </a>
          <a
            href={retailHref}
            onClick={trackRetail}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="mt-2 block rounded-xl border border-border px-4 py-2.5 text-center text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            …eller köp elcykeln privat
          </a>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Annonssamarbete · kostnadsfritt och utan köpkrav
          </p>
        </div>

        <p className="px-1 text-[11px] leading-relaxed text-muted-foreground">
          Uppskattning enligt Skatteverkets metod (värdeminskning 20 % + kapitalkostnad
          3,55 % för 2026, skattefritt upp till 3 000 kr/år). Modellen tar inte hänsyn till
          eventuell påverkan på SGI/pension av en lägre bruttolön. Din arbetsgivares villkor
          och den bindande offerten kommer från leverantören.
        </p>
      </div>
    </div>
  );
}
