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

export interface PostTraitsByPosition {
  trait: number;
  position: number;
  weight: number;
}

export interface TraitByPos {
  id: number;
  trait: number;
  position: number;
  weight: number;
  user: number;
  club_id: number;
  created: string;
  modified: string;
}

export interface GetTraitByPosApi {
  count: number;
  next?: any;
  previous?: any;
  results: TraitByPos[];
}
