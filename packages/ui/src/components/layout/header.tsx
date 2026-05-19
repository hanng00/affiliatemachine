import { cn } from "../../lib/utils";

interface HeaderProps {
  siteName: string;
  logo?: string;
  navigation?: { label: string; href: string }[];
  className?: string;
}

export function Header({ siteName, logo, navigation = [], className }: HeaderProps) {
  return (
    <header className={cn("border-b bg-background", className)}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2">
          {logo && <img src={logo} alt={siteName} className="h-8 w-8" />}
          <span className="text-xl font-bold">{siteName}</span>
        </a>

        {navigation.length > 0 && (
          <nav className="hidden md:flex md:gap-6">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
