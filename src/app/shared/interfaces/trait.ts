export interface Trait {
  id: number;
  trait: string;
  description?: any;
}

export interface TraitsApiResponse {
  count: number;
  next: string;
  previous?: any;
  results: Trait[];
}
