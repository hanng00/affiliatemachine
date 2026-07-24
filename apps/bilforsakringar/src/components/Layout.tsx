import { Outlet, Link, useLocation } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePageView, ConsentBanner } from "@affiliate/analytics";
import { siteConfig } from "../config/site";

function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white shadow-sm">
        <Shield className="h-5 w-5" />
      </span>
      <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
        Bil<span className="text-[var(--color-primary)]">försäkringar</span>
      </span>
    </Link>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  usePageView(pathname, typeof document !== "undefined" ? document.title : siteConfig.title);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Affiliate disclosure strip — required for Swedish marknadsföringslagen */}
      <div className="bg-[var(--color-primary)] px-4 py-1.5 text-center text-xs font-medium text-white">
        Annonssamarbete · Vi kan få provision när du tecknar via våra länkar
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

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-background)]/85 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-background)]/70">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <BrandMark />

          <nav className="hidden items-center gap-1 md:flex">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-muted)] hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/"
              className="ml-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
            >
              Jämför priser
            </Link>
          </nav>

          <button
            type="button"
            className="rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-muted)] md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="border-t border-[var(--color-border)] py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {siteConfig.navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-muted)] hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
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
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-secondary)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <BrandMark />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-text-muted)]">
              Jämför bilförsäkringar från Sveriges största försäkringsbolag.
              Ange ditt registreringsnummer och se faktiska priser sida vid sida.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">Navigation</h3>
            <ul className="mt-4 space-y-2">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">Transparens</h3>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
              Sidan innehåller annonslänkar (annonssamarbete). Vi kan få provision när du
              tecknar via våra länkar — det påverkar aldrig vår jämförelse och kostar dig inget extra.
            </p>
            <ul className="mt-4 space-y-2">
              {siteConfig.footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[var(--color-border)] pt-8">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-[var(--color-text-muted)]">
              © {currentYear} {siteConfig.name}
            </p>
            <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-subtle)]">
              <Shield className="h-4 w-4 text-[var(--color-primary)]" />
              Oberoende jämförelse · Senast uppdaterad maj 2026
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
