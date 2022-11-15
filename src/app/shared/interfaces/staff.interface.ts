export interface Staff {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password1: string;
  password2: string;
  groups: number[];
  id: number;

}

export interface StaffList {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  club_id: number;
  club_name: string;
  group: string;
  groups: number[];
}

export interface StaffApi {
  count: number;
  next?: any;
  previous?: any;
  results: StaffList[];
}

export interface Group {
  count: number;
  next?: any;
  previous?: any;
  results: GroupList[];
}

export interface GroupList {
  id: number;
  name: string;
}
