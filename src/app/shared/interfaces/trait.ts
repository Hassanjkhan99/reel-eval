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

export interface TraitPos {
  id: number;
  trait: string;
  club_id: number;
  description?: any;
}

export interface TraitsByPosition {
  id: number;
  trait: TraitPos;
  position: number;
  weight: number;
  user: number;
  club_id: number;
  created: string;
  modified: string;
}
