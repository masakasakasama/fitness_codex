export type Effort = 'easy' | 'normal' | 'max';

export type TrainingEntry = {
  id: string;
  dateJst: string;
  equipmentId: string;
  weightKg: number;
  repsPerSet: number;
  setCount: number;
  effort?: Effort;
  note?: string;
  updatedAt: string;
};

export type EquipmentCategory = 'machine' | 'dumbbell' | 'cable' | 'cardio';

export type Equipment = {
  id: string;
  name: string;
  category: EquipmentCategory;
  active: boolean;
  updatedAt: string;
};

export type BodyLog = {
  id: string;
  measuredDateJst: string;
  weightKg: number;
  bodyFatPct?: number;
  muscleMassKg?: number;
  bmi: number;
  updatedAt: string;
};

export type Profile = {
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  trainingConstraint: 'weekend_only';
  updatedAt: string;
};
