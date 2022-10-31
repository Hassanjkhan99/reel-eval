export interface Staff {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password1: string;
  password2: string;
}

export interface StaffList {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  club_id: number;
  club_name: string;
}

export interface StaffApi {
  count: number;
  next?: any;
  previous?: any;
  results: StaffList[];
}

