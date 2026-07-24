import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ContentPage } from "../components/ContentPage";
import { CoverageComparison } from "../components/CoverageComparison";
import { ProviderTable } from "../components/ProviderTable";
import { Faq } from "../components/Faq";
import { generalFaq } from "../config/content";
import { siteConfig } from "../config/site";

export default function JamforPage() {
  return (
    <ContentPage
      path="/jamfor"
      title={`Jämför bilförsäkringar 2026 – priser sida vid sida | ${siteConfig.brand}`}
      description="Jämför bilförsäkringar från Sveriges största bolag sida vid sida. Se vad som ingår i trafik-, halv- och helförsäkring och hitta billigast för din bil."
      h1="Jämför bilförsäkringar 2026"
      intro="Priset på bilförsäkring kan skilja flera tusen kronor per år mellan bolagen — för exakt samma bil och förare. Här jämför du nivåer och bolag, och får ditt riktiga pris genom att ange registreringsnumret."
      crumbs={[
        { name: "Hem", href: "/" },
        { name: "Jämför försäkringar", href: "/jamfor" },
      ]}
      faq={generalFaq}
    >
      <div className="space-y-14">
        <section>
          <h2 className="mb-5 font-display text-2xl font-bold text-foreground">
            Vad ingår i de olika nivåerna?
          </h2>
          <CoverageComparison />
        </section>

        <section>
          <h2 className="mb-5 font-display text-2xl font-bold text-foreground">
            Bolag vi jämför
          </h2>
          <ProviderTable linkToCompany />
        </section>

        <section className="rounded-[var(--radius)] bg-[var(--color-secondary)] p-6 text-center">
          <h2 className="font-display text-xl font-bold text-foreground">
            Redo att se ditt pris?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-[var(--color-text-muted)]">
            Det tar under en minut. Ange registreringsnumret så hämtar vi priser för
            just din bil från flera bolag samtidigt.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Jämför priser nu <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            Vill du veta hur du hittar{" "}
            <Link
              to="/basta-bilforsakring-2026"
              className="font-semibold text-[var(--color-primary)] hover:underline"
            >
              billigaste och bästa bilförsäkringen 2026
            </Link>
            ?
          </p>
        </section>

        <Faq items={generalFaq} title="Vanliga frågor" />
      </div>
    </ContentPage>
  );
}
