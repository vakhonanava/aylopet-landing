export type SampleStage =
  | "kit_sent"
  | "sample_received"
  | "lab_sequencing"
  | "results_complete";

export interface BreedSegment {
  breed: string;
  percentage: number;
}

export type RiskLevel = "elevated" | "carrier" | "clear";

export interface GeneticMarker {
  id: string;
  name: string;
  gene: string;
  riskLevel: RiskLevel;
  description: string;
  dietaryAction: string;
}

export interface DnaPortalData {
  petName: string;
  sampleStage: SampleStage;
  breedComposition: BreedSegment[];
  markers: GeneticMarker[];
}
