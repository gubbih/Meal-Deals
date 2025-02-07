export interface Offer {
  name: string;
  price: number;
  priceCurrency: string;
  weight: number;
  weightUnit: string;
  offerStart: string;
  offerEnd: string;
  categories: string[];
}