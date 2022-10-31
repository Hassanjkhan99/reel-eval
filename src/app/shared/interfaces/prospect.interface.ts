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
  position: Position;
  classification: string;
  state: string;
  school: string;
  video_link: string;
  club: number;
  user: number;
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

export interface Position {
  id: number;
  position_name: string;
}
