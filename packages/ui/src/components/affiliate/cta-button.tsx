import { ExternalLink } from "lucide-react";
import { Button, type ButtonProps } from "../ui/button";
import { cn } from "../../lib/utils";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface CTAButtonProps extends Omit<ButtonProps, "asChild"> {
  href: string;
  trackingId?: string;
  children: React.ReactNode;
  showIcon?: boolean;
}

export function CTAButton({ href, trackingId, children, showIcon = true, className, ...props }: CTAButtonProps) {
  const handleClick = () => {
    if (trackingId && typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "affiliate_click", {
        affiliate_link_id: trackingId,
        destination_url: href,
      });
    }
  };

  return (
    <Button asChild className={cn("gap-2", className)} {...props}>
      <a href={href} target="_blank" rel="noopener noreferrer sponsored" onClick={handleClick}>
        {children}
        {showIcon && <ExternalLink className="h-4 w-4" />}
      </a>
    </Button>
  );
}
