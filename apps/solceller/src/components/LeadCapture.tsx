import { useState } from "react";
import { apiHostname } from "@affiliate/sites";
import { siteConfig } from "@/config/site";

interface LeadCaptureProps {
  roofAreaSqm: number;
  kwp: number;
  annualSavings: number;
  netCost: number;
  region: string;
  address?: string;
  source: "villa" | "brf";
  onSuccess: () => void;
  children: React.ReactNode;
}

export function LeadCapture({
  roofAreaSqm,
  kwp,
  annualSavings,
  netCost,
  region,
  address,
  source,
  onSuccess,
  children,
}: LeadCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Ange en giltig e-postadress");
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
      onSuccess();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Något gick fel. Försök igen.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-grass/30 bg-grass/5 p-4 text-center">
        <div className="text-2xl">✓</div>
        <p className="mt-2 font-semibold text-foreground">Tack! Vi har sparat din förfrågan.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Du får ett mejl när vi kan koppla dig med installatörer i ditt område.
        </p>
        {children}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
      <p className="text-xs leading-relaxed text-muted-foreground">
        Få upp till 4 kostnadsfria offerter från kvalitetssäkrade solcellsinstallatörer i ditt område. Du väljer själv om du vill gå vidare.
      </p>

      <div className="mt-3">
        <label htmlFor="lead-email" className="sr-only">
          E-postadress
        </label>
        <input
          id="lead-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Din e-postadress"
          disabled={status === "submitting"}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring disabled:opacity-60"
        />
      </div>

      {status === "error" && errorMessage && (
        <p className="mt-2 text-xs text-destructive">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-3 block w-full rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-60"
      >
        {status === "submitting" ? "Skickar…" : `Få offert för ${kwp} kWp →`}
      </button>

      <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
        Annonssamarbete · kostnadsfritt och utan köpkrav
      </p>
    </form>
  );
}
