import { useEffect, useRef, useState } from "react";
import { apiHostname } from "@affiliate/sites";
import { trackLead } from "@affiliate/analytics";
import { formatSek } from "@affiliate/solar-calculator";
import { siteConfig } from "@/config/site";

/**
 * Real, sourced social proof only. GA4 `activation` (roof_estimated) users for
 * 2026-08-29 → 2026-11-27 = 182, and GA4 only counts visitors who accepted
 * cookies, so this understates. Update from `ops/pull-site-insights.ts`.
 */
const ESTIMATES_LAST_90_DAYS = 180;

const timelines = [
  { id: "3m", label: "Inom 3 månader" },
  { id: "12m", label: "Inom ett år" },
  { id: "curious", label: "Vill bara veta mer" },
] as const;
type Timeline = (typeof timelines)[number]["id"];

interface LeadCaptureProps {
  roofAreaSqm: number;
  kwp: number;
  annualSavings: number;
  netCost: number;
  region: string;
  address?: string;
  source: "villa" | "brf";
}

/**
 * Two-step lead form under the estimate.
 *
 * - Goal-gradient: framed as the last step of the flow the visitor is already in.
 * - Foot-in-the-door: step 1 is a single tap (timeline), step 2 asks for contact.
 * - Hick's law: one primary action per step; phone is optional.
 * - Fitts's law: full-width tap targets, plus a sticky mobile bar when the form is
 *   off-screen (2/3 of sessions are mobile and the form sits below the map there).
 * - Peak-end: the success state recaps the visitor's own numbers.
 *
 * Copy is deliberately limited to what we do today: Hannes follows up by hand.
 * No partner names, installer counts or "sent to installers" claims until a
 * real buyer exists (marknadsföringslagen + GDPR purpose limitation).
 */
export function LeadCapture({
  roofAreaSqm,
  kwp,
  annualSavings,
  netCost,
  region,
  address,
  source,
}: LeadCaptureProps) {
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function chooseTimeline(id: Timeline) {
    setTimeline(id);
    trackLead({ event: "lead_step", form: source, step: `timeline_${id}`, value: annualSavings });
    // Move focus straight to the next field (fewer taps, keyboard stays open on mobile).
    requestAnimationFrame(() => emailRef.current?.focus());
  }

  function scrollToForm() {
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    trackLead({ event: "lead_step", form: source, step: "sticky_cta_tap" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Ange en giltig e-postadress, t.ex. namn@exempel.se");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const apiUrl = import.meta.env.DEV
        ? "http://localhost:8787/lead"
        : `https://${apiHostname(siteConfig.domain)}/lead`;

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          phone: phone.trim() || undefined,
          timeline: timeline ?? undefined,
          roofAreaSqm,
          kwp,
          annualSavings,
          netCost,
          region,
          address,
          source,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error?.message || "Något gick fel");
      }

      setStatus("success");
      trackLead({ event: "generate_lead", form: source, value: annualSavings });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Något gick fel. Försök igen.");
    }
  }

  const savingsLine = `${kwp} kWp · ca ${formatSek(annualSavings)} per år i besparing`;

  if (status === "success") {
    return (
      <div ref={rootRef} className="rounded-2xl border-2 border-grass/40 bg-grass/5 p-5 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-grass text-2xl text-white">
          ✓
        </div>
        <p className="mt-3 font-display text-lg font-bold text-foreground">Tack! Vi har tagit emot din förfrågan.</p>
        <div className="mt-3 rounded-xl bg-card p-3 text-left text-sm">
          {address && <div className="truncate font-medium text-foreground">{address}</div>}
          <div className="text-muted-foreground">{savingsLine}</div>
          <div className="text-muted-foreground">Uppskattat pris efter grönt avdrag: {formatSek(netCost)}</div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Vi går igenom din kalkyl och hör av oss personligen till{" "}
          <span className="font-medium text-foreground">{email.trim()}</span>.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        ref={rootRef}
        id="offert"
        className="scroll-mt-24 rounded-2xl border-2 border-primary/40 bg-card p-4 shadow-lg shadow-primary/10 sm:p-5"
      >
        {/* Goal-gradient: the visitor is 3 of 4 steps in */}
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-primary">
          <span>Sista steget</span>
          <span className="text-muted-foreground">{timeline ? "2 av 2" : "1 av 2"}</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: timeline ? "90%" : "75%" }}
          />
        </div>

        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-foreground">
          Vill du gå vidare med en riktig offert?
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{savingsLine}</p>

        {!timeline ? (
          <fieldset className="mt-4">
            <legend className="text-sm font-semibold text-foreground">När funderar du på att installera?</legend>
            <div className="mt-2 grid gap-2">
              {timelines.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => chooseTimeline(t.id)}
                  className="flex min-h-12 w-full items-center justify-between rounded-xl border border-border bg-background px-4 text-left text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {t.label}
                  <span aria-hidden="true" className="text-primary">→</span>
                </button>
              ))}
            </div>
          </fieldset>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3" noValidate>
            <button
              type="button"
              onClick={() => setTimeline(null)}
              className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline"
            >
              ‹ {timelines.find((t) => t.id === timeline)?.label}
            </button>
            <div>
              <label htmlFor="lead-email" className="text-sm font-semibold text-foreground">
                Din e-post
              </label>
              <input
                ref={emailRef}
                id="lead-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="namn@exempel.se"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "submitting"}
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? "lead-error" : undefined}
                className="mt-1 min-h-12 w-full rounded-xl border border-input bg-background px-4 text-base outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
              />
            </div>
            <div>
              <label htmlFor="lead-phone" className="text-sm font-semibold text-foreground">
                Telefon <span className="font-normal text-muted-foreground">(valfritt, för snabbare svar)</span>
              </label>
              <input
                id="lead-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="070-123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={status === "submitting"}
                className="mt-1 min-h-12 w-full rounded-xl border border-input bg-background px-4 text-base outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
              />
            </div>
            {status === "error" && (
              <p id="lead-error" role="alert" className="text-sm text-destructive">
                {errorMessage}
              </p>
            )}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="min-h-12 w-full rounded-xl bg-primary px-5 text-base font-bold text-primary-foreground shadow-md transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
            >
              {status === "submitting" ? "Skickar…" : "Ja, hjälp mig med offert →"}
            </button>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Vi går igenom din kalkyl och hör av oss personligen. Dina uppgifter används bara för den här
              förfrågan och raderas efter 90 dagar.
            </p>
          </form>
        )}

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-foreground/80">
          <li>✓ Kostnadsfritt</li>
          <li>✓ Utan förpliktelser</li>
          <li>✓ Ingen spam</li>
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          ☀️ Över {ESTIMATES_LAST_90_DAYS} personer har räknat på sitt tak här de senaste tre månaderna.
        </p>
      </div>

      {/* Sticky mobile CTA while the form is off-screen */}
      {!inView && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={scrollToForm}
            className="flex min-h-12 w-full items-center justify-between rounded-xl bg-primary px-4 text-left text-primary-foreground"
          >
            <span className="text-sm">
              <span className="block text-[11px] opacity-90">Din besparing</span>
              <span className="font-bold">ca {formatSek(annualSavings)}/år</span>
            </span>
            <span className="text-sm font-bold">Få offert →</span>
          </button>
        </div>
      )}
    </>
  );
}
