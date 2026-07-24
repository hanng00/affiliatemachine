import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ContentPage } from "../components/ContentPage";
import { CoverageComparison } from "../components/CoverageComparison";
import { Faq } from "../components/Faq";
import { generalFaq, coverageTypes } from "../config/content";
import { siteConfig } from "../config/site";

export default function GuidePage() {
  return (
    <ContentPage
      path="/guide"
      title={`Guide till bilförsäkring 2026 – allt du behöver veta | ${siteConfig.brand}`}
      description="Komplett guide till bilförsäkring: skillnaden mellan trafik-, halv- och helförsäkring, vad som påverkar priset och hur du sänker kostnaden. Uppdaterad 2026."
      h1="Guide till bilförsäkring"
      intro="Allt du behöver veta innan du tecknar eller byter bilförsäkring — utan krångel. Vi går igenom nivåerna, vad som styr priset och de vanligaste sätten att betala mindre."
      crumbs={[
        { name: "Hem", href: "/" },
        { name: "Guide", href: "/guide" },
      ]}
      faq={generalFaq}
    >
      <div className="space-y-12">
        <section className="space-y-6">
          {coverageTypes.map((c) => (
            <div
              key={c.type}
              className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] p-6"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)]">
                  <c.icon className="h-5 w-5" />
                </span>
                <h2 className="font-display text-xl font-bold text-foreground">{c.name}</h2>
              </div>
              <p className="mt-3 text-[var(--color-text-muted)]">{c.description}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="mb-5 font-display text-2xl font-bold text-foreground">
            Jämförelse av skydden
          </h2>
          <CoverageComparison />
        </section>

        <section className="rounded-[var(--radius)] bg-[var(--color-secondary)] p-6">
          <h2 className="font-display text-xl font-bold text-foreground">
            Är du förstagångsbilägare eller ung förare?
          </h2>
          <p className="mt-2 text-[var(--color-text-muted)]">
            Priserna är som högst — och skillnaden mellan bolag som störst — för dig.
            Vi har en egen guide med konkreta sätt att sänka premien.
          </p>
          <Link
            to="/forstagangsbil"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            Läs guiden för förstagångsbilägare <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <Faq items={generalFaq} title="Vanliga frågor" />
      </div>
    </ContentPage>
  );
}
