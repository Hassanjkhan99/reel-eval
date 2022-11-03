export interface Traits {
  id: number;
  trait: string;
  description?: any;
}

export interface TraitsApiResponse {
  count: number;
  next: string;
  previous?: any;
  results: Traits[];
}
