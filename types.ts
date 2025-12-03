export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  tags: string[];
}

export type EventType = 'SEARCH' | 'CLICK' | 'ADD_TO_CART' | 'VIEW_DETAILS';

export interface UserEvent {
  id: string;
  timestamp: number;
  type: EventType;
  details: string; // e.g., "Searched for shoes" or "Clicked Nike Air"
  metadata?: Record<string, any>;
}

export interface MarketingInsight {
  summary: string;
  userPersona: string;
  predictedInterests: string[];
  marketingStrategy: string;
}