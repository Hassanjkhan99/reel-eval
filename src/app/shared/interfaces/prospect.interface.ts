export interface Prospect {
  count: number;
  next: string;
  previous?: any;
  results: Result[];
}

export interface Result {
  id: number;
  first_name: string;
  last_name: string;
  position: number;
  position_name: string;
  classification: string;
  state: string;
  school: string;
  video_link: string;
  club: number;
  user: number;
  club_name: string;
  archived: boolean;
  unique_id: string;
  unique_id_without_club: string;
  created: string;
  modified: string;
}

