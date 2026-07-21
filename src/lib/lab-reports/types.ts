export type LabReportMimeType =
  | "application/pdf"
  | "image/jpeg"
  | "image/png";

export interface LabReportRecord {
  id: string;
  petId: string;
  name: string;
  size: number;
  mimeType: LabReportMimeType;
  storagePath: string;
  url: string;
  uploadedAt: string;
  status: "uploaded";
}

export const LAB_RESULTS_BUCKET = "lab-results";
