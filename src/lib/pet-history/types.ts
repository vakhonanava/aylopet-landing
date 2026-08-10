/**
 * Domain types for the pet health history module.
 *
 * Two deliberately separate halves:
 *
 * - `PetHistory` — everything the owner types in. Persisted as one `history`
 *   JSONB column on `pets` (migration 007).
 * - `PetTelemetry` — read-only feeds written by other systems: the DNA lab
 *   pipeline, the Smart Collar ingest, and AylopetAI. The dashboard never
 *   writes these, so they stay out of the owner-edited blob to avoid two
 *   writers racing on one column.
 *
 * Existing shapes are reused, not redefined: `VaccineEntry` (vaccines +
 * antiparasitic, discriminated by `careType`), `MedicalRecord` (allergies,
 * chronic conditions), and `LabReportEntry` (medical vault) all come from
 * `@/lib/dashboard` and `@/lib/medical`.
 */

// ---------------------------------------------------------------------------
// 1 · Identification & biometrics
// ---------------------------------------------------------------------------

export type Sex = "male" | "female";

export type NeuterStatus = "intact" | "neutered";

export interface ReproductiveStatus {
  sex: Sex;
  status: NeuterStatus;
  /** ISO date. Only meaningful when `status` is "neutered". */
  procedureDate?: string;
}

/** Result of checking the chip against a national/international registry. */
export type MicrochipRegistryStatus =
  | "registered"
  | "pending"
  | "not_found"
  | "unchecked";

export interface MicrochipRegistration {
  /** 15-digit ISO 11784/11785 transponder code. */
  code: string;
  registryName: string;
  status: MicrochipRegistryStatus;
  /** ISO timestamp of the last successful registry lookup. */
  verifiedAt: string | null;
  implantedAt?: string;
}

/** Purina/WSAVA 9-point body condition score. */
export type BcsScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface WeightLogEntry {
  id: string;
  /** ISO date (day precision — weight is logged, not streamed). */
  recordedAt: string;
  weightKg: number;
  bcs?: BcsScore;
  note?: string;
}

export interface WeightTargetRange {
  minKg: number;
  maxKg: number;
}

// ---------------------------------------------------------------------------
// 4 · Nutrition
// ---------------------------------------------------------------------------

export type DietType =
  | "aylopet_fresh"
  | "dry"
  | "wet"
  | "raw"
  | "prescription"
  | "mixed";

export interface DietProfile {
  type: DietType;
  productName?: string;
  mealsPerDay: number;
  /** Energy density of the current food, used to turn kcal into grams. */
  kcalPer100g?: number;
  /** Required context when `type` is "prescription". */
  prescriptionReason?: string;
  startedAt?: string;
}

export type AppetiteLevel = "refused" | "poor" | "normal" | "eager";

/**
 * Derived, never stored — recomputed whenever weight, age, activity or the
 * neuter flag changes, so it can't drift out of sync with the profile.
 */
export interface CalorieTarget {
  /** Resting energy requirement, kcal/day. */
  rerKcal: number;
  /** Maintenance energy requirement, kcal/day. */
  merKcal: number;
  /** Life-stage/activity multiplier applied to RER. */
  factor: number;
  factorLabel: string;
  /** Null when the current food has no declared energy density. */
  gramsPerDay: number | null;
  gramsPerMeal: number | null;
}

// ---------------------------------------------------------------------------
// 3 · Genetics (read-only feed)
// ---------------------------------------------------------------------------

export type DnaSampleStatus =
  | "not_ordered"
  | "kit_sent"
  | "sample_received"
  | "sequencing"
  | "complete";

export type GeneticRiskCategory =
  | "cardiac"
  | "ocular"
  | "neurological"
  | "musculoskeletal"
  | "metabolic"
  | "dermatological"
  | "drug_sensitivity";

/** Standard canine genotype call for a single-locus condition. */
export type GeneticRiskLevel = "clear" | "carrier" | "at_risk";

export interface GeneticRiskMarker {
  id: string;
  condition: string;
  category: GeneticRiskCategory;
  level: GeneticRiskLevel;
  /** Gene symbol, e.g. "MDR1", "DCM2". */
  gene: string;
  summary: string;
}

export interface AncestrySegment {
  breed: string;
  /** 0–100; the segments of one profile are expected to sum to ~100. */
  percentage: number;
  /** FCI group or similar clade label. */
  group?: string;
}

export interface DnaProfile {
  sampleId: string;
  status: DnaSampleStatus;
  collectedAt: string | null;
  processedAt: string | null;
  markersScanned: number;
  markersTotal: number;
  ancestry: AncestrySegment[];
  risks: GeneticRiskMarker[];
  /** Coefficient of inbreeding, 0–100. */
  coiPercent?: number;
}

/**
 * DNA results the owner already holds from a third-party lab (Embark, Wisdom
 * Panel, a university clinic…). Deliberately lighter than `DnaProfile`: there
 * is no Aylopet sample id and no SNP count to report, and inventing one would
 * misrepresent someone else's test.
 */
export interface OwnerDnaRecord {
  /** Lab or test brand that produced the result. */
  provider: string;
  testedAt: string | null;
  ancestry: AncestrySegment[];
  risks: GeneticRiskMarker[];
  notes?: string;
}

// ---------------------------------------------------------------------------
// 5 · Smart Collar (read-only feed)
// ---------------------------------------------------------------------------

export type CollarConnectionStatus =
  | "not_paired"
  | "online"
  | "offline"
  | "charging";

export interface SmartCollarDevice {
  serial: string;
  status: CollarConnectionStatus;
  batteryPercent: number;
  firmwareVersion: string;
  lastSyncAt: string | null;
}

export interface DailyActivityMetrics {
  /** ISO date. */
  date: string;
  steps: number;
  distanceKm: number;
  activeMinutes: number;
  restMinutes: number;
  caloriesBurned: number;
  sleepHours: number;
  /** 0–100 composite sleep quality score. */
  sleepScore: number;
}

export type SafeZoneState = "inside" | "outside" | "unknown";

export interface SafeZone {
  id: string;
  name: string;
  radiusMeters: number;
  state: SafeZoneState;
}

export interface GeoFix {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  recordedAt: string;
}

export type BehaviourSignal =
  | "barking"
  | "anxiety"
  | "scratching"
  | "restlessness";

export interface BehaviouralLog {
  id: string;
  date: string;
  signal: BehaviourSignal;
  /** Events counted in the period. */
  count: number;
  /** Rolling personal baseline for the same signal. */
  baseline: number;
}

export interface SmartCollarMetrics {
  device: SmartCollarDevice;
  today: DailyActivityMetrics | null;
  /** Most recent days first is NOT assumed — sort before charting. */
  history: DailyActivityMetrics[];
  safeZones: SafeZone[];
  lastFix: GeoFix | null;
  behaviour: BehaviouralLog[];
}

// ---------------------------------------------------------------------------
// 6 · AylopetAI (read-only feed)
// ---------------------------------------------------------------------------

export type ConsultationStatus = "resolved" | "monitoring" | "escalated";

export interface AiConsultationThread {
  id: string;
  startedAt: string;
  topic: string;
  messageCount: number;
  summary: string;
  recommendations: string[];
  status: ConsultationStatus;
}

export type InsightSource =
  | "dna"
  | "weight"
  | "collar"
  | "nutrition"
  | "medical";

export type InsightPriority = "info" | "attention" | "urgent";

export interface AiInsight {
  id: string;
  generatedAt: string;
  title: string;
  body: string;
  priority: InsightPriority;
  /** Which data streams the suggestion was synthesised from. */
  sources: InsightSource[];
}

// ---------------------------------------------------------------------------
// 7 · Contacts & emergency
// ---------------------------------------------------------------------------

export interface VetContact {
  clinicName: string;
  vetName: string;
  /** E.164 preferred — rendered into a `tel:` link. */
  phone: string;
  emergencyPhone?: string;
  email?: string;
  address?: string;
}

export interface CaretakerNotes {
  routine: string;
  feeding: string;
  medication: string;
  behaviour: string;
  emergency: string;
  updatedAt: string | null;
}

// ---------------------------------------------------------------------------
// Aggregates
// ---------------------------------------------------------------------------

/** Owner-authored history. Persisted as `pets.history` (JSONB). */
export interface PetHistory {
  reproductive: ReproductiveStatus | null;
  microchip: MicrochipRegistration | null;
  weightLogs: WeightLogEntry[];
  weightTarget: WeightTargetRange | null;
  diet: DietProfile | null;
  vet: VetContact | null;
  caretaker: CaretakerNotes | null;
  /** Third-party DNA results, entered by the owner until the lab ships. */
  dna: OwnerDnaRecord | null;
}

/** Machine-written feeds. Never mutated by this dashboard. */
export interface PetTelemetry {
  dna: DnaProfile | null;
  collar: SmartCollarMetrics | null;
  consultations: AiConsultationThread[];
  insights: AiInsight[];
}

export function emptyPetHistory(): PetHistory {
  return {
    reproductive: null,
    microchip: null,
    weightLogs: [],
    weightTarget: null,
    diet: null,
    vet: null,
    caretaker: null,
    dna: null,
  };
}

export function emptyPetTelemetry(): PetTelemetry {
  return { dna: null, collar: null, consultations: [], insights: [] };
}
