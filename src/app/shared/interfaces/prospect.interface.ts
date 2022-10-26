export interface ProspectApi {
  count: number;
  next: string;
  previous?: any;
  results: Prospect[];
}

export interface Prospect {
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

export interface ProspectForm {
  first_name: string;
  last_name: string;
  position: number;
  classification: string;
  state: string;
  school: string;
  video_link: string;
}
