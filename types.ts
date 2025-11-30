export type ThemeType = 'cyberpunk' | 'cozy' | 'minimalist';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  aiInsight?: string;
  detectedBrand?: string;
}

export interface UserState {
  level: number;
  xp: number;
  maxXp: number;
  streak: number;
  coins: number;
  unlockedThemes: ThemeType[];
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string; // Emoji or icon name
}

export interface AIAnalysisResult {
  amount: number;
  category: string;
  description: string;
  brand: string;
  confidence: number;
}