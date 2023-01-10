export interface Trait {
  id: number;
  trait: string;
  description?: any;
}

export interface PositionTrait {
  id: number;
  trait: Trait;
  position: number;
  weight: number;
}

export interface Grade2 {
  id: number;
  position_trait: PositionTrait;
  score?: number;
  modified: string;
}

export interface Grade {
  id: number;
  number: number;
  position_prospect: number;
  grade: Grade2[];
}

export interface OverallPositionTrait {
  position_trait: number;
  percentage_score?: number;
  weighted_percentage_score?: number;
}

export interface Grading {
  grade: Grade[];
  overall_position_trait: OverallPositionTrait[];
  overall_grade: number;
}
