import { Outlet, Link, useLocation } from "react-router-dom";
import { usePageView, ConsentBanner } from "@affiliate/analytics";
import { siteConfig } from "@/config/site";
import { useState } from "react";

function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <g stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="16" r="3.4" />
            <circle cx="17" cy="16" r="3.4" />
            <path d="M7 16 L11 11 L15.5 11 M11 11 L14 16 M15.5 11 L17 16" />
          </g>
          <path d="M13 6 L10 11.5 L12.4 11.5 L11 15 L15 9.5 L12.6 9.5 Z" fill="#FBBF24" />
        </svg>
      </span>
      <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
        Bästa<span className="text-primary">elcykeln</span>
      </span>
    </Link>
  );
}

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <BrandMark />

          <nav className="hidden items-center gap-1 md:flex">
            {siteConfig.navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/#kalkylator"
              className="ml-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
            >
              Räkna ut din besparing
            </a>
          </nav>

          <button
            type="button"
            aria-label="Meny"
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {siteConfig.navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <BrandMark />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Oberoende kalkylator för förmånscykel och elcykel. Räkna ut vad en elcykel
              kostar via bruttolöneavdrag jämfört med kontantköp – och jämför sedan
              leverantörer när du är redo.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">
              På sidan
            </h3>
            <ul className="mt-4 space-y-2">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">
              Transparens
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Sidan innehåller annonslänkar (annonssamarbete). Vi kan få ersättning om du
              går vidare via våra länkar – det kostar dig inget extra. Beräkningarna är
              uppskattningar enligt Skatteverkets metod; din arbetsgivares villkor och den
              bindande offerten kommer från leverantören.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {siteConfig.name}
            </p>
            <p className="text-xs text-muted-foreground">
              Beräkningar baserade på publika regler (Skatteverket, Riksgälden).
              Uppdaterad juni 2026.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  usePageView(pathname, typeof document !== "undefined" ? document.title : siteConfig.title);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ConsentBanner />
    </div>
  );
}
