export interface Prospect {
  id: number;
  first_name: string;
  last_name: string;
  classification: string;
  state: string;
  school: string;
  user: number;
}

export interface Position {
  id: number;
  position_name: string;
  abbreviation: string;
}

export interface Result {
  prospect: Prospect;
  position: Position;
  score: number;
  iga_score?: number;
  user: number;
  user_full_name: string;
  quadrant: string;
}

export interface Report {
  count: number;
  next?: any;
  previous?: any;
  results: Result[];
}

