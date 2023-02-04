export interface Customers {
  id: number;
  name: string;
  club_is_active: boolean;
  reel_eval_customer: boolean;
}

export interface CustomersApi {
  count: number;
  next?: any;
  previous?: any;
  results: Customers[];
}

export interface editCustomer {
  club_is_active: boolean;
  reel_eval_customer: boolean;
}
