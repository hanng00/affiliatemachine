import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ContentPage } from "../components/ContentPage";
import { Faq } from "../components/Faq";
import { firstTimeFaq } from "../config/content";
import { siteConfig } from "../config/site";

/**
 * EXPERIMENT cluster (see docs/JOURNAL.md). There is currently NO GSC demand
 * signal for first-time / young-driver intent — this page exists to generate one.
 * Its own URL path keeps the GSC trend cleanly attributable at the 2-week review:
 * if it earns impressions on "bilförsäkring ung förare" etc., the niche is real.
 */
export default function ForstagangsbilPage() {
  return (
    <ContentPage
      path="/forstagangsbil"
      title={`Bilförsäkring för förstagångsbilägare & unga förare 2026 | ${siteConfig.brand}`}
      description="Första bilen eller ung förare? Så fungerar bilförsäkring för nybörjare, varför priset är högre och konkreta sätt att sänka premien. Jämför priser gratis."
      h1="Bilförsäkring för förstagångsbilägare och unga förare"
      intro="Din första bilförsäkring är ofta den dyraste du kommer att ha — men också den där du kan spara mest på att jämföra. Här förklarar vi varför, och vad du kan göra åt det."
      crumbs={[
        { name: "Hem", href: "/" },
        { name: "Guide", href: "/guide" },
        { name: "Förstagångsbilägare", href: "/forstagangsbil" },
      ]}
      faq={firstTimeFaq}
    >
      <div className="space-y-12">
        <section className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="font-display text-xl font-bold text-foreground">
            5 sätt att sänka priset som ung förare
          </h2>
          <ul className="mt-4 space-y-3">
            {[
              "Välj en billigare, mindre motorstark bil — motorstyrka driver premien.",
              "Ange en realistisk, låg körsträcka om du kör lite.",
              "Höj självrisken om du har en buffert för en eventuell skada.",
              "Samla dina försäkringar i samma bolag för samlingsrabatt.",
              "Jämför alltid flera bolag — spannet är som störst för unga.",
            ].map((tip, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-[var(--color-text-muted)]">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[var(--radius)] bg-[var(--color-secondary)] p-6 text-center">
          <h2 className="font-display text-xl font-bold text-foreground">
            Se ditt pris som ung förare
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-[var(--color-text-muted)]">
            Eftersom skillnaden mellan bolag är så stor för unga förare lönar sig
            jämförelse mest just för dig. Ange registreringsnumret för att börja.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Jämför priser nu <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <Faq items={firstTimeFaq} title="Vanliga frågor för nybörjare" />
      </div>
    </ContentPage>
  );
}
