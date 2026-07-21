import type { DnaPortalData } from "@/lib/dna/types";

export const MOCK_DNA_DATA: DnaPortalData = {
  petName: "Koko",
  sampleStage: "results_complete",
  breedComposition: [
    { breed: "Cane Corso", percentage: 74.8 },
    { breed: "Pekingese", percentage: 25.2 },
  ],
  markers: [
    {
      id: "mdr1",
      name: "MDR1 Gene Mutation",
      gene: "ABCB1 / MDR1",
      riskLevel: "carrier",
      description:
        "MDR1 affects how your dog metabolizes certain drugs and chemical preservatives. Carriers may show increased sensitivity to common veterinary medications and some food additives.",
      dietaryAction:
        "MDR1 detected: Automatically filtering out chemical preservatives and shifting protein sources to clean, gently-cooked turkey & venison to lower liver stress.",
    },
    {
      id: "dm",
      name: "Degenerative Myelopathy Risk",
      gene: "SOD1",
      riskLevel: "elevated",
      description:
        "Elevated risk for progressive spinal cord degeneration, common in larger breeds. Early nutritional support for joint and nerve health is clinically recommended.",
      dietaryAction:
        "Elevated DM risk: Enriching active recipe with collagen-supporting amino acids, omega-3s, and antioxidant-rich vegetables to support long-term mobility.",
    },
    {
      id: "pra",
      name: "Progressive Retinal Atrophy",
      gene: "PRCD",
      riskLevel: "clear",
      description:
        "No pathogenic variants detected for PRA. Retinal health markers are within normal genomic range for this breed mix.",
      dietaryAction:
        "Clear status: Maintaining baseline vitamin A and lutein-rich ingredients for ongoing ocular wellness.",
    },
  ],
};

export const SAMPLE_STAGES = [
  { id: "kit_sent" as const, label: "Swab Kit Sent" },
  { id: "sample_received" as const, label: "Sample Received" },
  { id: "lab_sequencing" as const, label: "Lab Sequencing" },
  { id: "results_complete" as const, label: "Results Complete" },
] as const;
