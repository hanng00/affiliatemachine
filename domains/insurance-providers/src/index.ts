export * from "./types";
export { InsuranceProvider } from "./core/Provider";
export { ProviderRegistry, registry } from "./core/ProviderRegistry";
export { GjensidigeProvider } from "./providers/gjensidige";
export { TryggHansaProvider } from "./providers/trygghansa";
export { IfProvider } from "./providers/if";
export { mapIfResponse } from "./providers/if/mapper";
export { ifPriceResponseSchema } from "./providers/if/types";
export {
  IF_SALES_CHANNEL_ID,
  IF_SHOP_ID,
  IF_RECAPTCHA_SITE_KEY,
  IF_QUOTE_PAGE_URL,
  formatIfPersonnummer,
} from "./providers/if/form-config";

import { registry } from "./core/ProviderRegistry";
import { GjensidigeProvider } from "./providers/gjensidige";
import { TryggHansaProvider } from "./providers/trygghansa";
import { IfProvider } from "./providers/if";

registry.register(new GjensidigeProvider());
registry.register(new TryggHansaProvider());
registry.register(new IfProvider());
