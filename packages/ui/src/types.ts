export interface AffiliateProduct {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  image?: string;
  rating?: number;
  price: {
    amount: number;
    currency?: string;
    period?: string;
    originalAmount?: number;
  };
  pros?: string[];
  cons?: string[];
  trackingUrl: string;
  badge?: string;
  features?: string[];
}
