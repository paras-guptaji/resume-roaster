export type Role =
  | "frontend"
  | "backend"
  | "fullstack"
  | "ai-ml"
  | "data-analyst"
  | "devops"
  | "product-manager"
  | "designer";

export interface RoleOption {
  value: Role;
  label: string;
  emoji: string;
}

export const ROLES: RoleOption[] = [
  { value: "frontend", label: "Frontend Developer", emoji: "🎨" },
  { value: "backend", label: "Backend Developer", emoji: "⚙️" },
  { value: "fullstack", label: "Full-Stack Developer", emoji: "🚀" },
  { value: "ai-ml", label: "AI/ML Engineer", emoji: "🤖" },
  { value: "data-analyst", label: "Data Analyst", emoji: "📊" },
  { value: "devops", label: "DevOps Engineer", emoji: "🔧" },
  { value: "product-manager", label: "Product Manager", emoji: "📋" },
  { value: "designer", label: "Designer", emoji: "✨" },
];

export type RoastIntensity = "mild" | "medium" | "extra-crispy";

export interface BulletAnalysis {
  original: string;
  strength: "weak" | "average" | "strong";
  issue: string;
  fixed: string;
}

export interface RejectionReason {
  title: string;
  description: string;
}

export interface LieDetectorFlag {
  claim: string;
  issue: string;
  severity: "warning" | "suspicious" | "red-flag";
}

export interface InterviewQuestion {
  question: string;
  context: string;
  idealAnswer: string;
}

export interface ResumeAnalysis {
  // The roast
  roast: string;
  
  // Confidence score (0-100)
  confidenceScore: number;
  scoreBreakdown: {
    metricsUsage: number;
    actionVerbs: number;
    clarity: number;
    roleAlignment: number;
  };
  
  // Rejection reasons
  rejectionReasons: RejectionReason[];
  
  // Bullet analysis
  bullets: BulletAnalysis[];
  
  // ATS Keywords
  missingKeywords: string[];
  injectedKeywords: string[];
  
  // Lie detector
  lieDetectorFlags: LieDetectorFlag[];
  
  // Interview questions
  interviewQuestions: InterviewQuestion[];
}

export interface ResumeInput {
  content: string;
  role: Role;
  intensity: RoastIntensity;
}
