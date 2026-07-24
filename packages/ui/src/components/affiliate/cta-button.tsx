import { ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface CTAButtonProps {
  href: string;
  trackingId?: string;
  children: React.ReactNode;
  showIcon?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function CTAButton({
  href,
  trackingId,
  children,
  showIcon = true,
  size = "default",
  className,
}: CTAButtonProps) {
  const handleClick = () => {
    if (trackingId && typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "affiliate_click", {
        affiliate_link_id: trackingId,
        destination_url: href,
      });
    }
  };

  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    default: "h-10 px-4 py-2",
    lg: "h-11 px-8 text-base",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        sizeClasses[size],
        className
      )}
    >
      {children}
      {showIcon && <ExternalLink className="h-4 w-4" />}
    </a>
  );
}
