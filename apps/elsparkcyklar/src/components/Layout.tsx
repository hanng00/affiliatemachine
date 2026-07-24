import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { usePageView, ConsentBanner } from "@affiliate/analytics";
import { siteConfig } from "../config/site";

function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)] shadow-sm">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M12 4v16M8 8l4-4 4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="20" r="2" fill="white" opacity="0.7" />
        </svg>
      </span>
      <span className="text-lg font-extrabold tracking-tight text-foreground">
        Bästa<span className="text-[var(--color-primary)]">elsparkcykeln</span>
      </span>
    </Link>
  );
}

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-bg)]/70">
      <div className="mx-auto max-w-[1080px] px-5">
        <div className="flex h-16 items-center justify-between">
          <BrandMark />

          <nav className="hidden items-center gap-1 md:flex">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-muted)] hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="/#produkter"
              className="ml-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
            >
              Se topplistan
            </a>
          </nav>

          <button
            type="button"
            aria-label="Meny"
            className="rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)] md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="border-t border-[var(--color-border)] py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {siteConfig.navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-muted)] hover:text-foreground"
                >
                  {item.label}
                </Link>
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
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-muted)]">
      <div className="mx-auto max-w-[1080px] px-5 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <BrandMark />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-text-muted)]">
              Oberoende tester och guider för elsparkcyklar i Sverige.
              Vi rangordnar efter prestanda, säkerhet och värde för pengarna.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.05em] text-[var(--color-text-subtle)]">Köpguider</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/" className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-foreground">Bästa Elsparkcykel 2026</Link></li>
              <li><a href="/#produkter" className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-foreground">Budget – under 5 000 kr</a></li>
              <li><a href="/#produkter" className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-foreground">Bäst för pendling</a></li>
              <li><Link to="/regler" className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-foreground">Regler & Lagar 2026</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.05em] text-[var(--color-text-subtle)]">Transparens</h3>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
              Sidan innehåller annonslänkar (annonssamarbete). Vi kan få provision när du
              köper via våra länkar — det påverkar aldrig vår rangordning och kostar dig inget extra.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-[var(--color-border)] pt-8">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p className="text-sm text-[var(--color-text-muted)]">
              © {currentYear} Elsparkcykeln.se
            </p>
            <p className="text-xs text-[var(--color-text-subtle)]">
              Priser kan ändras. Senast uppdaterad maj 2026.
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
      <div className="bg-[var(--color-primary)] px-4 py-1.5 text-center text-xs font-medium text-white">
        Annonssamarbete · Vi kan få provision vid köp via våra länkar
      </div>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ConsentBanner />
    </div>
  );
}
