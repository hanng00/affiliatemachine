import { useCallback } from "react";
import { trackAffiliateClick } from "../events";

interface UseTrackClickOptions {
  linkId: string;
  program?: string;
  placement?: string;
  destinationUrl: string;
  subId?: string;
}

export function useTrackClick({ linkId, program, placement, destinationUrl, subId }: UseTrackClickOptions) {
  return useCallback(() => {
    trackAffiliateClick({
      affiliate_link_id: linkId,
      affiliate_program: program,
      placement,
      destination_url: destinationUrl,
      sub_id: subId,
    });
  }, [linkId, program, placement, destinationUrl, subId]);
}
