import { useCallback } from "react";
import { trackAffiliateClick } from "../events";

interface UseTrackClickOptions {
  linkId: string;
  program?: string;
  placement?: string;
  destinationUrl: string;
}

export function useTrackClick({ linkId, program, placement, destinationUrl }: UseTrackClickOptions) {
  return useCallback(() => {
    trackAffiliateClick({
      affiliate_link_id: linkId,
      affiliate_program: program,
      placement,
      destination_url: destinationUrl,
    });
  }, [linkId, program, placement, destinationUrl]);
}
