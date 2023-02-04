export interface BarReportApi {
  count: number;
  next?: any;
  previous?: any;
  results: BarReport[];
}

export interface Prospect {
  id: number;
  first_name: string;
  last_name: string;
  classification: string;
  state: string;
  school: string;
  video_link?: any;
}

export interface Position {
  id: number;
  position_name: string;
  abbreviation: string;
  sob: string;
}

export interface Trait {
  id: number;
  trait: string;
}

export interface PositionTrait {
  id: number;
  trait: Trait;
}

export interface OverallPositionTrait {
  position_trait: PositionTrait;
  percentage_score: number;
}

export interface Grade {
  overall_position_trait: OverallPositionTrait[];
  overall_grade: number;
  user: string;
  modified: string;
}

export interface BarReport {
  id: number;
  prospect: Prospect;
  position: Position;
  grade: Grade;
}


export interface Position {
  id: number;
  position_name: string;
  abbreviation: string;
  sob: string;
}

export interface PositionProspect {
  id: number;
  prospect: Prospect;
  position: Position;
  created: string;
  modified: string;
}

export interface PositionProspectApi {
  count: number;
  next?: any;
  previous?: any;
  results: PositionProspect[];
}

export interface GetSummary {
  user: string;
  summary: string;
  modified: string;
}
