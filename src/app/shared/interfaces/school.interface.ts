export interface Schools {
  id: number;
  state_name: string;
  school_name: string;
}

export interface SchoolApi {
  count: number;
  next: string;
  previous?: any;
  results: Schools[];
}
