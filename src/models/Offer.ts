export interface Offer {
  id: string;
  name: string;
  price: number;
  priceCurrency: string;
  weight: number;
  weightUnit: string;
  offerStart: string;
  offerEnd: string;
  category: string[];
  matchedItems: string[];
  store: string;
  catelogid: string;
}
