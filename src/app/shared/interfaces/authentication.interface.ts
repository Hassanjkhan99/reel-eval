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
  reel_eval_admin: boolean;
  club_is_active: boolean;
  club_id: number;
  reel_eval_customer: boolean;
  last_name: string;
  groups: number[];
  id: number;
  club_name: string;
  first_name: string;
  email: string;
  username: string;
  group: string;
  banner: string;
}
