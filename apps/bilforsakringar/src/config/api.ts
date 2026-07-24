import { apiHostname, getSite } from "@affiliate/sites";

const registry = getSite("bilforsakringar")!;

export const API_BASE_URL = import.meta.env.PROD
  ? `https://${apiHostname(registry.domain)}`
  : "http://localhost:8789";
