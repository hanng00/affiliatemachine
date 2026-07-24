import { Link } from "react-router-dom";
import { ArrowRight, TrendingDown } from "lucide-react";
import { ContentPage } from "../components/ContentPage";
import { ProviderTable } from "../components/ProviderTable";
import { Faq } from "../components/Faq";
import { generalFaq } from "../config/content";
import { siteConfig } from "../config/site";

/**
 * Long-tail wedge page. GSC shows we already rank ~p19 for
 * "billigaste bilförsäkring sverige 2026" and ~p50 for "bästa bilförsäkringen 2026"
 * (see docs/JOURNAL.md). This page targets that fresh, specific intent head-on.
 */
export default function Basta2026Page() {
  return (
    <ContentPage
      path="/basta-bilforsakring-2026"
      title={`Billigaste & bästa bilförsäkringen 2026 – så jämför du | ${siteConfig.brand}`}
      description="Billigaste bilförsäkringen i Sverige 2026? Så hittar du bästa bilförsäkringen för din bil — jämför priser och nivåer från de största bolagen, gratis."
      h1="Billigaste och bästa bilförsäkringen 2026"
      intro="Det finns ingen försäkring som är billigast för alla — priset beror på din bil, ålder, ort och körsträcka. Men du kan nästan alltid hitta ett bättre pris genom att jämföra flera bolag. Så här gör du 2026."
      crumbs={[
        { name: "Hem", href: "/" },
        { name: "Bästa bilförsäkringen 2026", href: "/basta-bilforsakring-2026" },
      ]}
      faq={generalFaq}
    >
      <div className="space-y-12">
        <section className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
            <TrendingDown className="h-5 w-5 text-[var(--color-success)]" />
            Så hittar du billigast 2026
          </h2>
          <ol className="mt-4 space-y-3">
            {[
              "Jämför flera bolag samtidigt — skillnaden för samma bil är ofta störst där du minst anar.",
              "Välj rätt nivå: betala inte för helförsäkring på en gammal bil med lågt värde.",
              "Se över självrisken — en högre självrisk sänker månadspremien.",
              "Jämför inför huvudförfallodagen, då du kan byta utan kostnad.",
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-[var(--color-text-muted)]">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="mb-5 font-display text-2xl font-bold text-foreground">
            Bolagen att jämföra 2026
          </h2>
          <ProviderTable linkToCompany />
          <p className="mt-6 text-[var(--color-text-muted)]">
            Se en fullständig{" "}
            <Link
              to="/jamfor"
              className="font-semibold text-[var(--color-primary)] hover:underline"
            >
              jämförelse av bilförsäkringar
            </Link>{" "}
            sida vid sida, eller läs vår{" "}
            <Link
              to="/guide"
              className="font-semibold text-[var(--color-primary)] hover:underline"
            >
              kompletta guide till bilförsäkring
            </Link>{" "}
            om du vill förstå nivåerna innan du väljer.
          </p>
        </section>

        <section className="rounded-[var(--radius)] bg-[var(--color-secondary)] p-6 text-center">
          <h2 className="font-display text-xl font-bold text-foreground">
            Se din billigaste bilförsäkring 2026
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-[var(--color-text-muted)]">
            Ange registreringsnumret så hämtar vi aktuella priser för din bil från
            flera bolag — kostnadsfritt.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Jämför priser nu <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <Faq items={generalFaq} title="Vanliga frågor" />
      </div>
    </ContentPage>
  );
}
