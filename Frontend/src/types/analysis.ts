// types/analysis.ts

// ------------------------------
// Indicator interface
// ------------------------------
export interface Indicator {
  name: string;        // e.g., "Frame Consistency" or "GAN Artifact Probability"
  score: number;       // 0..1
  details?: string;    // optional human-readable note
}

// ------------------------------
// Raw Python Results
// ------------------------------
export interface RawVideoResult {
  video: string;
  frames: number;
  real_votes: number;
  fake_votes: number;
  result: "REAL" | "FAKE" | string;
  analysis_time_ms?: number;
}

export interface RawImageResult {
  image: string;
  probability: number;                 // 0..1 probability of being real/fake
  result: "REAL" | "FAKE" | string;
  error?: string;                      // optional error message
}

// ------------------------------
// Unified Analysis Result
// ------------------------------
export interface AnalysisResult {
  // core fields
  isDeepfake: boolean;                // true if identified as deepfake
  confidence: number;                 // 0..1 (probability of being fake)
  riskLevel: "High" | "Moderate" | "Low";  // broader range for flexibility
  analysisTimeMs?: number;            // processing time in ms
  detectionMethod: string;            // e.g. "CNN Frame Voting" or "GAN Discriminator"
  frames?: number;                    // used only for videos
  indicators: Indicator[];            // detailed per-metric scores

  // new optional field to differentiate types
  mediaType: "video" | "image";

  // store whichever raw payload applies
  raw?: RawVideoResult | RawImageResult;
}
