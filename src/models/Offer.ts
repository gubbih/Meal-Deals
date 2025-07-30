export interface MatchedItem {
  accuracy: number;
  category: string;
  name: string;
}

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
  matchedItems: MatchedItem[];
  store: string;
  catelogid: string;
  productId: string;
  isOrganic: boolean;
  confidence: number;
}
