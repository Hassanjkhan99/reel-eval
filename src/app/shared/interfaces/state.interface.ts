export interface States {
  id: number;
  state_name: string;
}

export interface StateApi {
  count: number;
  next: string;
  previous?: any;
  results: States[];
}
