import { cn } from "../../lib/utils";

interface FooterProps {
  siteName: string;
  links?: { label: string; href: string }[];
  className?: string;
}

export function Footer({ siteName, links = [], className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("border-t bg-muted/50", className)}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {siteName}. Alla rättigheter förbehållna.
          </p>

          {links.length > 0 && (
            <nav className="flex gap-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Denna sida innehåller affiliatelänkar. Vi kan få provision om du köper via våra länkar, utan extra kostnad
          för dig.
        </p>
      </div>
    </footer>
  );
}
