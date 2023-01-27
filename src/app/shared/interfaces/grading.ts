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

export interface PositionTrait2 {
  id: number;
  trait: Trait2;
}

export interface OverallPositionTrait {
  position_trait: PositionTrait2;
  percentage_score?: number;
}

export interface Grading {
  grade: Grade[];
  overall_position_trait: OverallPositionTrait[];
  overall_grade: number;
}


export interface GradeSummary {
  user: string;
  summary: string;
  modified: string;
}

