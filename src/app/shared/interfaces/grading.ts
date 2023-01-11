export interface Trait {
  id: number;
  trait: string;
}

export interface PositionTrait {
  id: number;
  trait: Trait;
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
  grade: Grade2[];
}

export interface Trait2 {
  id: number;
  trait: string;
}

export interface OverallPositionTrait {
  trait: Trait2;
  percentage_score?: number;
  weighted_percentage_score?: number;
}

export interface Grading {
  grade: Grade[];
  overall_position_trait: OverallPositionTrait[];
  overall_grade: number;
}
