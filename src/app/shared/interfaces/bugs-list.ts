export interface Account {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  club_name: string;
  club_is_active: string;
  group: string;
  groups: number[];
}

export interface BugsList {
  id: number;
  account: Account;
  status: string;
  subject: string;
  message: string;
  created: string;
  modified: string;
}

export interface BugsListApi {
  count: number;
  next?: any;
  previous?: any;
  results: BugsList[];
}

export interface PostBugs {
  subject: string;
  message: string;
  myfile: any;
}

