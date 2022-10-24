export interface Staff {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password1: string;
  password2: string;
}

export interface Result {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  club_id: number;
  club_name: string;
}

export interface StaffList {
  count: number;
  next?: any;
  previous?: any;
  results: Result[];
}

