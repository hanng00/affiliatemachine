import { cn } from "@/lib/utils";
import { trackAffiliateClick, buildSubId, appendSubId } from "@affiliate/analytics";
import { siteConfig } from "@/config/site";

interface CTAButtonProps {
  href: string;
  trackingId?: string;
  placement?: string;
  children: React.ReactNode;
  showIcon?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function CTAButton({
  href,
  trackingId,
  placement,
  children,
  showIcon = true,
  size = "default",
  className,
}: CTAButtonProps) {
  const subId = trackingId ? buildSubId(siteConfig.slug, placement, trackingId) : undefined;
  const destination = subId ? appendSubId(href, subId) : href;

  const handleClick = () => {
    if (!trackingId) return;
    trackAffiliateClick({
      affiliate_link_id: trackingId,
      affiliate_program: siteConfig.adtractionChannelId || undefined,
      placement,
      destination_url: destination,
      sub_id: subId,
    });
  };

  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    default: "h-10 px-4 py-2",
    lg: "h-11 px-8 text-base",
  };

  return (
    <a
      href={destination}
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
      {showIcon && (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      )}
    </a>
  );
}
