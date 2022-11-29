export interface Position {
  id: number;
  position_name: string;
}

export interface Result {
  count: number;
  next?: any;
  previous?: any;
  results: Position[];
}
