import { ContentPage } from "../components/ContentPage";
import { siteConfig } from "../config/site";

/** Prose block used by the static info/legal pages. */
function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4 leading-relaxed text-[var(--color-text-muted)] [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground">
      {children}
    </div>
  );
}

export function OmOssPage() {
  return (
    <ContentPage
      path="/om-oss"
      title={`Om oss | ${siteConfig.brand}`}
      description="Om billigastebilforsakringen.se — en oberoende tjänst för att jämföra bilförsäkringar i Sverige."
      h1="Om oss"
      intro="Vi gör det enkelt att jämföra bilförsäkringar och hitta ett bättre pris."
      crumbs={[
        { name: "Hem", href: "/" },
        { name: "Om oss", href: "/om-oss" },
      ]}
    >
      <Prose>
        <p>
          {siteConfig.name} är en oberoende jämförelsetjänst för bilförsäkringar i
          Sverige. Vi hämtar riktiga priser från flera försäkringsbolag baserat på
          ditt registreringsnummer, så att du snabbt kan se vad just din bil kostar
          att försäkra hos olika bolag.
        </p>
        <h2>Så tjänar vi pengar</h2>
        <p>
          Tjänsten är gratis för dig. Vi kan få provision från försäkringsbolagen när
          du tecknar en försäkring via våra länkar (annonssamarbete). Det påverkar
          aldrig vilka priser du ser eller hur jämförelsen sorteras — den sorteras
          efter pris, lägst först.
        </p>
        <h2>Oberoende och transparens</h2>
        <p>
          Vi presenterar priser och villkor så objektivt vi kan och uppfinner aldrig
          siffror. Vägledande prisspann är tydligt märkta som just vägledande — ditt
          faktiska pris får du alltid via den personliga jämförelsen.
        </p>
      </Prose>
    </ContentPage>
  );
}

export function KontaktPage() {
  return (
    <ContentPage
      path="/kontakt"
      title={`Kontakt | ${siteConfig.brand}`}
      description="Kontakta billigastebilforsakringen.se vid frågor om tjänsten eller din jämförelse."
      h1="Kontakt"
      intro="Har du en fråga om tjänsten? Hör av dig."
      crumbs={[
        { name: "Hem", href: "/" },
        { name: "Kontakt", href: "/kontakt" },
      ]}
    >
      <Prose>
        <p>
          För frågor om tjänsten, eller om innehållet på sidan, mejla oss på{" "}
          <a
            href={`mailto:info@${siteConfig.domain}`}
            className="font-medium text-[var(--color-primary)] hover:underline"
          >
            info@{siteConfig.domain}
          </a>
          .
        </p>
        <p>
          Observera att vi är en jämförelsetjänst och inte ett försäkringsbolag. Frågor
          om en specifik försäkring, betalning eller skada hanteras av ditt
          försäkringsbolag.
        </p>
      </Prose>
    </ContentPage>
  );
}

export function IntegritetspolicyPage() {
  return (
    <ContentPage
      path="/integritetspolicy"
      title={`Integritetspolicy | ${siteConfig.brand}`}
      description="Så behandlar billigastebilforsakringen.se personuppgifter och cookies enligt GDPR."
      h1="Integritetspolicy"
      intro="Hur vi behandlar dina personuppgifter och använder cookies."
      crumbs={[
        { name: "Hem", href: "/" },
        { name: "Integritetspolicy", href: "/integritetspolicy" },
      ]}
    >
      <Prose>
        <h2>Uppgifter vi behandlar</h2>
        <p>
          När du gör en jämförelse anger du registreringsnummer och personnummer. Dessa
          används enbart för att hämta personliga prisuppgifter från försäkringsbolagen
          för din förfrågan. Uppgifterna skickas krypterat.
        </p>
        <h2>Cookies och analys</h2>
        <p>
          Vi använder analysverktyg för att förstå hur sidan används. Analyscookies
          sätts först efter att du har gett ditt samtycke i cookie-rutan, i enlighet med
          GDPR och svensk lag. Du kan när som helst ändra ditt val.
        </p>
        <h2>Dina rättigheter</h2>
        <p>
          Du har rätt att begära information om, samt radering av, de personuppgifter vi
          behandlar om dig. Kontakta oss på{" "}
          <a
            href={`mailto:info@${siteConfig.domain}`}
            className="font-medium text-[var(--color-primary)] hover:underline"
          >
            info@{siteConfig.domain}
          </a>{" "}
          så hjälper vi dig.
        </p>
        <h2>Annonssamarbete</h2>
        <p>
          Sidan innehåller annonslänkar. Vi kan få provision när du tecknar en försäkring
          via våra länkar, utan extra kostnad för dig.
        </p>
      </Prose>
    </ContentPage>
  );
}
