import { useCallback, useRef } from "react";
import { trackActivationOnce } from "../events";

/**
 * Returns a stable callback that fires the page's `activation` event at most
 * once per mount *and* once per session (sessionStorage-guarded). The in-memory
 * ref short-circuits repeated calls (e.g. on every slider change) without
 * touching storage each time.
 */
export function useTrackActivation(kind: string) {
  const firedRef = useRef(false);
  return useCallback(
    (value?: number) => {
      if (firedRef.current) return;
      firedRef.current = true;
      trackActivationOnce({ kind, value });
    },
    [kind]
  );
}
