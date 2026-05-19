import { useEffect } from "react";
import { trackPageView } from "../events";

export function usePageView(path: string, title: string): void {
  useEffect(() => {
    trackPageView(path, title);
  }, [path, title]);
}
