import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  name: string;
  href: string;
}

/** Visual breadcrumb. Pair with a BreadcrumbList JSON-LD on the page for SEO. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Brödsmulor" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-[var(--color-text-muted)]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1">
              {last ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link to={item.href} className="hover:text-foreground transition-colors">
                  {item.name}
                </Link>
              )}
              {!last && <ChevronRight className="h-3.5 w-3.5 text-[var(--color-text-subtle)]" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
