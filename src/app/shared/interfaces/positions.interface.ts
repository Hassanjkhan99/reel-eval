export interface Result {
  id: number;
  position_name: string;
}

export interface Positions {
  count: number;
  next?: any;
  previous?: any;
  results: Result[];
}
