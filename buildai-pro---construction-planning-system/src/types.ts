export interface ProjectMetrics {
  totalCost: number;
  laborCost: number;
  materialCost: number;
  overhead: number;
  totalWorkers: number;
  totalLabourDays: number;
  durationDays: number;
}

export interface WorkforcePlanning {
  masons: number;
  helpers: number;
  carpenters: number;
  steelWorkers: number;
  electricians: number;
  plumbers: number;
  totalLabourDays: number;
}

export interface MaterialRequirements {
  steel: number;
  cement: number;
  sand: number;
  water: number;
  bricks: number;
  aggregates: number;
}

export interface ScheduleItem {
  week: number;
  phase: string;
  activities: string[];
}

export interface Room {
  name: string;
  dim: string;
}

export interface Blueprint {
  floor: string;
  rooms: Room[];
}

export interface EnvironmentalImpact {
  carbonFootprint: string;
  waterUsage: string;
  sustainabilityTips: string[];
}

export interface ProjectPlan {
  id?: number;
  timestamp?: string;
  inputs: ProjectInputs;
  metrics: ProjectMetrics;
  workforce: WorkforcePlanning;
  materials: MaterialRequirements;
  schedule: ScheduleItem[];
  blueprints: Blueprint[];
  tips: string[];
  optimizationSuggestions: string[];
  environmentalImpact: EnvironmentalImpact;
}

export interface ProjectInputs {
  plotArea: number;
  unit: 'sqft' | 'sqyard';
  floors: number;
  buildingType: 'Residential' | 'Commercial';
  location: string;
  timeline: string;
  dailyWage: number;
  costPerSqUnit: number;
}
