// =============================
//  src/types/index.ts
// =============================

// --- Projet de base (backend/DB) ---
export interface Project {
  id?: number;
  sector: string;
  city: string;
  funding_amount: number;
  business_summary: string;
  target_radius: number;
  user_id?: number;
}

// --- Messages simples venant de l’API (optionnel) ---
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

// --- Structure d’un business plan complet ---
export interface BusinessPlan {
  id: number;
  viability_score: number;
  plan: {
    executive_summary: string;
    business_description: string;
    market_analysis: any;
    marketing_plan: string;
    operations_plan: string;
    hr_plan: string;
    financials: any;
    financing_plan: any;
    roi: any;
  };
}

// --- Réponse générique d’API ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// --- Données projet manipulées côté app ---
export interface ProjectData {
  secteur: string;
  ville: string;
  financement: string;
  resume: string;
}

// --- Message dans le chat de l’app ---
export interface Message {
  id: string;
  content: string;          // ✅ corrigé : texte du message
  isUser: boolean;          // vrai si l’utilisateur a écrit
  timestamp: Date;
  isBusinessPlan?: boolean; // tag spécial pour marquer un message contenant un plan
}

// --- Projet sauvegardé ---
export interface SavedProject {
  id: string;
  name: string;
  data: ProjectData;
  createdAt: Date;
  lastModified: Date;
}

// --- Infos utilisateur ---
export interface UserData {
  name: string;
  email: string;
  joinDate: string;
  avatar?: string;
}
