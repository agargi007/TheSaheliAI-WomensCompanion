export type LegalCategory =
  | "domestic_violence"
  | "child_custody"
  | "property_dispute"
  | "dowry_harassment"
  | "divorce"
  | "maintenance"
  | "sexual_harassment"
  | "workplace_harassment"
  | "witch_hunting"
  | "trafficking"
  | "early_marriage"
  | "inheritance_rights";

export interface LegalStep {
  stepNumber: number;
  instruction: string;
  icon: string;
  warning?: string;
  documents?: string[];
}

export interface LegalGuidance {
  id: string;
  category: LegalCategory;
  language: "en" | "hi" | "mr";
  title: string;
  summary: string;
  steps: LegalStep[];
  relatedLaws: string[];
  emergencyActions: string[];
  estimatedTime: string;
  helplineNumbers: string[];
}

export interface Case {
  id: string;
  userId: string;
  language: string;
  category: LegalCategory;
  queryText: string;
  guidanceReceived: LegalGuidance;
  status: "active" | "resolved" | "escalated";
  createdAt: string;
  updatedAt: string;
}

// Seed Knowledge Base for fallback when LLM lacks specific details
export const KNOWLEDGE_BASE: Record<string, LegalGuidance[]> = {
  domestic_violence: [
    {
      id: "dv-en-1",
      category: "domestic_violence",
      language: "en",
      title: "Domestic Violence Complaint",
      summary: "Steps to protect yourself and file a complaint under PWDVA 2005.",
      steps: [
        {
          stepNumber: 1,
          instruction: "Ensure your immediate safety. Move to a safe place if possible.",
          icon: "ShieldAlert",
        },
        {
          stepNumber: 2,
          instruction: "Call 181 Women's Helpline or 100 for Police.",
          icon: "Phone",
        },
        {
          stepNumber: 3,
          instruction: "File a complaint at the nearest police station.",
          icon: "FileText",
        }
      ],
      relatedLaws: ["Protection of Women from Domestic Violence Act 2005", "IPC 498A"],
      emergencyActions: ["Call 181", "Move to a safe shelter"],
      estimatedTime: "Immediate to 2 days",
      helplineNumbers: ["181", "100"],
    }
  ],
  // Add other categories...
};

export class AtomsCloudDB {
  static async saveCase(newCase: Omit<Case, "id" | "createdAt" | "updatedAt">): Promise<Case> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const c: Case = { ...newCase, id, createdAt: now, updatedAt: now };
    
    // In a real app, this goes to Atoms Cloud database
    console.log("Saving case to Atoms Cloud DB:", c);
    return c;
  }
}
