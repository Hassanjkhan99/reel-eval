export interface SignUp {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password1: string;
  password2: string;
  club_name: string;
}

export interface Login {
  username: string;
  password: string;

}


export interface UserMe {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  club_id: number;
  club_name: string;
  club_is_active: string;
  group: string;
  groups: number[];
}
